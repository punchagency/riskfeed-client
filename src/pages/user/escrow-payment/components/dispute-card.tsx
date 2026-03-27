import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
    AlertCircle,
    Calendar,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    MessageSquare,
    Paperclip,
    Send,
    User,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { getStatusColor } from '@/constants/status-styles'
import type { IDispute } from '@/interfaces/disputes/dispute.interface'
import type { IProject, IProjectMilestone } from '@/interfaces/project/project.interface'
import type { IContractor } from '@/interfaces/user/user.interface'
import { getFileType, getFileName } from '@/lib/attachment-utils'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format-currency-price'
import { AttachmentUpload } from './attachment-upload'

interface IDisputeMessage {
    _id: string
    sender: string
    senderRole: 'user' | 'contractor' | 'admin'
    message: string
    attachments?: string[]
    createdAt: Date
}

interface DisputeCardProps {
    dispute: IDispute & { _id: string; createdAt: string; updatedAt: string }
    role: 'user' | 'contractor'
    index?: number
    onResolve?: (disputeId: string, resolution: string) => void
    onSendMessage?: (disputeId: string, message: string, attachments?: File[]) => void
    isResolving?: boolean
    isSendingMessage?: boolean
}

const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return '—'
    return format(new Date(date), 'MMM d, yyyy h:mm a')
}

const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

const getDisputeStatusIcon = (status: string) => {
    switch (status) {
        case 'open':
            return <AlertCircle className="w-3.5 h-3.5" />
        case 'under_review':
            return <FileText className="w-3.5 h-3.5" />
        case 'resolved':
            return <FileText className="w-3.5 h-3.5" />
        case 'closed':
            return <FileText className="w-3.5 h-3.5" />
        default:
            return <AlertCircle className="w-3.5 h-3.5" />
    }
}

const senderRoleLabel: Record<string, string> = {
    user: 'Homeowner',
    contractor: 'Contractor',
    admin: 'Admin',
}

const senderRoleBadgeClass: Record<string, string> = {
    user: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    contractor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    admin: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const MessageBubble: React.FC<{ msg: IDisputeMessage; isSelf: boolean }> = ({ msg, isSelf }) => (
    <div className={cn('flex gap-2.5', isSelf && 'flex-row-reverse')}>
        <Avatar className="size-7 shrink-0 mt-0.5">
            <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                {msg.senderRole === 'admin' ? 'A' : msg.senderRole[0].toUpperCase()}
            </AvatarFallback>
        </Avatar>
        <div className={cn('flex flex-col gap-1 max-w-[75%]', isSelf && 'items-end')}>
            <div className="flex items-center gap-2 flex-wrap">
                <Badge
                    variant="secondary"
                    className={cn(
                        'border-0 pointer-events-none rounded-md px-2 font-medium text-[10px] py-0',
                        senderRoleBadgeClass[msg.senderRole] ?? 'bg-gray-500/10 text-gray-600'
                    )}
                >
                    {senderRoleLabel[msg.senderRole] ?? msg.senderRole}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{formatDateTime(msg.createdAt)}</span>
            </div>
            <div
                className={cn(
                    'px-3 py-2 rounded-xl text-sm leading-relaxed',
                    isSelf
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted text-foreground rounded-tl-none'
                )}
            >
                {msg.message}
            </div>
            {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1 justify-end">
                    {msg.attachments.map((attachment, i) => {
                        const fileType = getFileType(attachment)
                        return (
                            <a
                                key={i}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/80 hover:bg-muted transition-colors text-[10px] border border-border/50"
                            >
                                {fileType === 'image' ? (
                                    <ImageIcon className="size-2.5" />
                                ) : (
                                    <FileText className="size-2.5" />
                                )}
                                <span>File {i + 1}</span>
                            </a>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
)

// ─── Resolve Dialog ──────────────────────────────────────────────────────────

interface ResolveDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSubmit: (resolution: string) => void
    isLoading?: boolean
}

const ResolveDisputeDialog: React.FC<ResolveDialogProps> = ({ open, onOpenChange, onSubmit, isLoading }) => {
    const [resolution, setResolution] = useState('')

    const handleSubmit = () => {
        if (!resolution.trim()) return
        onSubmit(resolution.trim())
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle>Resolve Dispute</DialogTitle>
                    <DialogDescription>
                        Provide a resolution message. This will mark the dispute as resolved.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                    <Textarea
                        placeholder="Describe the resolution reached for this dispute…"
                        className="min-h-[120px] resize-none text-sm"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                    />
                </div>
                <DialogFooter className="gap-4">
                    <Button variant="outline" className='flex-1' onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-green-700 hover:bg-green-600 text-white flex-1"
                        onClick={handleSubmit}
                        disabled={!resolution.trim() || isLoading}
                    >
                        {isLoading ? 'Resolving…' : 'Confirm Resolution'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Send Message Dialog ─────────────────────────────────────────────────────

interface SendMessageDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSubmit: (message: string, attachments: File[]) => void
    role: 'user' | 'contractor'
    isLoading?: boolean
}

const SendMessageDialog: React.FC<SendMessageDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
    role,
    isLoading,
}) => {
    const [message, setMessage] = useState('')
    const [files, setFiles] = useState<File[]>([])

    const handleSubmit = () => {
        if (!message.trim()) return
        onSubmit(message.trim(), files)
        // Reset local state after submission - parent handles closing
        if (!isLoading) {
            setMessage('')
            setFiles([])
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-card">
                <DialogHeader>
                    <DialogTitle>{role === 'contractor' ? 'Respond to Dispute' : 'Send Message'}</DialogTitle>
                    <DialogDescription>
                        {role === 'contractor'
                            ? 'Send a response regarding this dispute to the homeowner.'
                            : 'Send a message regarding this dispute to the contractor.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-2">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Textarea
                                placeholder="Type your message here…"
                                className="min-h-[120px] resize-none text-sm border-muted-foreground/20 focus-visible:ring-primary/20 transition-all"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                                Attachments
                            </span>
                            <AttachmentUpload
                                files={files}
                                onChange={setFiles}
                                maxFiles={10}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 shadow-none">
                        <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-700 dark:text-blue-300 text-[13px] inline-block">
                            The recipient will be notified immediately once your message is sent and should
                            respond within <span className="font-semibold">24 hours</span>.
                        </AlertDescription>
                    </Alert>
                </div>
                <DialogFooter className="gap-4">
                    <Button variant="outline" className='flex-1' onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button className='flex-1' onClick={handleSubmit} disabled={!message.trim() || isLoading}>
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        {isLoading ? 'Sending…' : 'Send Message'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Main Card ───────────────────────────────────────────────────────────────

export const DisputeCard: React.FC<DisputeCardProps> = ({
    dispute,
    role,
    index = 0,
    onResolve,
    onSendMessage,
    isResolving,
    isSendingMessage,
}) => {
    const [showAllMessages, setShowAllMessages] = useState(false)
    const [resolveOpen, setResolveOpen] = useState(false)
    const [sendMessageOpen, setSendMessageOpen] = useState(false)

    const project = dispute.project as IProject
    const milestone = dispute.milestone as IProjectMilestone | undefined
    // API returns populated objects, not IUser wrapper — cast through unknown
    const raisedBy = dispute.raisedBy as unknown as { _id: string; firstName: string; lastName: string }
    const contractor = dispute.contractor as unknown as Partial<IContractor> & { _id: string }
    const homeowner = dispute.homeowner as unknown as {
        _id: string
        firstName: string
        lastName: string
        email?: string
    }

    const isRaisedByCurrentRole = dispute.raisedByRole === role
    const raisedByName = `${raisedBy?.firstName || ''} ${raisedBy?.lastName || ''}`.trim() || 'Unknown'

    const messages = (dispute.messages ?? []) as IDisputeMessage[]
    const VISIBLE_COUNT = 2
    const hasMoreMessages = messages.length > VISIBLE_COUNT
    const visibleMessages = showAllMessages ? messages : messages.slice(0, VISIBLE_COUNT)

    const handleResolveSubmit = (resolution: string) => {
        onResolve?.(dispute._id, resolution)
        setResolveOpen(false)
    }

    const handleSendMessageSubmit = (message: string, attachments: File[]) => {
        onSendMessage?.(dispute._id, message, attachments)
        setSendMessageOpen(false)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
            >
                <Card className="shadow-none py-0 border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-colors overflow-hidden">
                    <CardContent className="p-0">
                        {/* Card Header */}
                        <div className="p-5 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="space-y-1.5 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-[15px] text-foreground truncate">
                                            {dispute.reason}
                                        </h3>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                'border-0 pointer-events-none rounded-md px-2.5 font-medium text-[11px] gap-1',
                                                getStatusColor(dispute.status)
                                            )}
                                        >
                                            {getDisputeStatusIcon(dispute.status)}
                                            {formatStatus(dispute.status)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {dispute.description}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            'border-0 pointer-events-none rounded-md px-2.5 font-medium text-[11px]',
                                            dispute.type === 'milestone'
                                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        {dispute.type === 'milestone' ? 'Milestone Dispute' : 'Project Dispute'}
                                    </Badge>
                                    {(dispute.status == 'open' || dispute.status == 'under_review') && (
                                        <div className="flex gap-2 mt-2 flex-wrap justify-end">
                                            {role === 'user' && (
                                                <Button
                                                    className="text-xs h-8 bg-green-800 hover:bg-green-600 text-white"
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => setResolveOpen(true)}
                                                >
                                                    Resolve Dispute
                                                </Button>
                                            )}
                                            <Button
                                                className="text-xs h-8"
                                                size="sm"
                                                variant="default"
                                                onClick={() => setSendMessageOpen(true)}
                                            >
                                                {role === 'user' ? 'Send Message' : 'Respond to Dispute'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Details Section */}
                        <div className="p-5 space-y-4">
                            {/* Milestone Info (if milestone dispute) */}
                            {milestone && (
                                <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                    <p className="font-normal text-[11px] text-muted-foreground mb-1.5 uppercase tracking-wider">
                                        Milestone
                                    </p>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                            <span className="font-semibold text-[14px] text-foreground truncate">
                                                {milestone.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-semibold text-[14px] text-foreground">
                                                {formatCurrency(milestone.amount || 0, 'USD')}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    'border-0 pointer-events-none rounded-md px-2 font-medium text-[11px]',
                                                    getStatusColor(milestone.status)
                                                )}
                                            >
                                                {formatStatus(milestone.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Parties Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Raised By */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9">
                                        <AvatarImage src={contractor?.companyLogo} />
                                        <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                                            {raisedBy?.firstName?.[0]}
                                            {raisedBy?.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-normal text-[11px] text-muted-foreground">Raised By</p>
                                        <p className="font-medium text-[13px] text-foreground truncate">
                                            {raisedByName}
                                            {isRaisedByCurrentRole && (
                                                <span className="text-muted-foreground font-normal ml-1">
                                                    (You)
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground capitalize">
                                            {dispute.raisedByRole}
                                        </p>
                                    </div>
                                </div>

                                {/* Against */}
                                <div className="flex items-center gap-3">
                                    {role === 'user' ? (
                                        <>
                                            <Avatar className="size-9">
                                                <AvatarImage src={contractor?.companyLogo} />
                                                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                                                    {contractor?.companyName?.[0] || 'C'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-normal text-[11px] text-muted-foreground">
                                                    Contractor
                                                </p>
                                                <p className="font-medium text-[13px] text-foreground truncate">
                                                    {contractor?.companyName || 'Unknown Contractor'}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Avatar className="size-9">
                                                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                                                    <User className="w-4 h-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-normal text-[11px] text-muted-foreground">
                                                    Homeowner
                                                </p>
                                                <p className="font-medium text-[13px] text-foreground truncate">
                                                    {homeowner?.firstName} {homeowner?.lastName}
                                                </p>
                                                {homeowner?.email && (
                                                    <p className="text-[11px] text-muted-foreground truncate">
                                                        {homeowner.email}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Messages Section */}
                            {messages.length > 0 && (
                                <div className="space-y-3">
                                    <p className="font-normal text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3" />
                                        Messages ({messages.length})
                                    </p>
                                    <div className="space-y-3">
                                        <AnimatePresence initial={false}>
                                            {visibleMessages.map((msg) => (
                                                <motion.div
                                                    key={msg._id}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <MessageBubble
                                                        msg={msg}
                                                        isSelf={msg.senderRole === role}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {hasMoreMessages && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
                                            onClick={() => setShowAllMessages((prev) => !prev)}
                                        >
                                            {showAllMessages ? (
                                                <>
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                    Show fewer messages
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                    See {messages.length - VISIBLE_COUNT} more message
                                                    {messages.length - VISIBLE_COUNT > 1 ? 's' : ''}
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Attachments */}
                            {dispute.attachments && dispute.attachments.length > 0 && (
                                <div className="space-y-2">
                                    <p className="font-normal text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <Paperclip className="w-3 h-3" />
                                        Attachments ({dispute.attachments.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {dispute.attachments.map((attachment, i) => {
                                            const fileType = getFileType(attachment)
                                            const fileName = getFileName(attachment)
                                            return (
                                                <a
                                                    key={i}
                                                    href={attachment}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-sm"
                                                >
                                                    {fileType === 'image' ? (
                                                        <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                                    ) : (
                                                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                                    )}
                                                    <span className="text-xs text-foreground truncate max-w-[150px]">
                                                        {fileName}
                                                    </span>
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                                </a>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Resolution (if resolved) */}
                            {dispute.resolution && (
                                <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800">
                                    <p className="font-normal text-[11px] text-teal-600 dark:text-teal-400 mb-1 uppercase tracking-wider">
                                        Resolution
                                    </p>
                                    <p className="text-sm text-foreground">{dispute.resolution}</p>
                                    {dispute.resolvedAt && (
                                        <p className="text-[11px] text-muted-foreground mt-1.5">
                                            Resolved on {formatDateTime(dispute.resolvedAt)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    <span>Filed {formatDateTime(dispute.createdAt)}</span>
                                </div>
                                {project?.title && (
                                    <span className="truncate max-w-[200px]">
                                        Project:{' '}
                                        <span className="font-medium text-foreground">{project.title}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Resolve Dispute Dialog */}
            {role === 'user' && (
                <ResolveDisputeDialog
                    open={resolveOpen}
                    onOpenChange={setResolveOpen}
                    onSubmit={handleResolveSubmit}
                    isLoading={isResolving}
                />
            )}

            {/* Send Message Dialog */}
            <SendMessageDialog
                open={sendMessageOpen}
                onOpenChange={setSendMessageOpen}
                onSubmit={handleSendMessageSubmit}
                role={role}
                isLoading={isSendingMessage}
            />
        </>
    )
}
