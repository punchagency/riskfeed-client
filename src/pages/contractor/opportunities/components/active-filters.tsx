import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { GetOpportunitiesDto } from '@/interfaces/project/dto/get-opportunities.dto';

interface ActiveFiltersProps {
    filters: GetOpportunitiesDto;
    onRemoveFilter: (filterKey: keyof GetOpportunitiesDto) => void;
}

const formatProjectType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatPropertyType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const ActiveFilters = ({ filters, onRemoveFilter }: ActiveFiltersProps) => {
    const activeFilters: Array<{ key: keyof GetOpportunitiesDto; label: string; value: string }> = [];

    // Match Percentage
    if (filters.minMatchPercentage !== 0 || filters.maxMatchPercentage !== 100) {
        activeFilters.push({
            key: 'minMatchPercentage',
            label: 'Match',
            value: `${filters.minMatchPercentage}% - ${filters.maxMatchPercentage}%`,
        });
    }

    // Project Type
    if (filters.projectType) {
        activeFilters.push({
            key: 'projectType',
            label: 'Project',
            value: formatProjectType(filters.projectType),
        });
    }

    // Property Type
    if (filters.propertyType) {
        activeFilters.push({
            key: 'propertyType',
            label: 'Property',
            value: formatPropertyType(filters.propertyType),
        });
    }

    // Property State
    if (filters.propertyState) {
        activeFilters.push({
            key: 'propertyState',
            label: 'Location',
            value: filters.propertyState,
        });
    }

    if (activeFilters.length === 0) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter) => (
                <Badge
                    key={filter.key}
                    variant="secondary"
                    className="gap-1.5 pr-1 cursor-pointer hover:bg-secondary/80"
                >
                    <span className="text-xs">
                        {filter.label}: {filter.value}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemoveFilter(filter.key)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            ))}
        </div>
    );
};
