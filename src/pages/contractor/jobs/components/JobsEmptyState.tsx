import { BriefcaseBusiness, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobsEmptyStateProps {
    isFiltered: boolean;
    onResetFilter: () => void;
}

export const JobsEmptyState = ({ isFiltered, onResetFilter }: JobsEmptyStateProps) => {
    const Icon = isFiltered ? SearchX : BriefcaseBusiness;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
                {isFiltered ? 'No jobs match this filter' : 'No jobs yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
                {isFiltered
                    ? 'There are no jobs with this status. Try switching to a different tab or view all jobs.'
                    : 'You have no jobs yet. Once a homeowner accepts your proposal, it will appear here.'}
            </p>
            {isFiltered && (
                <Button type="button" onClick={onResetFilter}>
                    View All Jobs
                </Button>
            )}
        </div>
    );
};
