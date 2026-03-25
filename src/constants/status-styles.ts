
export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
        case 'ongoing':
            return 'bg-amber-500/20 text-amber-600 border-amber-500/30 dark:text-amber-400';
        case 'quote_sent':
            return 'bg-blue-500/20 text-blue-600 border-blue-500/30 dark:text-blue-400';
        case 'quote_accepted':
        case 'payment_pending':
            return 'bg-purple-500/20 text-purple-600 border-purple-500/30 dark:text-purple-400';
        case 'payment_completed':
        case 'confirmed':
            return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30 dark:text-emerald-400';
        case 'service_in_progress':
        case 'in_progress':
            return 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30 dark:text-indigo-400';
        case 'scheduled':
            return 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30 dark:text-indigo-400';
        case 'completed_by_provider':
        case 'completed_by_client':
        case 'completed':
        case 'successful':
            return 'bg-green-500/20 text-green-600 border-green-500/30 dark:text-green-400';
        case 'cancelled_by_client':
        case 'cancelled_by_provider':
        case 'quote_rejected':
            return 'bg-red-500/20 text-red-600 border-red-500/30 dark:text-red-400';
        case 'disputed':
            return 'bg-orange-500/20 text-orange-600 border-orange-500/30 dark:text-orange-400';
        case 'resolved':
            return 'bg-teal-500/20 text-teal-600 border-teal-500/30 dark:text-teal-400';
        case 'no_show':
            return 'bg-gray-500/20 text-gray-600 border-gray-500/30 dark:text-gray-400';
        default:
            return 'bg-slate-500/20 text-slate-600 border-slate-500/30 dark:text-slate-400';
    }
};

export const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'escrow_held':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'released_to_provider':
        case 'paid':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'refunded_to_client':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        case 'failed':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
};

export const getPaymentStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
        case 'escrow_held':
            return 'Payment secured - will be released upon job completion';
        case 'released_to_provider':
            return 'Payment released to you';
        case 'refunded_to_client':
            return 'Payment refunded to client';
        case 'failed':
            return 'Payment failed - contact support';
        case 'pending':
            return 'Awaiting payment from client';
        default:
            return status;
    }
};