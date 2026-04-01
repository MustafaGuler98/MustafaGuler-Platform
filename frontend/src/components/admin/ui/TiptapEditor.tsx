"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import './tiptap.css';

const lowlight = createLowlight(common);

import { EditorToolbar } from './EditorToolbar';

interface TiptapEditorProps {
  content: string;
  onChange: (json: string, html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable native codeBlock to prevent syntax highlighting conflict with lowlight extension
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content: content,
    immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      const html = editor.getHTML();
      onChange(json, html);
    },
    // 
    editorProps: {
      attributes: {
        class: 'prose-container min-h-[400px] w-full bg-transparent px-3 py-4 focus-visible:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex flex-col rounded-xl border border-primary/20 bg-black/20 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.05)] focus-within:shadow-[0_0_25px_rgba(139,92,246,0.15)] focus-within:border-primary/50 transition-all duration-500 overflow-hidden">
      <EditorToolbar editor={editor} />
      
      {/* Restrict height and enable internal scrolling to keep toolbar sticky within the container */}
      <div 
        className="flex-1 min-h-[500px] max-h-[calc(100vh-250px)] overflow-y-auto cursor-text px-1" 
        onClick={() => editor.chain().focus().run()}
      >
         <EditorContent editor={editor} />
      </div>
    </div>
  );
}
