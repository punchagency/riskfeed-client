import type { IProject, IProjectMilestone } from "../project/project.interface";
import type { IContractor, IUser } from "../user/user.interface";

export const DISPUTE_STATUSES = ['open', 'under_review', 'resolved', 'closed'] as const;
export const DISPUTE_TYPES = ['milestone', 'project'] as const;
export const DISPUTE_RAISED_BY_ROLES = ['user', 'contractor'] as const;


interface IDisputeMessage {
    _id: string;
    sender: string;
    senderRole: 'user' | 'contractor' | 'admin';
    message: string;
    attachments?: string[];
    createdAt: Date;
}

export interface IDispute {
    project: string | IProject;
    milestone?: string | IProjectMilestone;
    raisedBy: string | IUser;
    raisedByRole: typeof DISPUTE_RAISED_BY_ROLES[number];
    contractor: string | IContractor;
    homeowner: string | IUser;
    type: typeof DISPUTE_TYPES[number];
    reason: string;
    description: string;
    status: typeof DISPUTE_STATUSES[number];
    resolution?: string;
    resolvedBy?: string | IUser;
    resolvedAt?: Date;
    attachments?: string[];
    messages?: IDisputeMessage[];
}