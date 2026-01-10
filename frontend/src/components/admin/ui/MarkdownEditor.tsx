'use client';

import { TerminalInput } from './TerminalInput';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    rows?: number;
}
export function MarkdownEditor({
    value,
    onChange,
    label = 'CONTENT_MARKDOWN',
    rows = 12,
}: MarkdownEditorProps) {
    return (
        <TerminalInput
            type="textarea"
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="# Heading\n\nWrite your markdown content here..."
            rows={rows}
        />
    );
}
