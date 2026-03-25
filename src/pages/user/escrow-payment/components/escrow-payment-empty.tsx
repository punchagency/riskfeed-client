import React from 'react';
import { FileText } from 'lucide-react';

interface EscrowPaymentEmptyProps {
    title?: string;
    description?: string;
}

export const EscrowPaymentEmpty: React.FC<EscrowPaymentEmptyProps> = ({
    title = 'No Escrow Payments Found',
    description = "You don't have any active milestone payments right now. Once a project begins and funds are placed in escrow, they will appear here."
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 py-20 text-center border border-dashed rounded-xl bg-card border-border/60">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary text-secondary-foreground dark:bg-secondary/40">
                <FileText className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-[400px]">
                {description}
            </p>
        </div>
    );
};
