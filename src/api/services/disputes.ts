import type { RaiseMilestoneDisputeDto, ResolveDisputeDto, RespondToDisputeDto } from "@/interfaces/disputes/dto/dispute.dto";
import API_ENDPOINTS from "../api_endpoints";
import api from "../client";

export const DisputesApi = {
    getProjectDisputes: async (projectId: string) => api.get(API_ENDPOINTS.disputes.getProjectDisputes.replace(':projectId', projectId)),
    resolveDispute: async (disputeId: string, data: ResolveDisputeDto) => api.post(API_ENDPOINTS.disputes.resolveDispute.replace(':disputeId', disputeId), data),
    raiseDisputeForMilestone: async (projectId: string, milestoneId: string, data: RaiseMilestoneDisputeDto) => api.post(API_ENDPOINTS.disputes.raiseDisputeForMilestone.replace(':projectId', projectId).replace(':milestoneId', milestoneId), data),
    respondToDispute: async (disputeId: string, data: RespondToDisputeDto) => api.post(API_ENDPOINTS.disputes.respondToDispute.replace(':disputeId', disputeId), data),
}