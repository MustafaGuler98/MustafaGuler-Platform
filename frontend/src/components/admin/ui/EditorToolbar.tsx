import { type Editor } from '@tiptap/react';
import { 
    Bold, Italic, Strikethrough, Code, 
    Heading1, Heading2, Heading3, 
    List, ListOrdered, Quote, Minus,
    Link as LinkIcon, Image as ImageIcon,
    ChevronDown,
    type LucideIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Table, Trash2, Code2
} from 'lucide-react';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

type ImageNodeLike = {
    attrs: Record<string, unknown>;
    type: {
        name: string;
    };
};

type SelectionWithNode = {
    empty?: boolean;
    from: number;
    node?: ImageNodeLike | null;
};

type ImageSnapshot = {
    attrs: Record<string, unknown>;
    pos: number;
};

const updateImageAttributes = (editor: Editor, attrs: Record<string, unknown>) => {
    const selection = editor.state.selection as SelectionWithNode;
    if (editor.isActive('image')) {
        editor.chain().focus().updateAttributes('image', attrs).run();
    } else if (selection.node?.type.name === 'image') {
        editor.chain().focus().command(({ tr }) => {
            tr.setNodeMarkup(selection.from, undefined, {
                ...selection.node.attrs,
                ...attrs
            });
            return true;
        }).run();
    }
};

const getSelectedImageSnapshot = (editor: Editor): ImageSnapshot | null => {
    const selection = editor.state.selection as SelectionWithNode;
    const isImage = editor.isActive('image') || selection.node?.type.name === 'image';

    if (!isImage) {
        return null;
    }

    const pos = selection.from;
    const node = editor.state.doc.nodeAt(pos) ?? selection.node;

    if (!node || node.type.name !== 'image') {
        return null;
    }

    const domNode = editor.view.nodeDOM(pos);
    const domImage = domNode instanceof HTMLImageElement ? domNode : null;
    const originalWidth = node.attrs.originalWidth ?? domImage?.naturalWidth ?? null;

    return {
        pos,
        attrs: {
            ...node.attrs,
            ...(originalWidth ? { originalWidth } : {}),
        },
    };
};

// Align helper: if an image is selected, set its alignment attribute; otherwise use TextAlign
const handleAlign = (editor: Editor, alignment: string) => {
    const selection = editor.state.selection as SelectionWithNode;
    const isImage = editor.isActive('image') || selection.node?.type.name === 'image';

    if (isImage) {
        updateImageAttributes(editor, { alignment });
    } else {
        editor.chain().focus().setTextAlign(alignment).run();
    }
};

interface EditorToolbarProps {
    editor: Editor;
    isSourceMode?: boolean;
    onToggleSource?: () => void;
}

interface ToolbarButtonProps {
    disabled?: boolean;
    icon: LucideIcon;
    isActive: boolean;
    onClick: () => void;
    title: string;
}

function ToolbarButton({ onClick, isActive, icon: Icon, title, disabled }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`
                p-2 rounded transition-all duration-200 
                ${isActive ? 'bg-primary/20 text-cyan-neon shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-muted-foreground hover:bg-primary/20 hover:text-cyan-neon'}
                ${disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}
            `}
        >
            <Icon size={16} />
        </button>
    );
}

export function EditorToolbar({ editor, isSourceMode, onToggleSource }: EditorToolbarProps) {
    const [, forceRender] = useReducer((value: number) => value + 1, 0);

    useEffect(() => {
        const rerender = () => {
            forceRender();
        };

        editor.on('selectionUpdate', rerender);
        editor.on('transaction', rerender);

        return () => {
            editor.off('selectionUpdate', rerender);
            editor.off('transaction', rerender);
        };
    }, [editor]);

    // Explicitly check for NodeSelection since isActive('image') can sometimes fail for block-level images
    const selection = editor.state.selection as SelectionWithNode;
    const isImageSelected = editor.isActive('image') || selection.node?.type.name === 'image';
    const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);
    const sizeMenuRef = useRef<HTMLDivElement | null>(null);

    const savedImage = useRef<ImageSnapshot | null>(null);

    useEffect(() => {
        if (!isSizeMenuOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!sizeMenuRef.current?.contains(event.target as Node)) {
                setIsSizeMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSizeMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isSizeMenuOpen]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        
        // Handle empty selection
        if (editor.state.selection.empty) {
            const url = window.prompt('Enter URL:', previousUrl || 'https://');
            if (url === null) return;

            const text = window.prompt('Enter Link Text:', 'Link');
            if (text === null || text === '') return;

            editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
        } 
        // Handle active selection
        else {
            const url = window.prompt('Enter URL for selected text:', previousUrl || 'https://');
            
            if (url === null) return; 

            if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
            }

            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Enter Image URL:');
        
        if (url) {
            const image = new window.Image();
            image.onload = () => {
                editor.chain().focus().setImage({
                    src: url,
                    originalWidth: image.naturalWidth || null,
                }).run();
            };
            image.onerror = () => {
                editor.chain().focus().setImage({ src: url }).run();
            };
            image.src = url;
        }
    }, [editor]);

    const applyImageWidth = useCallback((selectedWidth: string) => {
        const snapshot = savedImage.current ?? getSelectedImageSnapshot(editor);
        if (!snapshot) {
            setIsSizeMenuOpen(false);
            return;
        }

        const nextWidth = selectedWidth === '100%' ? null : selectedWidth;

        editor.chain().focus().command(({ tr }) => {
            const node = tr.doc.nodeAt(snapshot.pos);
            if (!node || node.type.name !== 'image') {
                return false;
            }

            tr.setNodeMarkup(snapshot.pos, undefined, {
                ...node.attrs,
                ...snapshot.attrs,
                width: nextWidth,
            });

            return true;
        }).run();

        editor.commands.setNodeSelection(snapshot.pos);
        savedImage.current = null;
        setIsSizeMenuOpen(false);
    }, [editor]);

    const toggleSizeMenu = useCallback(() => {
        if (!isImageSelected || isSourceMode) {
            return;
        }

        savedImage.current = getSelectedImageSnapshot(editor);
        if (!savedImage.current) {
            return;
        }

        setIsSizeMenuOpen((prev) => !prev);
    }, [editor, isImageSelected, isSourceMode]);

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-primary/20 bg-[#0a0118]">
            {/* View Modes */}
            <ToolbarButton
                onClick={() => onToggleSource && onToggleSource()}
                isActive={!!isSourceMode}
                icon={Code2}
                title="Toggle Markdown Source (<//>)"
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon={Bold}
                title="Bold (Ctrl+B)"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon={Italic}
                title="Italic (Ctrl+I)"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                icon={Strikethrough}
                title="Strikethrough"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                icon={Code}
                title="Inline Code"
                disabled={!!isSourceMode}
            />
            
            {/* Color Picker Native Input */}
            <div className={`p-1 flex items-center justify-center rounded transition-all duration-200 hover:bg-primary/20 ${isSourceMode ? 'opacity-30 pointer-events-none cursor-not-allowed' : 'cursor-pointer'}`} title="Metin Rengi">
                <input
                    type="color"
                    onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes('textStyle').color || '#8B5CF6'}
                    className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer rounded"
                    disabled={isSourceMode}
                />
            </div>

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                icon={Heading1}
                title="Heading 1"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                title="Heading 2"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                icon={Heading3}
                title="Heading 3"
                disabled={!!isSourceMode}
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Lists & Quotes */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon={List}
                title="Bullet List"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon={ListOrdered}
                title="Ordered List"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                icon={Quote}
                title="Blockquote"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                isActive={false}
                icon={Minus}
                title="Horizontal Rule"
                disabled={!!isSourceMode}
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Typography Alignments */}
            <ToolbarButton
                onClick={() => handleAlign(editor, 'left')}
                isActive={false}
                icon={AlignLeft}
                title="Align Left"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => handleAlign(editor, 'center')}
                isActive={false}
                icon={AlignCenter}
                title="Align Center"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => handleAlign(editor, 'right')}
                isActive={false}
                icon={AlignRight}
                title="Align Right"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={false}
                icon={AlignJustify}
                title="Justify"
                disabled={!!isSourceMode}
            />

            {/* Image Size Dropdown */}
            <div className="w-px h-5 bg-primary/20 mx-1" />
            <div className="relative" ref={sizeMenuRef}>
                <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={toggleSizeMenu}
                    disabled={!isImageSelected || !!isSourceMode}
                    title="Image size"
                    className={`
                        inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-mono font-semibold tracking-wide transition-all duration-200
                        ${isImageSelected
                            ? 'bg-primary/20 text-cyan-neon hover:bg-cyan-500/20'
                            : 'bg-transparent text-muted-foreground'}
                        ${!isImageSelected || isSourceMode ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}
                    `}
                >
                    <span>Size</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isSizeMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSizeMenuOpen && (
                    <div className="absolute left-0 top-[calc(100%+6px)] z-20 min-w-[88px] rounded-md border border-primary/20 bg-[#0f0518] p-1 shadow-[0_12px_24px_rgba(0,0,0,0.35)]">
                        {['25%', '33%', '50%', '75%', '100%', '150%', '200%'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => applyImageWidth(option)}
                                className="flex w-full items-center rounded px-2 py-1.5 text-left text-[11px] font-mono text-foreground/80 transition-colors hover:bg-primary/10 hover:text-foreground"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Table Operations */}
            <ToolbarButton
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                isActive={false}
                icon={Table}
                title="Insert Table (3x3)"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().deleteTable().run()}
                isActive={false}
                icon={Trash2}
                title="Delete Table"
                disabled={!!isSourceMode}
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Media & Hyperlinks */}
            <ToolbarButton
                onClick={setLink}
                isActive={editor.isActive('link')}
                icon={LinkIcon}
                title="Insert Link"
                disabled={!!isSourceMode}
            />
            <ToolbarButton
                onClick={addImage}
                isActive={false}
                icon={ImageIcon}
                title="Insert Image (URL)"
                disabled={!!isSourceMode}
            />
        </div>
    );
}
