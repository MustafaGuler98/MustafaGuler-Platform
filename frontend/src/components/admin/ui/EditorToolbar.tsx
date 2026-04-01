import { type Editor } from '@tiptap/react';
import { 
    Bold, Italic, Strikethrough, Code, 
    Heading1, Heading2, Heading3, 
    List, ListOrdered, Quote, Minus,
    Link as LinkIcon, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Table, Trash2, Code2
} from 'lucide-react';
import { useCallback } from 'react';

interface EditorToolbarProps {
    editor: Editor;
    isSourceMode?: boolean;
    onToggleSource?: () => void;
}

export function EditorToolbar({ editor, isSourceMode, onToggleSource }: EditorToolbarProps) {
    if (!editor) return null;

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
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const ToolbarButton = ({ 
        onClick, isActive, icon: Icon, title, forceEnable 
    }: { 
        onClick: () => void, isActive: boolean, icon: any, title: string, forceEnable?: boolean
    }) => {
        const disabled = !forceEnable && isSourceMode;
        
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
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-primary/20 bg-[#0a0118]">
            {/* View Modes */}
            <ToolbarButton
                onClick={() => onToggleSource && onToggleSource()}
                isActive={!!isSourceMode}
                icon={Code2}
                title="Toggle Markdown Source (</>)"
                forceEnable={true}
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon={Bold}
                title="Bold (Ctrl+B)"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon={Italic}
                title="Italic (Ctrl+I)"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                icon={Strikethrough}
                title="Strikethrough"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                icon={Code}
                title="Inline Code"
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
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                title="Heading 2"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                icon={Heading3}
                title="Heading 3"
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Lists & Quotes */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon={List}
                title="Bullet List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon={ListOrdered}
                title="Ordered List"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                icon={Quote}
                title="Blockquote"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                isActive={false}
                icon={Minus}
                title="Horizontal Rule"
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Typography Alignments */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                icon={AlignLeft}
                title="Align Left"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                icon={AlignCenter}
                title="Align Center"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                icon={AlignRight}
                title="Align Right"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                icon={AlignJustify}
                title="Justify"
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Table Operations */}
            <ToolbarButton
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                isActive={false}
                icon={Table}
                title="Insert Table (3x3)"
            />
            <ToolbarButton
                onClick={() => editor.chain().focus().deleteTable().run()}
                isActive={false}
                icon={Trash2}
                title="Delete Table"
            />

            <div className="w-px h-5 bg-primary/20 mx-1" />

            {/* Media & Hyperlinks */}
            <ToolbarButton
                onClick={setLink}
                isActive={editor.isActive('link')}
                icon={LinkIcon}
                title="Insert Link"
            />
            <ToolbarButton
                onClick={addImage}
                isActive={editor.isActive('image')}
                icon={ImageIcon}
                title="Insert Image (URL)"
            />
        </div>
    );
}
