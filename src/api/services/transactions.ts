import type { ConfirmMilestoneDto, GetEscrowPaymentQueryDto, GetTransactionsQueryDto, ReleaseMilestoneDto } from "@/interfaces/transaction/dto/transaction.dto";
import API_ENDPOINTS from "../api_endpoints";
import api from "../client";


export const TransactionApi = {
    getTransactions: (data: GetTransactionsQueryDto) => api.get(API_ENDPOINTS.transactions.getTransactions, { params: data }),
    getTransactionById: (id: string) => api.get(API_ENDPOINTS.transactions.getTransactionById.replace(':id', id)),
    confirmMilestoneCompleted: (milestoneId: string, data: ConfirmMilestoneDto) => api.post(API_ENDPOINTS.transactions.confirmMilestoneCompleted.replace(':milestoneId', milestoneId), data),
    releaseMilestonePayment: (milestoneId: string, data: ReleaseMilestoneDto) => api.post(API_ENDPOINTS.transactions.releaseMilestonePayment.replace(':milestoneId', milestoneId), data),
    getEscrowPayment: (data: GetEscrowPaymentQueryDto) => api.get(API_ENDPOINTS.transactions.escrowAndPayment, { params: data }),
    getEscrowPaymentStats: () => api.get(API_ENDPOINTS.transactions.escrowPaymentStats),
}