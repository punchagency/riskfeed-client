import type { TRANSACTION_STATUSES, TRANSACTION_TYPES } from "../transaction.interface";

export interface GetTransactionsQueryDto {
    type?: typeof TRANSACTION_TYPES[number];
    status?: typeof TRANSACTION_STATUSES[number];
    project?: string;
    page?: number;
    limit?: number;
}

export interface ConfirmMilestoneDto {
    projectId: string;
}

export interface GetEscrowPaymentQueryDto {
    projectId?: string;
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
}