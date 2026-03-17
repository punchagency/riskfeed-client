import type { PROPOSAL_STATUSES } from "../proposal.interface";

export class GetProposalsQueryDto {
    project?: string;
    contractor?: string;
    status?: typeof PROPOSAL_STATUSES[number];
    page?: number;
    limit?: number;
}

export class GetJobsQueryDto {
    jobStatus?: 'pending' | 'active' | 'completed' | 'cancelled';
    page?: number;
    limit?: number;
    search?: string;
}