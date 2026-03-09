import React from 'react';

import { AppPagination } from '@/components/app-pagination';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useGetContractors } from '@/hooks/use-contractor';
import type { GetContractorsFilterDto } from '@/interfaces/contractor/dto/get-contractors-filter.dto';
import type { IContractor } from '@/interfaces/user/user.interface';
import { Search, TrendingUp, X } from 'lucide-react';

import { ContractorItem } from './components/contractor-item';
import { ContractorSkeleton } from './components/contractor-skeleton';
import { ContractorEmptyState } from './components/contractor-empty-state';
import { useNavigate } from 'react-router-dom';

const Contractor: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = React.useState<GetContractorsFilterDto>({
        page: 1,
        limit: 12,
        search: undefined as string | undefined,
    });
    const [searchInput, setSearchInput] = React.useState("");

    const contractorsQuery = useGetContractors(filters);

    const handleSearch = React.useCallback((value: string) => {
        setSearchInput(value);
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: value || undefined, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <PageHeader
                title='Find Contractors'
                description='AI-powered contractor matching based on your project needs'
            />

            <div className="flex-1 relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500" />
                    <Input
                        value={searchInput}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-normal text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600"
                        placeholder="Search contractors..."
                    />
                    {searchInput && (
                        <button
                            onClick={() => handleSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            </div>

            <Card className='p-0 bg-[#49388e] mt-4'>
                <CardContent className='p-5 flex items-start gap-3'>
                    <div className='flex items-center gap-2'>
                        <TrendingUp className='text-white' />
                    </div>
                    <div>
                        <CardTitle className='text-white font-semibold text-[16px] mb-2'>AI Recommended Match</CardTitle>
                        <CardDescription className='text-white font-normal text-[13px] opacity-90'>Based on your project requirements and location, we recommend BuildRight Construction for your kitchen renovation. They have a 98% on-time completion rate and excellent reviews.</CardDescription>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 space-y-4">
                {contractorsQuery.isLoading ? (
                    <>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ContractorSkeleton key={i} />
                        ))}
                    </>
                ) : contractorsQuery.data?.items.length > 0 ? (
                    <>
                        {contractorsQuery.data?.items.map((contractor: IContractor) => (
                            <ContractorItem key={contractor._id} contractor={contractor}
                                onInvite={() => navigate(`/contractors/invite/${contractor._id}`)}
                            />
                        ))}
                    </>
                ) : (
                    <ContractorEmptyState />
                )}
            </div>

            {contractorsQuery?.data?.data?.pagination?.pages > 1 && (
                <AppPagination
                    page={contractorsQuery.data.data.pagination.page}
                    pages={contractorsQuery.data.data.pagination.pages}
                    limit={contractorsQuery.data.data.pagination.limit}
                    total={contractorsQuery.data.data.pagination.total}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                />
            )}
        </>
    )
}

export default Contractor