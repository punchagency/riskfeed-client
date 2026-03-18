import type { IProject } from "../project/project.interface";
import type { IContractor } from "../user/user.interface";

export const PROPOSAL_STATUSES = ['pending', 'accepted', 'rejected', 'withdrawn'] as const;
export const JOB_STATUSES = ['pending', 'active', 'completed', 'cancelled'] as const;

interface IProposalMilestone {
    _id: string;
    name: string;
    description?: string;
    percentage: number;
    amount: number;
    sequence: number;
}

export interface IProposal {
    _id: string;
    project: string;
    contractor?: IContractor | string;
    coverLetter?: string;
    hourlyRate?: number;
    submissionDate: Date;
    status: typeof PROPOSAL_STATUSES[number];
    estimatedAmount: number;
    estimatedDurationDays?: number;
    minEstimatedDurationDays?: number;
    maxEstimatedDurationDays?: number;
    estimatedStartDate?: Date;
    estimatedEndDate?: Date;
    milestones?: IProposalMilestone[];
    notes?: string;
    termsAndConditions?: string;
    matchPercentage?: number;
    riskFactor?: number;
    isWithdrawn: boolean;
    viewedByOwner: boolean;
    viewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface IJobMilestone {
    _id: string;
    name: string;
    description?: string;
    percentage: number;
    amount: number;
    sequence: number;
}

export interface IJob {
    _id: string;
    project: IProject;
    contractor: string;
    coverLetter?: string;
    submissionDate: Date;
    status: typeof JOB_STATUSES[number];
    estimatedAmount: number;
    estimatedDurationDays?: number;
    estimatedStartDate?: Date;
    estimatedEndDate?: Date;
    milestones?: IJobMilestone[];
    notes?: string;
    termsAndConditions?: string;
    progress?: number;
    isWithdrawn: boolean;
    viewedByOwner: boolean;
    createdAt: Date;
    updatedAt: Date;
}