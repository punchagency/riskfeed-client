import { AppPagination } from '@/components/app-pagination'
import { PageHeader } from '@/components/page-header'
import { Input } from '@/components/ui/input'
import { useEscrowPayments, useEscrowPaymentStats } from '@/hooks/use-transaction'
import type { GetEscrowPaymentQueryDto } from '@/interfaces/transaction/dto/transaction.dto'
import type { IEscrowPayment } from '@/interfaces/transaction/transaction.interface'
import { CircleCheckBigIcon, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { EscrowPaymentCard } from './components/escrow-payment-card'
import { EscrowPaymentLoading } from './components/escrow-payment-loading'
import { EscrowPaymentEmpty } from './components/escrow-payment-empty'
import { useDebounce } from '@/hooks/use-debounce'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { EscrowStatsLoading } from './components/escrow-stats-loading'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency-price'
import { Clock, Shield, TrendingUp } from 'lucide-react'
import { useReleasePayment } from '@/hooks/use-milestones'
import { useRaiseDisputeForMilestone } from '@/hooks/use-disputes'
import TransactionPinDrawer from '@/components/TransactionPinDrawer'
import { useNavigate } from 'react-router-dom'

const EscrowPayment: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const escrowPaymentStats = useEscrowPaymentStats();
    const releasePayment = useReleasePayment();
    const disputeMilestone = useRaiseDisputeForMilestone();

    const [loadingMilestoneId, setLoadingMilestoneId] = useState<string | undefined>();

    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    const [filters, setFilters] = useState<GetEscrowPaymentQueryDto>({
        page: 1,
        limit: 12,
        search: '',
        startDate: '',
        endDate: '',
    })

    // Pending release state for TransactionPinDrawer
    const [pendingRelease, setPendingRelease] = useState<{
        isOpen: boolean
        milestoneId: string
        projectId: string
        releaseAmount: number
        notes?: string
    } | null>(null)

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

    const handleApproveRelease = (milestoneId: string, projectId: string, releaseData: { releaseAmount: number; notes?: string }) => {
        setPendingRelease({
            isOpen: true,
            milestoneId,
            projectId,
            releaseAmount: releaseData.releaseAmount,
            notes: releaseData.notes,
        })
    }

    const handlePinSuccess = (pin: string) => {
        if (pendingRelease) {
            setLoadingMilestoneId(pendingRelease.milestoneId);
            releasePayment.mutate({
                projectId: pendingRelease.projectId,
                milestoneId: pendingRelease.milestoneId,
                data: {
                    projectId: pendingRelease.projectId,
                    releaseAmount: pendingRelease.releaseAmount,
                    notes: pendingRelease.notes,
                    transactionPin: pin,
                }
            }, {
                onSettled: () => {
                    setLoadingMilestoneId(undefined);
                    setPendingRelease(null);
                }
            })
        }
    }

    const handlePinClose = () => {
        setPendingRelease(null);
    }

    // const handleDispute = (milestoneId: string, projectId: string) => {
    //     setLoadingMilestoneId(milestoneId);
    //     disputeMilestone.mutate({projectId, milestoneId, data: { reason: "Work not satisfactory or incomplete" }}, {
    //         onSettled: () => setLoadingMilestoneId(undefined)
    //     })
    // }

    return (
        <div className="space-y-6">
            <PageHeader title='Escrow & Payments'
                description='Secure milestone-based payments protected by RiskFeed Indigo'
            />
            {/* Escrow Payment Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {escrowPaymentStats.isLoading ? (
                    <EscrowStatsLoading />
                ) : (
                    <>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><Shield className='mr-2 size-4' />Total in Escrow</p>
                                <p className="font-semibold text-[28px]">{formatCurrency(escrowPaymentStats.data?.data?.totalInEscrow, 'USD')}</p>
                            </div>
                        </Card>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><CircleCheckBigIcon className='mr-2 size-4' />Total Released</p>
                                <p className="font-semibold text-[28px] text-green-700 dark:text-green-400">{formatCurrency(escrowPaymentStats.data?.data?.totalReleased, 'USD')}</p>
                            </div>
                        </Card>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><Clock className='mr-2 size-4' />Pending Approval</p>
                                <p className="font-semibold text-[28px] text-red-600 dark:text-red-400">{formatCurrency(escrowPaymentStats.data?.data?.pendingApproval, 'USD')}</p>
                            </div>
                        </Card>
                        <Card className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                            <div>
                                <p className="flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400"><TrendingUp className='mr-2 size-4' />Platform Fees</p>
                                <p className="font-semibold text-[28px]">{formatCurrency(escrowPaymentStats.data?.data?.platformFees, 'USD')}</p>
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
                <div className='sm:w-75 shrink-0'>
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
                        <EscrowPaymentCard 
                            key={item.project?._id || index} 
                            data={item} 
                            role="user" 
                            onApproveRelease={(mId, releaseData) => handleApproveRelease(mId, item.project?._id || '', releaseData)}
                            onDisputeCreated={() => console.log("Dispute created")}
                            onResolveDispute={(mId, projectId) => console.log("Resolve dispute:", mId, projectId)}
                            onViewDisputeHistory={(projectId) => navigate(`/escrow-payments/${projectId}/disputes`)}
                            isLoading={releasePayment.isPending || disputeMilestone.isPending}
                            loadingMilestoneId={loadingMilestoneId}
                        />
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

            {/* Transaction PIN Drawer for Payment Release */}
            <TransactionPinDrawer
                isOpen={pendingRelease?.isOpen || false}
                onClose={handlePinClose}
                onSuccess={handlePinSuccess}
                title="Authorize Payment Release"
                description="Enter your 4-digit transaction PIN to authorize the payment release"
                amount={pendingRelease?.releaseAmount}
                isLoading={releasePayment.isPending}
            />
        </div>
    )
}

export default EscrowPayment