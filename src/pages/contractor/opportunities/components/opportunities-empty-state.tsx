import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OpportunitiesEmptyStateProps {
    hasActiveFilters: boolean;
    onResetFilters: () => void;
}

export const OpportunitiesEmptyState = ({ hasActiveFilters, onResetFilters }: OpportunitiesEmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
                {hasActiveFilters ? 'No opportunities match your filters' : 'No opportunities available'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
                {hasActiveFilters
                    ? 'Try adjusting your filters to see more project opportunities that match your expertise.'
                    : 'There are currently no project opportunities available. Check back later for new projects.'}
            </p>
            {hasActiveFilters && (
                <Button type="button" onClick={onResetFilters}>
                    Clear All Filters
                </Button>
            )}
        </div>
    );
};
