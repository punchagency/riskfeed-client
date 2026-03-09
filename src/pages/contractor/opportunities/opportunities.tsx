import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProjects } from '@/hooks/use-project'
import type { PROJECT_STATUSES } from '@/interfaces/project/project.interface';
import { AppPagination } from '@/components/app-pagination';

const Opportunities: React.FC = () => {
    const [filters, setFilters] = React.useState({
        page: 1,
        limit: 12,
        status: "published" as typeof PROJECT_STATUSES[number],
        minBudget: undefined as number | undefined,
        maxBudget: undefined as number | undefined,
    });
    const projects = useProjects(filters);

    console.log(projects.data)
    return (
        <>
            <div className='flex items-center justify-between mb-8'>
                <div className=''>
                    <h1 className='font-semibold text-[36px] text-gray-900 dark:text-white mb-0'>Project Opportunities</h1>
                    <p className='font-normal text-[16px] text-gray-500 dark:text-gray-400'>Find pre-qualified homeowners looking for your services</p>
                </div>

                <div>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="category1">All Opportunities</SelectItem>
                            <SelectItem value="category2">Recently Posted</SelectItem>
                            <SelectItem value="category3">High (Match 90%+)</SelectItem>
                            <SelectItem value="category4">Medium (Match 70%-89%)</SelectItem>
                            <SelectItem value="category5">Low (Match 50%-69%)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {projects?.data?.data?.pagination?.pages > 1 && (
                <AppPagination
                    page={projects.data.data.pagination.page}
                    pages={projects.data.data.pagination.pages}
                    limit={projects.data.data.pagination.limit}
                    total={projects.data.data.pagination.total}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                />
            )}
        </>
    )
}

export default Opportunities