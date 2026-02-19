'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Options } from 'easymde';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import 'easymde/dist/easymde.min.css';
import './MarkdownEditor.css';

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#f43f5e', '#14b8a6', '#6366f1', '#a855f7',
    '#ffffff', '#94a3b8', '#64748b', '#1e293b',
];

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
    const editorRef = useRef<any>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Store selected text content and position
    const savedSelectionRef = useRef<{ text: string; from: any; to: any } | null>(null);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerColor, setPickerColor] = useState('#ef4444');
    const [hexInput, setHexInput] = useState('#ef4444');

    // Close picker when clicking outside
    useEffect(() => {
        if (!isPickerOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsPickerOpen(false);
                savedSelectionRef.current = null;
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPickerOpen]);

    const selectPresetColor = useCallback((color: string) => {
        setPickerColor(color);
        setHexInput(color);
    }, []);

    const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHexInput(val);
        // Update color if valid hex
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            setPickerColor(val);
        }
    }, []);

    const handleApply = useCallback(() => {
        const cm = editorRef.current?.codemirror;
        const saved = savedSelectionRef.current;
        if (cm && saved && /^#[0-9a-fA-F]{6}$/.test(pickerColor)) {
            cm.replaceRange(
                `<span style="color: ${pickerColor}">${saved.text}</span>`,
                saved.from,
                saved.to
            );
            cm.focus();
        }
        setIsPickerOpen(false);
        savedSelectionRef.current = null;
    }, [pickerColor]);

    const handleCancel = useCallback(() => {
        setIsPickerOpen(false);
        savedSelectionRef.current = null;
    }, []);

    const options: Options = useMemo(() => ({
        autofocus: false,
        spellChecker: false,
        placeholder: placeholder || 'Start writing in Markdown...',
        status: false,
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image',
            {
                name: 'color',
                action: (editor) => {
                    const cm = editor.codemirror;
                    const selectedText = cm.getSelection();

                    // Do not open picker if no text is selected
                    if (!selectedText) return;

                    editorRef.current = editor;
                    savedSelectionRef.current = {
                        text: selectedText,
                        from: cm.getCursor('from'),
                        to: cm.getCursor('to'),
                    };
                    setIsPickerOpen(true);
                },
                className: 'color-picker-btn',
                title: 'Text Color',
            },
            '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ],
        sideBySideFullscreen: false,
        minHeight: '400px',
    }), [placeholder]);

    return (
        <div className="markdown-editor-wrapper" style={{ position: 'relative' }}>
            {/* Custom Color Picker Dropdown */}
            {isPickerOpen && (
                <div ref={pickerRef} className="color-picker-dropdown">
                    {/* Preview */}
                    <div className="color-picker-preview" style={{ backgroundColor: pickerColor }} />

                    {/* Preset Colors */}
                    <div className="color-picker-grid">
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`color-picker-swatch ${pickerColor === color ? 'active' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => selectPresetColor(color)}
                                title={color}
                            />
                        ))}
                    </div>

                    {/* Hex Input */}
                    <div className="color-picker-hex-row">
                        <span className="color-picker-hex-label">HEX</span>
                        <input
                            type="text"
                            value={hexInput}
                            onChange={handleHexInputChange}
                            className="color-picker-hex-input"
                            placeholder="#000000"
                            maxLength={7}
                        />
                    </div>

                    {/* Actions */}
                    <div className="color-picker-actions">
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                        >
                            Cancel
                        </CyberButton>
                        <CyberButton
                            variant="primary"
                            size="sm"
                            onClick={handleApply}
                        >
                            Apply
                        </CyberButton>
                    </div>
                </div>
            )}

            <SimpleMDE
                value={value}
                onChange={onChange}
                options={options}
            />
        </div>
    );
}
