import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber/CyberButton';
import { CyberInput } from '@/components/ui/cyber/CyberInput';

interface ImageDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (url: string) => void;
}

export function ImageDialog({ isOpen, onOpenChange, onSubmit }: ImageDialogProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = () => {
        if (url.trim()) {
            onSubmit(url.trim());
            setUrl('');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0118] border-primary/20 text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-cyan-neon font-mono">Insert Image</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <CyberInput 
                        label="IMAGE URL"
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)} 
                        placeholder="https://..." 
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                        }}
                    />
                </div>
                <DialogFooter className="gap-2 mt-2">
                    <CyberButton type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</CyberButton>
                    <CyberButton type="button" variant="primary" onClick={handleSubmit}>Insert</CyberButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
