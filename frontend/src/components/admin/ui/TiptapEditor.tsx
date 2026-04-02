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
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { createLowlight, common } from 'lowlight';
import './tiptap.css';

const lowlight = createLowlight(common);

import { EditorToolbar } from './EditorToolbar';
import { useState } from 'react';

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
      CharacterCount.configure({
        limit: 50000, 
      }),
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        inline: true, // It inherits paragraph-level text-align
        allowBase64: true,
      }),
      TextStyle,
      Color,
    ],
    content: (() => {
      if (!content) return '';
      try {
        return JSON.parse(content); // New structure: JSON string from editor.getJSON()
      } catch {
        return content; // Legacy fallback: raw HTML string
      }
    })(),
    immediatelyRender: false, 
    onCreate: ({ editor }) => {
      setWords(editor.storage.characterCount.words());
      setChars(editor.storage.characterCount.characters());
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      const html = editor.getHTML();
      onChange(json, html);
      
      setWords(editor.storage.characterCount.words());
      setChars(editor.storage.characterCount.characters());
    },

    editorProps: {
      attributes: {
        class: 'prose-container min-h-[400px] w-full bg-transparent px-3 py-4 focus-visible:outline-none',
      },
    },
  });

  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceContent, setSourceContent] = useState('');
  const [words, setWords] = useState(0);
  const [chars, setChars] = useState(0);

  // Handle switching
  const handleToggleSourceMode = () => {
    if (!editor) return;

    if (!isSourceMode) {
      // Enter Source Mode
      setSourceContent((editor.storage as any).markdown.getMarkdown());
      setIsSourceMode(true);
    } else {
      // Exit Source Mode
      editor.commands.setContent(sourceContent);
      setIsSourceMode(false);
    }
  };

  // Sync manual textarea changes to the parent component forms continuously
  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setSourceContent(newVal);

    // Fallback
    setChars(newVal.length);
    const textStr = newVal.trim();
    setWords(textStr ? textStr.split(/\s+/).length : 0);

    // Transmit pseudo-JSON and raw text so form states are aware text exists
    onChange(JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '[Source Mode Active]' }] }] }), newVal);
  };

  if (!editor) {
    return <div className="animate-pulse bg-white/5 h-[400px] w-full rounded-md" />;
  }

  return (
    <div className="w-full flex flex-col rounded-xl border border-primary/20 bg-black/20 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.05)] focus-within:shadow-[0_0_25px_rgba(139,92,246,0.15)] focus-within:border-primary/50 transition-all duration-500 overflow-hidden">
      <EditorToolbar 
        editor={editor} 
        isSourceMode={isSourceMode}
        onToggleSource={handleToggleSourceMode}
      />
      
      
      {/* Content area: fixed height container with internal scroll */}
      {isSourceMode ? (
        <div className="h-[60vh] overflow-y-auto">
          <textarea
            className="w-full h-full bg-transparent text-white/90 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-0 whitespace-pre-wrap leading-relaxed"
            value={sourceContent}
            onChange={handleSourceChange}
            spellCheck={false}
            placeholder="Write raw markdown here..."
          />
        </div>
      ) : (
        <div 
          className="h-[60vh] overflow-y-auto cursor-text px-1" 
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Footer: Live Character Count Dashboard */}
      <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-t border-primary/10 text-[10px] font-mono text-primary/60 tracking-widest uppercase shadow-[inset_0_10px_10px_-10px_rgba(0,0,0,0.5)]">
         <span>Mode: {isSourceMode ? 'Markdown Source' : 'Visual Editor'}</span>
         <div className="flex gap-4">
            <span className="flex items-center gap-1">
               <span className="text-cyan-neon/70">{words}</span> Words
            </span>
            <span className="flex items-center gap-1">
               <span className="text-purple-400/70">{chars}</span> Chars
            </span>
         </div>
      </div>
    </div>
  );
}
