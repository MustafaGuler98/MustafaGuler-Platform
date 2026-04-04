import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';

interface LinkDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (url: string, text?: string) => void;
    initialUrl?: string;
    requireText?: boolean;
}

export function LinkDialog({ isOpen, onOpenChange, onSubmit, initialUrl = '', requireText = false }: LinkDialogProps) {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setUrl(initialUrl || 'https://');
            setText('');
        }
    }, [isOpen, initialUrl]);

    const handleSubmit = () => {
        onSubmit(url.trim(), requireText ? text.trim() : undefined);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0118] border-primary/20 text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-cyan-neon font-mono">Insert Link</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <CyberInput 
                        label="LINK URL"
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        placeholder="https://..." 
                        autoFocus={!requireText}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (!requireText || text.trim())) handleSubmit();
                        }}
                    />
                    {requireText && (
                        <CyberInput 
                            label="DISPLAY TEXT"
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            placeholder="Link display text" 
                            autoFocus={requireText}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit();
                            }}
                        />
                    )}
                </div>
                <DialogFooter className="gap-2 mt-2">
                    <CyberButton type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</CyberButton>
                    <CyberButton type="button" variant="primary" onClick={handleSubmit}>Save</CyberButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
