export interface RaiseMilestoneDisputeDto {
    projectId: string;
    reason: string;
    description: string;
    disputeAttachments?: File[];
}

export interface ResolveDisputeDto {
    resolution: string;
}

export interface RespondToDisputeDto{
    message: string;
    disputeAttachments?: File[];
}