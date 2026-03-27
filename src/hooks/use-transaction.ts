import { TransactionApi } from "@/api/services/transactions"
import type { ConfirmMilestoneDto, GetEscrowPaymentQueryDto, GetTransactionsQueryDto } from "@/interfaces/transaction/dto/transaction.dto"
import HandleAPIError from "@/utils/HandleAPIError"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useTransactions = (data: GetTransactionsQueryDto) => {
    return useQuery({
        queryKey: ['transactions', data],
        queryFn: () => TransactionApi.getTransactions(data),
        select: (response) => response.data,
    })
}

export const useTransactionById = (id: string) => {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: () => TransactionApi.getTransactionById(id),
        select: (response) => response.data,
    })
}

export const useConfirmMilestoneCompleted = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({milestoneId, data}: {milestoneId: string, data: ConfirmMilestoneDto}) => TransactionApi.confirmMilestoneCompleted(milestoneId, data),
        onSuccess: () => {
            toast.success('Milestone confirmed successfully');
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useEscrowPayments = (data: GetEscrowPaymentQueryDto) => {
    return useQuery({
        queryKey: ['escrow-payments', data],
        queryFn: () => TransactionApi.getEscrowPayment(data),
        select: (response) => response.data,
    })
}

export const useEscrowPaymentStats = () => {
    return useQuery({
        queryKey: ['escrow-payment-stats'],
        queryFn: () => TransactionApi.getEscrowPaymentStats(),
        select: (response) => response.data,
    })
}