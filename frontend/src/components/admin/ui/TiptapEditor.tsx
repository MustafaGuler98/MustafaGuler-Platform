"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import Link from '@tiptap/extension-link';
import { AlignableImage } from './extensions/AlignableImage';
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
import { useEffect, useRef, useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (json: string, html: string) => void;
  placeholder?: string;
}

const formatHTML = (html: string) => {
  return html
    // Add newlines after block-level closing tags and self-closing tags
    .replace(/(<\/(p|h[1-6]|ul|ol|li|blockquote|table|tr|div)>|<img[^>]+>|<hr[^>]*>)/ig, '$1\n\n')
    .replace(/(<\/pre>)/ig, '$1\n\n')
    // Remove excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceContent, setSourceContent] = useState('');
  const [words, setWords] = useState(0);
  const [chars, setChars] = useState(0);

  const previousContent = useRef(content);

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
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      AlignableImage.configure({
        inline: false,
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
        // Legacy fallback: Parse Markdown to HTML for backward compatibility
        return marked.parse(content) as string; 
      }
    })(),
    immediatelyRender: false, 
    onCreate: ({ editor }) => {
      setWords(editor.storage.characterCount.words());
      setChars(editor.storage.characterCount.characters());
      onChange(JSON.stringify(editor.getJSON()), editor.getHTML());
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
        class: 'prose-cyber min-h-[400px] w-full bg-transparent px-3 py-4 focus-visible:outline-none',
      },
    },
  });

  // Observe and hydrate async content fetches
  useEffect(() => {
    if (!editor) return;

    if (content !== previousContent.current) {
        let currentString = '';
        try {
            currentString = JSON.stringify(editor.getJSON());
        } catch {
            currentString = '';
        }

        // Only inject if incoming content strictly differs from current editor state 
        // to prevent race conditions and cursor jumping during rapid typing
        const isDifferent = content !== currentString && content !== editor.getHTML();

        if (isDifferent && content) {
            try {
                editor.commands.setContent(JSON.parse(content), { emitUpdate: false });
            } catch {
                // Parse markdown fallback during hydration
                const legacyHtml = marked.parse(content) as string;
                editor.commands.setContent(legacyHtml, { emitUpdate: false });
            }
            
            setWords(editor.storage.characterCount.words());
            setChars(editor.storage.characterCount.characters());
            
            // Push the potentially migrated content up to the form automatically
            onChange(JSON.stringify(editor.getJSON()), editor.getHTML());
            
            if (isSourceMode) {
                setSourceContent(content);
            }
        }
        previousContent.current = content;
    }
  }, [content, editor, isSourceMode]);

  // Handle switching
  const handleToggleSourceMode = () => {
    if (!editor) return;

    if (!isSourceMode) {
      // Enter HTML Source Mode with pretty formatting
      const rawHtml = editor.getHTML();
      setSourceContent(formatHTML(rawHtml));
      setIsSourceMode(true);
    } else {
      // Exit Source Mode
      editor.commands.setContent(sourceContent, { emitUpdate: false });
      setIsSourceMode(false);
    }
  };

  // Debounce sync for HTML source mode
  useEffect(() => {
    if (isSourceMode && editor) {
      const handler = setTimeout(() => {
        editor.commands.setContent(sourceContent, { emitUpdate: false });
        onChange(JSON.stringify(editor.getJSON()), editor.getHTML());
      }, 300);
      
      return () => clearTimeout(handler);
    }
  }, [sourceContent, isSourceMode, editor, onChange]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setSourceContent(newVal);

    setChars(newVal.length);
    // Rough estimate for words ignoring HTML tags
    const textStr = newVal.replace(/<[^>]*>?/gm, '').trim();
    setWords(textStr ? textStr.split(/\s+/).length : 0);
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
            placeholder={placeholder || 'Write raw HTML here...'}
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
         <span>Mode: {isSourceMode ? 'HTML Source' : 'Visual Editor'}</span>
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
