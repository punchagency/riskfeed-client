import React, { useState } from 'react'
import { FileText } from 'lucide-react'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/utils/format-currency-price'
import type { IProjectMilestone } from '@/interfaces/project/project.interface'
import type { IContractor } from '@/interfaces/user/user.interface'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ApproveReleasePaymentDialogProps {
    milestone: IProjectMilestone
    contractor?: string | Partial<IContractor>
    projectTitle?: string
    trigger?: React.ReactNode
    onConfirm: (data: { releaseAmount: number; notes?: string }) => void
    isLoading?: boolean
}

export const ApproveReleasePaymentDialog: React.FC<ApproveReleasePaymentDialogProps> = ({
    milestone,
    contractor,
    projectTitle,
    trigger,
    onConfirm,
    isLoading = false,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [releaseAmount, setReleaseAmount] = useState<string>(String(milestone.amount || 0))
    const [notes, setNotes] = useState('')

    const contractorName = typeof contractor === 'object' && contractor !== null
        ? (contractor as Partial<IContractor>).companyName || 'Unknown Contractor'
        : contractor || 'Unknown Contractor'

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset form when dialog closes
            setReleaseAmount(String(milestone.amount || 0))
            setNotes('')
        }
        setIsOpen(open)
    }

    const handleConfirm = () => {
        const amount = parseFloat(releaseAmount)
        if (isNaN(amount) || amount <= 0) {
            return
        }
        onConfirm({
            releaseAmount: amount,
            notes: notes.trim() || undefined,
        })
        setIsOpen(false)
    }

    const isValidAmount = () => {
        const amount = parseFloat(releaseAmount)
        return !isNaN(amount) && amount > 0 && amount <= milestone.amount
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        size="sm"
                        className="h-8 text-xs bg-indigo-900 hover:bg-indigo-800 text-white"
                        disabled={isLoading}
                    >
                        Approve & Release
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Approve & Release Payment</DialogTitle>
                    <DialogDescription>
                        Review the milestone details and specify the amount to release to the contractor.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Milestone Details */}
                    <div className="bg-secondary dark:bg-muted/50 rounded-lg space-y-3 p-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Project</p>
                            <p className="font-medium text-sm">{projectTitle || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Milestone</p>
                            <p className="font-medium text-sm">{milestone.name}</p>
                        </div>
                        {milestone.description && (
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Description</p>
                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Contractor</p>
                            <p className="font-medium text-sm">{contractorName}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                            <div className="space-y-0.5">
                                <p className="text-xs text-muted-foreground">Milestone Amount</p>
                                <p className="font-semibold text-lg">
                                    {formatCurrency(milestone.amount || 0, 'USD')}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Percentage</p>
                                <p className="font-medium text-sm">{milestone.percentage}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Release Amount Input */}
                    <div className="space-y-2">
                        <Label htmlFor="release-amount" className="flex items-center gap-2">
                            Release Amount <span className='text-destructive'>*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                $
                            </span>
                            <Input
                                id="release-amount"
                                type="number"
                                min="0"
                                max={milestone.amount}
                                step="0.01"
                                value={releaseAmount}
                                onChange={(e) => setReleaseAmount(e.target.value)}
                                className="pl-7 h-11"
                                placeholder="Enter amount to release"
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Maximum: {formatCurrency(milestone.amount || 0, 'USD')}
                        </p>
                    </div>

                    {/* Notes Input */}
                    <div className="space-y-2">
                        <Label htmlFor="release-notes" className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Notes (Optional)
                        </Label>
                        <Textarea
                            id="release-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this payment release..."
                            className="min-h-20 resize-none"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <Alert className='p-4 rounded-lg border-[#390085] dark:border-[#8b5cf6] bg-purple-50 dark:bg-purple-900/10'>
                    <AlertTitle className='font-semibold text-[14px] text-gray-900 dark:text-white mb-1'>Riskfeed Indigo Protection</AlertTitle>
                    <AlertDescription className='font-normal text-[13px] text-gray-600 dark:text-gray-400'>
                        By approving this milestone, you confirm that the work has been completed satisfactorily. Funds will be released to the contractor within 24 hours.
                    </AlertDescription>
                </Alert>

                <DialogFooter className="gap-4 flex ">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="flex-1" disabled={isLoading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        className="flex-1"
                        onClick={handleConfirm}
                        disabled={!isValidAmount() || isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Approve & Release'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
