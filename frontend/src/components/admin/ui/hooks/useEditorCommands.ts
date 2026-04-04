import { type Editor } from '@tiptap/react';

export type ImageNodeLike = {
    attrs: Record<string, unknown>;
    type: { name: string };
};

export type SelectionWithNode = {
    empty?: boolean;
    from: number;
    node?: ImageNodeLike | null;
};

export type ImageSnapshot = {
    attrs: Record<string, unknown>;
    pos: number;
};

export function useEditorCommands(editor: Editor) {
    const updateImageAttributes = (attrs: Record<string, unknown>) => {
        const selection = editor.state.selection as SelectionWithNode;
        if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', attrs).run();
        } else {
            const node = selection.node;
            if (node?.type.name === 'image') {
                editor.chain().focus().command(({ tr }) => {
                    tr.setNodeMarkup(selection.from, undefined, {
                        ...node.attrs,
                        ...attrs
                    });
                    return true;
                }).run();
            }
        }
    };

    const getSelectedImageSnapshot = (): ImageSnapshot | null => {
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

    const handleAlign = (alignment: string) => {
        const selection = editor.state.selection as SelectionWithNode;
        const isImage = editor.isActive('image') || selection.node?.type.name === 'image';

        if (isImage) {
            updateImageAttributes({ alignment });
        } else {
            editor.chain().focus().setTextAlign(alignment).run();
        }
    };

    return {
        updateImageAttributes,
        getSelectedImageSnapshot,
        handleAlign
    };
}
