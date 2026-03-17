interface ProposalMilestoneDto {
    name: string;
    description?: string;
    percentage: number;
    amount: number;
    sequence: number;
}

export interface UpdateProposalDto {
    coverLetter?: string;
    hourlyRate?: number;
    estimatedAmount: number;
    estimatedDurationDays?: number;
    minEstimatedDurationDays?: number;
    maxEstimatedDurationDays?: number;
    estimatedStartDate?: string;
    estimatedEndDate?: string;
    milestones: ProposalMilestoneDto[];
    notes?: string;
    termsAndConditions?: string;
}