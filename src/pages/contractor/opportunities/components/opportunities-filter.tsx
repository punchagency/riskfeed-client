import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { GetOpportunitiesDto } from '@/interfaces/project/dto/get-opportunities.dto';
import { PROJECT_TYPES } from '@/interfaces/project/project.interface';
import { PROPERTIES_TYPES } from '@/interfaces/properties/properties.interface';
import { US_STATE_CODES } from '@/constants/us-states';

interface OpportunitiesFilterProps {
    filters: GetOpportunitiesDto;
    onFilterChange: (filters: GetOpportunitiesDto) => void;
}

const formatProjectType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatPropertyType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const OpportunitiesFilter = ({ filters, onFilterChange }: OpportunitiesFilterProps) => {
    const [open, setOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<GetOpportunitiesDto>(filters);

    const stateOptions = Object.entries(US_STATE_CODES).map(([name, code]) => ({
        label: `${name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} (${code})`,
        value: code,
    }));

    const handleApplyFilters = () => {
        onFilterChange({ ...localFilters, page: 1 });
        setOpen(false);
    };

    const handleResetFilters = () => {
        const resetFilters: GetOpportunitiesDto = {
            page: 1,
            limit: filters.limit,
            maxMatchPercentage: 100,
            minMatchPercentage: 0,
            propertyState: undefined,
            projectType: undefined,
            propertyType: undefined,
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const activeFilterCount = [
        localFilters.propertyState,
        localFilters.projectType,
        localFilters.propertyType,
        (localFilters.minMatchPercentage !== 0 || localFilters.maxMatchPercentage !== 100),
    ].filter(Boolean).length;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="default" className="ml-2 px-1.5 py-0 h-5 min-w-5 rounded-full">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full rounded-l-xl bg-card sm:max-w-md overflow-y-auto px-6">
                <SheetHeader className='px-0'>
                    <SheetTitle>Filter Opportunities</SheetTitle>
                    <SheetDescription>
                        Refine your search to find the perfect projects
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Match Percentage */}
                    <div className="space-y-3">
                        <Label>Match Percentage</Label>
                        <Select
                            value={`${localFilters.minMatchPercentage}-${localFilters.maxMatchPercentage}`}
                            onValueChange={(value) => {
                                const [min, max] = value.split('-').map(Number);
                                setLocalFilters(prev => ({
                                    ...prev,
                                    minMatchPercentage: min,
                                    maxMatchPercentage: max,
                                }));
                            }}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select match range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0-100">All Matches (0% - 100%)</SelectItem>
                                <SelectItem value="90-100">High Match (90% - 100%)</SelectItem>
                                <SelectItem value="70-89">Medium Match (70% - 89%)</SelectItem>
                                <SelectItem value="50-69">Low Match (50% - 69%)</SelectItem>
                                <SelectItem value="0-49">Below 50%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Project Type */}
                    <div className="space-y-3">
                        <Label>Project Type</Label>
                        <Select
                            value={localFilters.projectType || 'all'}
                            onValueChange={(value) => {
                                setLocalFilters(prev => ({
                                    ...prev,
                                    projectType: value === 'all' ? undefined : value as typeof PROJECT_TYPES[number],
                                }));
                            }}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Project Types</SelectItem>
                                {PROJECT_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {formatProjectType(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Property Type */}
                    <div className="space-y-3">
                        <Label>Property Type</Label>
                        <Select
                            value={localFilters.propertyType || 'all'}
                            onValueChange={(value) => {
                                setLocalFilters(prev => ({
                                    ...prev,
                                    propertyType: value === 'all' ? undefined : value as typeof PROPERTIES_TYPES[number],
                                }));
                            }}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Property Types</SelectItem>
                                {PROPERTIES_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {formatPropertyType(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Property State */}
                    <div className="space-y-3">
                        <Label>Property Location (State)</Label>
                        <Select
                            value={localFilters.propertyState || 'all'}
                            onValueChange={(value) => {
                                setLocalFilters(prev => ({
                                    ...prev,
                                    propertyState: value === 'all' ? undefined : value,
                                }));
                            }}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                {stateOptions.map((state) => (
                                    <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleResetFilters}
                        className="flex-1"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={handleApplyFilters}
                        className="flex-1"
                    >
                        Apply Filters
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
