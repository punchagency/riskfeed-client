import type { IContractor } from "../user/user.interface";

export const PROJECT_STATUSES = ['draft', 'published', 'in_progress', 'completed', 'cancelled',] as const;
export const PROJECT_MILESTONES_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled',] as const;
export const PROJECT_RISK_LEVELS = ['low', 'medium', 'high'] as const;

interface IProjectPropertySnapshot {
    type: string;
    name?: string;
    address: {
        street: string;
        zipcode: string;
        city: string;
        state: string;
        country: string;
    };
    ownershipType?: string;
    sizeSqFt?: number;
    ownerName?: string;
    images?: string[];
    documents?: string[];
}

interface IProjectMilestone {
    name: string;
    percentage: number;
    amount: number;
    sequence: number;
    status: typeof PROJECT_MILESTONES_STATUSES[number];
    transaction?: string;
}

interface IProjectMatchEvaluation {
    contractor?: string | Partial<IContractor>;
    matchPercentage: number;
    riskFactor: number;
    evaluatedAt: Date;
}

export interface IProject {
    _id: string;
    homeowner: string;
    title: string;
    description: string;
    property: IProjectPropertySnapshot;
    minBudget: number;
    maxBudget: number;
    durationDays?: number;
    durationRange?: {
        minDays: number;
        maxDays: number;
    };
    startDate?: Date;
    status: typeof PROJECT_STATUSES[number];
    riskLevel?: typeof PROJECT_RISK_LEVELS[number];
    selectedContractor?: string;
    acceptedProposal?: string;
    milestones?: IProjectMilestone[];
    matchEvaluations?: IProjectMatchEvaluation[];
    matchPercentage?: number;
    riskFactor?: number;
}