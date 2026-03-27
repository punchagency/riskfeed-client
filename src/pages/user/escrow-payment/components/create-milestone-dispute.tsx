import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, FileText } from "lucide-react"
import React, { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRaiseDisputeForMilestone } from "@/hooks/use-disputes"
import type { IProject, IProjectMilestone } from "@/interfaces/project/project.interface"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency } from "@/utils/format-currency-price"
import { AttachmentUpload } from "./attachment-upload"

const REASONS = [
    "Quality of Work Below Standard",
    "Missed Deadlines",
    "Unprofessional Behavior",
    "Work Incomplete",
    "Timeline Issues",
    "Wrong/Substandard Materials Used",
    "Damage to Property",
    "Work does not match Agreed Scope",
    "Safety Concerns",
    "Other Issues",
]

const disputeSchema = z.object({
    reason: z.string().min(1, "Please select a reason"),
    description: z.string().min(10, "Description must be at least 10 characters"),
})

type DisputeFormData = z.infer<typeof disputeSchema>

interface CreateMilestoneDisputeProps {
    project: IProject
    milestone: IProjectMilestone
    trigger?: React.ReactNode
    onDisputeCreated?: () => void
}

const CreateMilestoneDispute: React.FC<CreateMilestoneDisputeProps> = ({
    project,
    milestone,
    trigger,
    onDisputeCreated,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const raiseDispute = useRaiseDisputeForMilestone()

    const form = useForm<DisputeFormData>({
        resolver: zodResolver(disputeSchema),
        defaultValues: {
            reason: "",
            description: "",
        },
    })

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            form.reset()
            setFiles([])
        }
        setIsOpen(open)
    }, [form])

    const onSubmit = async (data: DisputeFormData) => {
        try {
            await raiseDispute.mutateAsync({
                projectId: project._id,
                milestoneId: milestone._id,
                data: {
                    projectId: project._id,
                    reason: data.reason,
                    description: data.description,
                    disputeAttachments: files.length > 0 ? files : undefined,
                },
            })
            onDisputeCreated?.()
            handleOpenChange(false)
        } catch {
            // Error is handled by the hook's onError callback
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:bg-red-50 hover:text-destructive border-border"
                    >
                        Dispute
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CircleAlert className="w-5 h-5 text-destructive" />
                        Dispute Milestone
                    </DialogTitle>
                    <DialogDescription>
                        Submit a dispute for this milestone. The contractor will be notified.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Milestone Info */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <p className="font-normal text-[13px] text-gray-500 dark:text-gray-400 mb-1">Milestone</p>
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-[16px] text-gray-900 dark:text-white">{milestone.name}</span>
                        </div>
                        <p className="font-semibold text-[14px] text-gray-600 dark:text-gray-400 mt-1">
                            {formatCurrency(milestone.amount, "USD")}
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Reason Select */}
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason <span className="text-destructive">*</span></FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a reason" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {REASONS.map((reason) => (
                                                    <SelectItem
                                                        key={reason}
                                                        value={reason}
                                                    >
                                                        {reason}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Textarea */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the issue in detail..."
                                                className="min-h-25 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* File Upload Component */}
                            <div className="space-y-2">
                                <Label>Attachments (Optional)</Label>
                                <AttachmentUpload 
                                    files={files}
                                    onChange={setFiles}
                                    maxFiles={10}
                                    disabled={raiseDispute.isPending}
                                />
                            </div>

                            <Alert className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 shadow-none">
                                <AlertTitle className="font-semibold text-[14px] text-gray-900 dark:text-white mb-1">
                                    Dispute Resolution Process
                                </AlertTitle>
                                <AlertDescription>
                                    <ul className="font-normal text-[13px] text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                                        <li>RiskFeed Indigo will review your dispute within 24-48 hours</li>
                                        <li>Both parties will be contacted to provide evidence and statements</li>
                                        <li>Funds will remain securely in escrow until resolution</li>
                                        <li>A final decision will be made based on contract terms and evidence</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>

                            <DialogFooter className="gap-4">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        disabled={raiseDispute.isPending}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="flex-1 bg-destructive hover:bg-destructive/90"
                                    disabled={raiseDispute.isPending}
                                >
                                    {raiseDispute.isPending ? "Submitting..." : "Submit Dispute"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMilestoneDispute
