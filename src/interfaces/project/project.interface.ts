import type { IProperties } from "../properties/properties.interface";
import type { IContractor } from "../user/user.interface";

export const PROJECT_STATUSES = ['draft', 'published', 'in_progress', 'completed', 'cancelled',] as const;
export const PROJECT_MILESTONES_STATUSES = ['pending', 'in_progress', 'payment_requested', 'payment_released', 'dispute', 'dispute_resolved', 'completed', 'cancelled',] as const;
export const PROJECT_RISK_LEVELS = ['low', 'medium', 'high'] as const;
export const PROJECT_TYPES = ['kitchen_remodeling', 'bathroom_remodeling', 'roofing', 'flooring', 'painting', 'electrical', 'plumbing', 'hvac', 'landscaping', 'deck_patio', 'basement_finishing', 'windows_doors',] as const;
export const PROJECT_INVITATION_STATUSES = ['pending', 'accepted', 'rejected',] as const;


export interface IProjectMilestone {
    _id: string;
    description?: string;
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

interface IProjectInvitation {
    _id: string;
    contractor: string;
    message?: string;
    status: typeof PROJECT_INVITATION_STATUSES[number];
    invitedAt: Date;
    respondedAt?: Date;
}

export interface IProject {
    _id: string;
    homeowner: string | {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        profilePicture?: string;
    };
    title: string;
    description: string;
    projectType: typeof PROJECT_TYPES[number];
    property: IProperties;
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
    selectedContractor?: string | Partial<IContractor>;
    acceptedProposal?: string;
    milestones?: IProjectMilestone[];
    matchEvaluations?: IProjectMatchEvaluation[];
    matchPercentage?: number;
    riskFactor?: number;
    projectDocuments?: string[];
    projectImages?: string[];
    invitations?: IProjectInvitation[];
    createdAt: Date;
    isInvited?: boolean;
    hasSentProposal?: boolean;
}