import type { IEscrowPayment } from '@/interfaces/transaction/transaction.interface'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency-price'
import type { IContractor } from '@/interfaces/user/user.interface'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/constants/status-styles'

interface EscrowPaymentCardProps {
    data: IEscrowPayment
    role?: 'user' | 'contractor'
    onApproveRelease?: (milestoneId: string) => void
    onDispute?: (milestoneId: string) => void
    onStartMilestone?: (milestoneId: string) => void
    onRequestPayment?: (milestoneId: string) => void
}

const formatDate = (date: Date | string | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export const EscrowPaymentCard: React.FC<EscrowPaymentCardProps> = ({
    data,
    role = 'user',
    onApproveRelease,
    onDispute,
    onStartMilestone,
    onRequestPayment
}) => {
    // Attempt to extract string or object contractor details
    const contractorObj = data.project?.selectedContractor as Partial<IContractor>;
    const contractorName = contractorObj?.companyName ? contractorObj.companyName : (typeof contractorObj === 'string' ? contractorObj : 'Unknown Contractor');

    const sortedMilestones = [...(data.milestones || [])].sort((a, b) => a.sequence - b.sequence);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            {/* Header Section */}
            <div className='p-6 border-b border-gray-100 dark:border-gray-700 space-y-4'>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="font-semibold text-[20px] text-gray-900 dark:text-white mb-1">{data.project?.title || 'Project Title'}</h2>
                        <p className="font-normal text-[14px] text-gray-600 dark:text-gray-400">
                            Contractor: <span className='text-secondary-foreground font-medium'>{contractorName}</span>
                        </p>
                    </div>
                    <Badge variant="secondary" className={cn("border-0 pointer-events-none rounded-md px-3 font-medium", getStatusColor(data.project?.status))}>
                        {data.project?.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                    </Badge>
                </div>

                {/* Escrow Summary Section */}
                {role === 'user' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Card className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-muted-foreground mb-1">Total Budget</p>
                                <p className="font-semibold text-[16px] text-foreground">{formatCurrency(data.summary?.totalBudget || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-blue-600 dark:text-blue-400 mb-1">Pending Release to Escrow</p>
                                <p className="font-semibold text-[16px] text-blue-600 dark:text-blue-400">{formatCurrency(data.summary?.amountToLoadToEscrow || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-green-600 dark:text-green-400 mb-1">Released</p>
                                <p className="font-semibold text-[16px] text-green-600 dark:text-green-400">{formatCurrency(data.summary?.amountReleased || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-orange-600 dark:text-orange-400 mb-1">In Escrow</p>
                                <p className="font-semibold text-[16px] text-orange-600 dark:text-orange-400">{formatCurrency(data.summary?.fundInEscrow || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-purple-600 dark:text-purple-400 mb-1">Platform Fee (5%)</p>
                                <p className="font-semibold text-[16px] text-purple-600 dark:text-purple-400">{formatCurrency(data.summary?.platformFee || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {role === 'contractor' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Card className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-muted-foreground mb-1">Total Budget</p>
                                <p className="font-semibold text-[16px] text-foreground">{formatCurrency(data.summary?.totalBudget || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-green-600 dark:text-green-400 mb-1">Earned & Paid</p>
                                <p className="font-semibold text-[16px] text-green-600 dark:text-green-400">{formatCurrency(data.summary?.amountReleased || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-blue-600 dark:text-blue-400 mb-1">Pending Release to Escrow</p>
                                <p className="font-semibold text-[16px] text-blue-600 dark:text-blue-400">{formatCurrency(data.summary?.amountToLoadToEscrow || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-orange-600 dark:text-orange-400 mb-1">In Escrow</p>
                                <p className="font-semibold text-[16px] text-orange-600 dark:text-orange-400">{formatCurrency(data.summary?.fundInEscrow || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-1">
                                <p className="font-normal text-[11px] text-purple-600 dark:text-purple-400 mb-1">Platform Fee (5%)</p>
                                <p className="font-semibold text-[16px] text-purple-600 dark:text-purple-400">{formatCurrency(data.summary?.platformFee || 0, 'USD')}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Payment Milestones */}
            <div className="p-6">
                <div className="font-semibold text-[14px] text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h3>Payment Milestones</h3>
                </div>

                <div className="space-y-3">
                    {sortedMilestones.map((milestone, index) => {
                        const mTransactions = data.transactions?.filter(t => t.milestone === milestone._id) || [];
                        const fundedTx = mTransactions.find(t => t.type === 'escrow_hold');
                        const releasedTx = mTransactions.find(t => t.type === 'milestone_release' && t.status === 'released');
                        const authorizedTx = mTransactions.find(t => t.type === 'milestone_release' && t.status === 'authorized');

                        const currentStatus = milestone.status;

                        // Function to render right-hand-side actions specific to role
                        const renderActionsAndStatus = () => {
                            // Unified End States
                            if (currentStatus === 'completed' || currentStatus === 'payment_released') {
                                return (
                                    <>
                                        <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs mb-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Completed & Released</span>
                                        </div>
                                        <div className="text-[11px] text-muted-foreground text-right space-y-0.5 mt-1">
                                            {authorizedTx && <p>Requested: {formatDate(authorizedTx.createdAt)}</p>}
                                            {releasedTx && <p>Released: {formatDate(releasedTx.createdAt)}</p>}
                                        </div>
                                    </>
                                );
                            }

                            if (currentStatus === 'dispute') {
                                return (
                                    <div className="flex items-center gap-1.5 text-red-500 font-medium text-xs mb-1 justify-end">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>In Dispute</span>
                                    </div>
                                );
                            }

                            if (currentStatus === 'dispute_resolved') {
                                return (
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-medium text-xs px-2.5 border-blue-200">
                                        Dispute Resolved
                                    </Badge>
                                );
                            }

                            if (currentStatus === 'cancelled') {
                                return (
                                    <Badge variant="secondary" className="bg-red-50 text-red-600 font-medium text-xs px-2.5 border-red-200">
                                        Cancelled
                                    </Badge>
                                );
                            }

                            // Role specific rendering for active flow statuses
                            if (role === 'contractor') {
                                if (currentStatus === 'pending') {
                                    // Can start if it's the first one, or if the previous one is completed
                                    const isFirst = index === 0;
                                    const prevMilestone = index > 0 ? sortedMilestones[index - 1] : null;
                                    const canStart = isFirst || (prevMilestone && (prevMilestone.status === 'completed' || prevMilestone.status === 'payment_released'));

                                    return (
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs bg-indigo-900 hover:bg-indigo-800 text-white shadow-sm"
                                            disabled={!canStart}
                                            onClick={() => onStartMilestone?.(milestone._id)}
                                        >
                                            Start Milestone
                                        </Button>
                                    );
                                }

                                if (currentStatus === 'in_progress') {
                                    return (
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                                            onClick={() => onRequestPayment?.(milestone._id)}
                                        >
                                            Request Payment
                                        </Button>
                                    );
                                }

                                if (currentStatus === 'payment_requested') {
                                    return (
                                        <Badge variant="secondary" className="bg-orange-50 text-orange-600 font-medium text-xs px-2.5 border-orange-200">
                                            Payment Requested
                                        </Badge>
                                    );
                                }
                            }

                            if (role === 'user') {
                                if (currentStatus === 'pending') {
                                    return (
                                        <Badge variant="secondary" className="bg-muted text-muted-foreground font-medium text-xs px-2.5 hover:bg-muted border-0 h-6">
                                            Not Started
                                        </Badge>
                                    );
                                }

                                if (currentStatus === 'in_progress') {
                                    return (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                                            onClick={() => onDispute?.(milestone._id)}
                                        >
                                            Dispute
                                        </Button>
                                    );
                                }

                                if (currentStatus === 'payment_requested') {
                                    return (
                                        <>
                                            <div className="flex items-center gap-1.5 text-orange-500 font-medium text-xs mb-2 justify-end">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Pending Your Approval</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                                                    onClick={() => onDispute?.(milestone._id)}
                                                >
                                                    Dispute
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-xs bg-indigo-900 hover:bg-indigo-800 text-white"
                                                    onClick={() => onApproveRelease?.(milestone._id)}
                                                >
                                                    Approve & Release
                                                </Button>
                                            </div>
                                        </>
                                    );
                                }
                            }

                            return null;
                        };

                        return (
                            <Card key={milestone._id || index} className="shadow-none p-0 gap-0 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#390085] dark:hover:border-[#8b5cf6] transition-colors">
                                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    {/* Left side: Milestone Details */}
                                    <div className="flex gap-4 items-start w-full md:w-auto">
                                        <div className="flex shrink-0 items-center justify-center min-w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mt-0.5">
                                            {milestone.sequence || index + 1}
                                        </div>
                                        <div className="space-y-1.5 w-full">
                                            <h4 className="font-semibold text-foreground text-sm">{milestone.name}</h4>
                                            {milestone.description && <p className="text-sm text-muted-foreground">{milestone.description}</p>}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                                                <span className="font-medium text-foreground">
                                                    {formatCurrency(milestone.amount || 0, 'USD')} <span className="text-muted-foreground font-normal">({milestone.percentage}% of total)</span>
                                                </span>
                                                {fundedTx && (
                                                    <div className="flex items-center gap-1">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        <span>Funded {formatDate(fundedTx.createdAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side: Status and Actions */}
                                    <div className="flex flex-col items-end gap-1.5 shrink-0 md:min-w-[180px]">
                                        {renderActionsAndStatus()}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

