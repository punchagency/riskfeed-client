import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header'
import { Input } from '@/components/ui/input'
import { AppPagination } from '@/components/app-pagination'
import { Clock, DollarSign, Search, Shield, TrendingUp } from 'lucide-react'
import { useEscrowPayments } from '@/hooks/use-transaction'
import type { GetEscrowPaymentQueryDto } from '@/interfaces/transaction/dto/transaction.dto'
import type { IEscrowPayment } from '@/interfaces/transaction/transaction.interface'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { useDebounce } from '@/hooks/use-debounce'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
// Reusing identical components from the user directory
import { EscrowPaymentCard } from '@/pages/user/escrow-payment/components/escrow-payment-card'
import { EscrowPaymentLoading } from '@/pages/user/escrow-payment/components/escrow-payment-loading'
import { EscrowPaymentEmpty } from '@/pages/user/escrow-payment/components/escrow-payment-empty'
import { EscrowStatsLoading } from '@/pages/user/escrow-payment/components/escrow-stats-loading'
import { Button } from '@/components/ui/button';
import { useEscrowPaymentStats } from '@/hooks/use-transaction';
import { formatCurrency } from '@/utils/format-currency-price';
import { Card } from '@/components/ui/card';

const EscrowPayment: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const escrowPaymentStats = useEscrowPaymentStats();

    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    const [filters, setFilters] = useState<GetEscrowPaymentQueryDto>({
        page: 1,
        limit: 12,
        search: '',
        startDate: '',
        endDate: '',
    })

    // Sync debounced search term and date range to query filters
    useEffect(() => {
        // eslint-disable-next-line
        setFilters(prev => ({
            ...prev,
            search: debouncedSearchTerm,
            startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
            endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
            page: 1
        }))
    }, [debouncedSearchTerm, dateRange])

    const escrowPayments = useEscrowPayments(filters)
    const items = escrowPayments?.data?.data?.items || []

    return (
        <div className="space-y-6">
            <PageHeader title='Escrow & Payments'
                description='Track milestone payments and manage project earnings'
            />
            {/* Escrow Payment Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {escrowPaymentStats.isLoading ? (
                    <EscrowStatsLoading />
                ) : (
                    <>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><DollarSign className='mr-2 size-4' />Total Earned</p>
                                <p className="font-semibold text-[28px] text-green-600 dark:text-green-400">{formatCurrency(escrowPaymentStats.data?.data?.totalEarned, 'USD')}</p>
                            </div>
                        </Card>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><Clock className='mr-2 size-4' />Pending Release</p>
                                <p className="font-semibold text-[28px] text-red-600 dark:text-red-400">{formatCurrency(escrowPaymentStats.data?.data?.pendingRelease, 'USD')}</p>
                            </div>
                        </Card>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><Shield className='mr-2 size-4' />In Escrow</p>
                                <p className="font-semibold text-[28px] text-blue-600 dark:text-blue-400">{formatCurrency(escrowPaymentStats.data?.data?.inEscrow, 'USD')}</p>
                            </div>
                        </Card>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><TrendingUp className='mr-2 size-4' />Platform Fees</p>
                                <p className="font-semibold text-[28px]">{formatCurrency(escrowPaymentStats.data?.data?.platformFeesPaid, 'USD')}</p>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground w-5 h-5' />
                    <Input className='pl-10 h-10' placeholder="Search by project name, milestone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='sm:w-[300px] shrink-0'>
                    <DatePickerWithRange
                        className='h-10 [&>button]:h-10 [&>button]:w-full'
                        date={dateRange}
                        onDateChange={setDateRange}
                    />
                </div>
                {dateRange && (
                    <Button size="sm" className='h-10' variant="outline" onClick={() => setDateRange(undefined)}>
                        Clear Date
                    </Button>
                )}
            </div>

            <div className="space-y-8">
                {escrowPayments.isLoading ? (
                    <>
                        <EscrowPaymentLoading />
                        <EscrowPaymentLoading />
                    </>
                ) : items.length === 0 ? (
                    <EscrowPaymentEmpty
                        title={filters.search ? 'No Match Found' : undefined}
                        description={filters.search ? "We couldn't find any escrow payments matching your search criteria." : undefined}
                    />
                ) : (
                    items.map((item: IEscrowPayment, index: number) => (
                        <EscrowPaymentCard key={item.project?._id || index} data={item} role="contractor" />
                    ))
                )}
            </div>

            {!escrowPayments.isLoading && escrowPayments?.data?.data?.pagination?.pages > 1 && (
                <AppPagination
                    page={escrowPayments.data.data.pagination.page}
                    pages={escrowPayments.data.data.pagination.pages}
                    limit={escrowPayments.data.data.pagination.limit}
                    total={escrowPayments.data.data.pagination.total}
                    onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                />
            )}
        </div>
    )
}

export default EscrowPayment;