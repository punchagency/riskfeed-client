import type { IEscrowPayment } from '@/interfaces/transaction/transaction.interface'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Lock, CheckCircle2, AlertCircle, Loader2, History } from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency-price'
import type { IContractor } from '@/interfaces/user/user.interface'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/constants/status-styles'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ApproveReleasePaymentDialog } from './approve-release-payment-dialog'
import CreateMilestoneDispute from './create-milestone-dispute'
import { useNavigate } from 'react-router-dom'

interface EscrowPaymentCardProps {
    data: IEscrowPayment
    role?: 'user' | 'contractor'
    onApproveRelease?: (milestoneId: string, data: { releaseAmount: number; notes?: string }) => void
    onDisputeCreated?: () => void
    onResolveDispute?: (milestoneId: string, projectId: string) => void
    onViewDisputeHistory?: (projectId: string) => void
    onStartMilestone?: (milestoneId: string, projectId: string) => void
    onRequestPayment?: (milestoneId: string, projectId: string) => void
    isLoading?: boolean
    loadingMilestoneId?: string
}

const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
};

export const EscrowPaymentCard: React.FC<EscrowPaymentCardProps> = ({
    data,
    role = 'user',
    onApproveRelease,
    onDisputeCreated,
    onResolveDispute,
    onViewDisputeHistory,
    onStartMilestone,
    onRequestPayment,
    isLoading,
    loadingMilestoneId
}) => {
    const navigate = useNavigate();
    const contractorObj = data.project?.selectedContractor as Partial<IContractor>;
    const contractorName = contractorObj?.companyName ? contractorObj.companyName : (typeof contractorObj === 'string' ? contractorObj : 'Unknown Contractor');

    const sortedMilestones = [...(data.milestones || [])].sort((a, b) => a.sequence - b.sequence);

    const ConfirmDialog = ({
        trigger,
        title,
        description,
        onConfirm,
        variant = "default"
    }: {
        trigger: React.ReactNode,
        title: string,
        description: string,
        onConfirm: () => void,
        variant?: "default" | "destructive"
    }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="h-10">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "", "h-10")}
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

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
                    <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className={cn("border-0 pointer-events-none rounded-md px-3 font-medium", getStatusColor(data.project?.status))}>
                            {data.project?.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                        </Badge>
                        {data.project?.hasDispute && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 border-destructive border"
                                onClick={() => onViewDisputeHistory?.(data.project?._id || '')}
                            >
                                <History className="w-3 h-3" />
                                View Dispute History
                            </Button>
                        )}
                    </div>
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
                        const isMilestoneLoading = isLoading && loadingMilestoneId === milestone._id;

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
                                            {authorizedTx && <p>Requested: {formatDateTime(authorizedTx.createdAt)}</p>}
                                            {releasedTx && <p>Released: {formatDateTime(releasedTx.createdAt)}</p>}
                                        </div>
                                    </>
                                );
                            }

                            if (currentStatus === 'dispute') {
                                return (
                                    <>
                                        <div className="flex items-center gap-1.5 text-red-500 font-medium text-xs mb-1 justify-end">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>In Dispute</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            {role === 'user' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                                                    disabled={isMilestoneLoading}
                                                    onClick={() => onResolveDispute?.(milestone._id, data.project?._id || '')}
                                                >
                                                    {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                    Resolve Dispute
                                                </Button>
                                            )}
                                            {role === 'contractor' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs border-border"
                                                    disabled={isMilestoneLoading}
                                                    onClick={() => navigate(`/escrow-payments/${data.project?._id}/disputes`)}
                                                >
                                                    {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                    View Dispute
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                );
                            }

                            if (currentStatus === 'dispute_resolved' && role === 'contractor') {
                                return (
                                    <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-50/20 text-blue-600 font-medium text-xs px-2.5 border-blue-200 dark:border-blue-50/20">
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
                                        <ConfirmDialog
                                            title="Start Milestone"
                                            description="Are you sure you want to start this milestone? This will notify the homeowner."
                                            onConfirm={() => onStartMilestone?.(milestone._id, data.project?._id || '')}
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-xs bg-indigo-900 hover:bg-indigo-800 text-white shadow-sm"
                                                    disabled={!canStart || isMilestoneLoading}
                                                >
                                                    {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                    Start Milestone
                                                </Button>
                                            }
                                        />
                                    );
                                }

                                if (currentStatus === 'in_progress') {
                                    return (
                                        <ConfirmDialog
                                            title="Request Payment"
                                            description="Are you sure you want to request payment for this milestone? Ensure all work for this milestone is completed."
                                            onConfirm={() => onRequestPayment?.(milestone._id, data.project?._id || '')}
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
                                                    disabled={isMilestoneLoading}
                                                >
                                                    {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                    Request Payment
                                                </Button>
                                            }
                                        />
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
                                        <CreateMilestoneDispute
                                            project={data.project}
                                            milestone={milestone}
                                            onDisputeCreated={onDisputeCreated}
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                                                    disabled={isMilestoneLoading}
                                                >
                                                    {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                    Dispute
                                                </Button>
                                            }
                                        />
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
                                                <CreateMilestoneDispute
                                                    project={data.project}
                                                    milestone={milestone}
                                                    onDisputeCreated={onDisputeCreated}
                                                    trigger={
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                                                            disabled={isMilestoneLoading}
                                                        >
                                                            {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                            Dispute
                                                        </Button>
                                                    }
                                                />
                                                <ApproveReleasePaymentDialog
                                                    milestone={milestone}
                                                    contractor={data.project?.selectedContractor}
                                                    projectTitle={data.project?.title}
                                                    onConfirm={(releaseData) => onApproveRelease?.(milestone._id, releaseData)}
                                                    isLoading={isMilestoneLoading}
                                                    trigger={
                                                        <Button
                                                            size="sm"
                                                            className="h-8 text-xs bg-indigo-900 hover:bg-indigo-800 text-white"
                                                            disabled={isMilestoneLoading}
                                                        >
                                                            {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                            Approve & Release
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </>
                                    );
                                }

                                if (currentStatus === 'dispute_resolved') {
                                    return (
                                        <>
                                            <div className="flex items-center gap-1.5 text-orange-500 font-medium text-xs mb-2 justify-end">
                                                <AlertCircle className="w-4 h-4" />
                                                <span>Pending Your Approval (Dispute Resolved)</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                {/* <CreateMilestoneDispute
                                                    project={data.project}
                                                    milestone={milestone}
                                                    onDisputeCreated={onDisputeCreated}
                                                    trigger={
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                                                            disabled={isMilestoneLoading}
                                                        >
                                                            {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                            Dispute
                                                        </Button>
                                                    }
                                                /> */}
                                                <ApproveReleasePaymentDialog
                                                    milestone={milestone}
                                                    contractor={data.project?.selectedContractor}
                                                    projectTitle={data.project?.title}
                                                    onConfirm={(releaseData) => onApproveRelease?.(milestone._id, releaseData)}
                                                    isLoading={isMilestoneLoading}
                                                    trigger={
                                                        <Button
                                                            size="sm"
                                                            className="h-8 text-xs text-white"
                                                            disabled={isMilestoneLoading}
                                                        >
                                                            {isMilestoneLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                                            Approve & Release
                                                        </Button>
                                                    }
                                                />
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
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                                                <span className="font-medium text-foreground">
                                                    {formatCurrency(milestone.amount || 0, 'USD')} <span className="text-muted-foreground font-normal">({milestone.percentage}% of total)</span>
                                                </span>
                                                {milestone.startedAt && <span>Started: <span className="text-foreground font-medium">{formatDateTime(milestone.startedAt)}</span></span>}
                                                {milestone.paymentRequestedAt && <span>Requested: <span className="text-foreground font-medium">{formatDateTime(milestone.paymentRequestedAt)}</span></span>}
                                                {milestone.completedAt && <span>Completed: <span className="text-foreground font-medium">{formatDateTime(milestone.completedAt)}</span></span>}
                                                {fundedTx && (
                                                    <div className="flex items-center gap-1">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        <span>Funded <span className="text-foreground font-medium">{formatDateTime(fundedTx.createdAt)}</span></span>
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
