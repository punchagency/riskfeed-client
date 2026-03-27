import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { PageBackButton } from '@/components/page-back-button'
import { PageHeader } from '@/components/page-header'
import { useGetProjectDisputes, useResolveDispute, useRespondToDispute } from '@/hooks/use-disputes'
import type { IDispute } from '@/interfaces/disputes/dispute.interface'
import { cn } from '@/lib/utils'
import { DisputeCard } from './components/dispute-card'
import { DisputePageLoading } from './components/dispute-loading'
import { DisputeEmpty } from './components/dispute-empty'

type DisputeWithMeta = IDispute & { _id: string; createdAt: string; updatedAt: string }

const ProjectDisputes: React.FC = () => {
    const navigate = useNavigate()
    const { projectId } = useParams<{ projectId: string }>()
    const projectDisputes = useGetProjectDisputes(projectId)
    const resolveDispute = useResolveDispute()
    const respondToDispute = useRespondToDispute()

    const disputes: DisputeWithMeta[] = projectDisputes.data?.data || []

    // Compute stats
    const totalDisputes = disputes.length
    const openDisputes = disputes.filter((d) => d.status === 'open').length
    const underReviewDisputes = disputes.filter((d) => d.status === 'under_review').length
    const resolvedDisputes = disputes.filter((d) => d.status === 'resolved' || d.status === 'closed').length

    const handleResolve = (disputeId: string, resolution: string) => {
        resolveDispute.mutate({ disputeId, data: { resolution } })
    }

    const handleSendMessage = (disputeId: string, message: string, attachments?: File[]) => {
        respondToDispute.mutate({ 
            disputeId, 
            data: { 
                message, 
                disputeAttachments: attachments 
            } 
        })
    }

    if (projectDisputes.isLoading) {
        return <DisputePageLoading />
    }

    return (
        <div className="space-y-6">
            <PageBackButton text="Back to Escrow Payments" onClick={() => navigate('/escrow-payments')} />

            <PageHeader
                title="Project Disputes"
                description="View and track all disputes raised for this project"
            />

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
                <Card className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 shadow-none border-0">
                    <CardContent className="p-0 space-y-1">
                        <p className="font-normal text-[11px] text-muted-foreground">Total Disputes</p>
                        <p className="font-semibold text-[24px] text-foreground">{totalDisputes}</p>
                    </CardContent>
                </Card>
                <Card className={cn("p-4 rounded-lg shadow-none border-0", "bg-orange-50 dark:bg-orange-900/20")}>
                    <CardContent className="p-0 space-y-1">
                        <p className="font-normal text-[11px] text-orange-600 dark:text-orange-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Open
                        </p>
                        <p className="font-semibold text-[24px] text-orange-600 dark:text-orange-400">{openDisputes}</p>
                    </CardContent>
                </Card>
                <Card className={cn("p-4 rounded-lg shadow-none border-0", "bg-yellow-50 dark:bg-yellow-900/20")}>
                    <CardContent className="p-0 space-y-1">
                        <p className="font-normal text-[11px] text-yellow-600 dark:text-yellow-400">Under Review</p>
                        <p className="font-semibold text-[24px] text-yellow-600 dark:text-yellow-400">{underReviewDisputes}</p>
                    </CardContent>
                </Card>
                <Card className={cn("p-4 rounded-lg shadow-none border-0", "bg-teal-50 dark:bg-teal-900/20")}>
                    <CardContent className="p-0 space-y-1">
                        <p className="font-normal text-[11px] text-teal-600 dark:text-teal-400">Resolved / Closed</p>
                        <p className="font-semibold text-[24px] text-teal-600 dark:text-teal-400">{resolvedDisputes}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Disputes List */}
            {disputes.length === 0 ? (
                <DisputeEmpty />
            ) : (
                <div className="space-y-4">
                    {disputes.map((dispute, index) => (
                        <DisputeCard
                            key={dispute._id}
                            dispute={dispute}
                            role="user"
                            index={index}
                            onResolve={handleResolve}
                            onSendMessage={handleSendMessage}
                            isResolving={resolveDispute.isPending}
                            isSendingMessage={respondToDispute.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectDisputes
