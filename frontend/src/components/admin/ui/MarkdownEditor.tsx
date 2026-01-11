'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import type { Options } from 'easymde';
import 'easymde/dist/easymde.min.css';
import './MarkdownEditor.css';


const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 bg-card/50 rounded border border-border animate-pulse flex items-center justify-center">
            <span className="font-mono text-xs text-muted-foreground">LOADING_EDITOR...</span>
        </div>
    ),
});

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const options: Options = useMemo(() => ({
        autofocus: false,
        spellChecker: false,
        placeholder: placeholder || 'Start writing in Markdown...',
        status: false,
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ],
        sideBySideFullscreen: false,
        minHeight: '400px',
    }), [placeholder]);

    return (
        <div className="markdown-editor-wrapper">
            <SimpleMDE
                value={value}
                onChange={onChange}
                options={options}
            />
        </div>
    );
}
