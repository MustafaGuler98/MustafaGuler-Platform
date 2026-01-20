import { Save } from 'lucide-react';
import { CyberButton } from './CyberButton';
import { cn } from '@/lib/utils';
import { CyberButtonProps } from './CyberButton';

interface CyberSaveButtonProps extends Omit<CyberButtonProps, 'children'> {
    isDirty: boolean;
    isSaving: boolean;
    label?: string;
    savedLabel?: string;
    savingLabel?: string;
}

export function CyberSaveButton({
    isDirty,
    isSaving,
    label = 'SAVE CHANGES',
    savedLabel = 'SAVE CHANGES',
    savingLabel = 'SAVING...',
    className,
    onClick,
    ...props
}: CyberSaveButtonProps) {
    return (
        <CyberButton
            onClick={onClick}
            disabled={isSaving}
            className={cn(
                "transition-all duration-300",
                // Dirty State: Add Pulse
                isDirty && !isSaving && "animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.3)]",
                className
            )}
            variant="primary"
            {...props}
        >
            <Save size={18} />
            <span className="ml-2 font-bold tracking-wide">
                {isSaving ? savingLabel : (isDirty ? label : savedLabel)}
            </span>
        </CyberButton>
    );
}
