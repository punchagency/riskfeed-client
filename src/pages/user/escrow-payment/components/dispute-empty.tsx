import React from 'react'
import { ShieldCheck } from 'lucide-react'

interface DisputeEmptyProps {
    title?: string
    description?: string
}

export const DisputeEmpty: React.FC<DisputeEmptyProps> = ({
    title = 'No Disputes Found',
    description = 'There are no disputes for this project. Disputes will appear here when raised by either party.',
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 py-20 text-center border border-dashed rounded-xl bg-card border-border/60">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary text-secondary-foreground dark:bg-secondary/40">
                <ShieldCheck className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-[400px]">
                {description}
            </p>
        </div>
    )
}
