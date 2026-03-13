import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetOpportunities } from '@/hooks/use-project'
import { AppPagination } from '@/components/app-pagination';
import type { GetOpportunitiesDto } from '@/interfaces/project/dto/get-opportunities.dto';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectItem } from '@/components/project-item';
import type { IProject } from '@/interfaces/project/project.interface';

const Opportunities: React.FC = () => {
    const [filters, setFilters] = React.useState<GetOpportunitiesDto>({
        page: 1,
        limit: 12,
        maxMatchPercentage: 100,
        minMatchPercentage: 0,
        propertyState: undefined,
        projectType: undefined,
        propertyType: undefined,
    });
    const projects = useGetOpportunities(filters);

    return (
        <>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h1 className='font-semibold text-[36px] text-foreground mb-0'>Project Opportunities</h1>
                    <p className='font-normal text-[16px] text-muted-foreground'>Find pre-qualified homeowners looking for your services</p>
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

            {projects.isLoading ? (
                <div className='space-y-4'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className='bg-card border border-border rounded-lg p-6'>
                            <div className='flex items-start gap-6'>
                                <Skeleton className='w-[80px] h-[80px] rounded-lg' />
                                <div className='flex-1 space-y-4'>
                                    <div>
                                        <Skeleton className='h-6 w-1/3 mb-2' />
                                        <Skeleton className='h-4 w-2/3' />
                                    </div>
                                    <div className='flex gap-4'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-4 w-32' />
                                    </div>
                                    <div className='grid grid-cols-4 gap-4'>
                                        <Skeleton className='h-12 w-full' />
                                        <Skeleton className='h-12 w-full' />
                                        <Skeleton className='h-12 w-full' />
                                        <Skeleton className='h-12 w-full' />
                                    </div>
                                    <div className='flex gap-3'>
                                        <Skeleton className='h-10 w-40' />
                                        <Skeleton className='h-10 w-40' />
                                        <Skeleton className='h-10 w-32' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ):(
                <div className='space-y-4'>
                    {projects.data?.data?.items?.map((project: IProject) => (
                        <ProjectItem key={project._id} project={project} />
                    ))}
                </div>
            )}

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