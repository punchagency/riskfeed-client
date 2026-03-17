import React from 'react';

import { AppPagination } from '@/components/app-pagination';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetJobs, useGetJobStats } from '@/hooks/use-proposal';
import type { GetJobsQueryDto } from '@/interfaces/proposal/dto/proposal-query.dto';
import type { IJob } from '@/interfaces/proposal/proposal.interface';
import { Search } from 'lucide-react';

import { JobCard, JobCardSkeleton } from './components/JobCard';
import { JobsEmptyState } from './components/JobsEmptyState';
import { JobStats } from './components/JobStats';

type TabValue = 'all' | 'active' | 'completed' | 'cancelled' | 'pending';

const Jobs: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState<TabValue>('all');
    const [searchInput, setSearchInput] = React.useState('');
    const jobStats = useGetJobStats();
    const [filter, setFilter] = React.useState<GetJobsQueryDto>({
        page: 1,
        limit: 12,
        jobStatus: undefined,
        search: undefined,
    });
    console.log('Job Stats:', jobStats.data);
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setFilter(prev => ({
                ...prev,
                page: 1,
                search: searchInput.trim() || undefined,
            }));
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const jobs = useGetJobs(filter);

    const handleTabChange = (value: string) => {
        const tab = value as TabValue;
        setActiveTab(tab);
        setFilter(prev => ({
            ...prev,
            page: 1,
            jobStatus: tab === 'all' ? undefined : tab,
        }));
    };

    const resetFilter = () => {
        setActiveTab('all');
        setFilter(prev => ({ ...prev, page: 1, jobStatus: undefined }));
    };

    return (
        <>
            <PageHeader
                title='My Jobs'
                description='Manage your active and completed projects'
            />

            <JobStats data={jobStats.data?.data} isLoading={jobStats.isLoading} />

            <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
                <Input
                    className='pl-10'
                    placeholder='Search jobs...'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            <Tabs
                value={activeTab}
                className='w-full mt-4'
                onValueChange={handleTabChange}
            >
                <TabsList className='h-11'>
                    <TabsTrigger className='min-w-20' value='all'>All</TabsTrigger>
                    <TabsTrigger className='min-w-20' value='active'>Active</TabsTrigger>
                    <TabsTrigger className='min-w-20' value='completed'>Completed</TabsTrigger>
                    <TabsTrigger className='min-w-20' value='cancelled'>Cancelled</TabsTrigger>
                    <TabsTrigger className='min-w-20' value='pending'>Pending</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className=''>
                {jobs.isLoading
                    ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
                    : jobs.data?.data?.items?.length
                        ? jobs.data.data.items.map((job: IJob) => (
                            <JobCard key={job._id} job={job} />
                        ))
                        : <JobsEmptyState
                            isFiltered={!!filter.jobStatus}
                            onResetFilter={resetFilter}
                        />
                }
            </div>

            {(jobs.data?.data?.pagination?.pages ?? 0) > 1 && (
                <AppPagination
                    page={jobs.data!.data.pagination.page}
                    pages={jobs.data!.data.pagination.pages}
                    limit={jobs.data!.data.pagination.limit}
                    total={jobs.data!.data.pagination.total}
                    onPageChange={(page) => setFilter(prev => ({ ...prev, page }))}
                />
            )}
        </>
    );
};

export default Jobs;
