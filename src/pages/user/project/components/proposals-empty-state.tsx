import React from 'react';
import { FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProposalsEmptyStateProps {
    onInviteContractor?: () => void;
}

export const ProposalsEmptyState: React.FC<ProposalsEmptyStateProps> = ({ onInviteContractor }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="size-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">No proposals yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
                You haven't received any proposals for this project. Invite contractors to get competitive bids as quickly as possible.
            </p>
            <Button onClick={onInviteContractor} className="gap-2">
                <Send className="size-4" />
                Invite Contractors
            </Button>
        </div>
    );
};
