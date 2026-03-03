import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmDeleteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
    title?: string
    description?: string
    isLoading?: boolean
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone. This will permanently delete this item from our servers.',
    isLoading = false,
}) => {
    const handleConfirm = async () => {
        await onConfirm()
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading} className="hover:bg-primary/90 hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDelete