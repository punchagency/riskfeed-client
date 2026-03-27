

export interface RequestMilestonePaymentDto {
    projectId: string;
    notes?: string;
}

export interface ReleaseMilestonePaymentDto {
    projectId: string;
    releaseAmount?: number;
    notes?: string;
    transactionPin: string;
}
