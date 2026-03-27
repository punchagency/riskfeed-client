import type { IProject, IProjectMilestone } from "../project/project.interface";
import type { IProposal } from "../proposal/proposal.interface";
import type { IContractor, IUser } from "../user/user.interface";


export const TRANSACTION_STATUSES = ['pending', 'authorized', 'released', 'failed', 'refunded'] as const;
export const TRANSACTION_TYPES = ['escrow_hold', 'milestone_release', 'wallet_topup', 'withdrawal', 'refund'] as const;

export interface ITransaction extends Document {
    _id: string;
    project?: string | IProject;
    proposal?: string | IProposal;
    contractor?: string | IContractor;
    homeowner?: string | IUser;
    milestone?: string;
    milestoneName?: string;
    milestonePercentage?: number;
    type: typeof TRANSACTION_TYPES[number];
    amount: number;
    userBalanceAfter?: number;
    userBalanceBefore?: number;
    contractorBalanceAfter?: number;
    contractorBalanceBefore?: number;
    releasedAmount?: number;
    platformFee: number;
    dueDate?: Date;
    date?: Date;
    status: typeof TRANSACTION_STATUSES[number];
    paymentProvider?: string;
    paymentIntentId?: string;
    notes?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}


interface Summary {
  totalBudget: number;
  amountToLoadToEscrow: number;
  fundInEscrow: number;
  amountReleased: number;
  platformFee: number;
}

export interface IEscrowPayment {
  project: IProject & { hasDispute: boolean };
  milestones: IProjectMilestone[];
  transactions: ITransaction[];
  summary: Summary;
}