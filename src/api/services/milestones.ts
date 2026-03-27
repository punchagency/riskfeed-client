import API_ENDPOINTS from "../api_endpoints";
import api from "../client";
import type { RequestMilestonePaymentDto, ReleaseMilestonePaymentDto } from "@/interfaces/project/dto/milestone-actions.dto";

export const MilestonesApi = {
    startMilestone: (projectId: string, milestoneId: string) => api.post(API_ENDPOINTS.milestones.startMileStone.replace(':projectId', projectId).replace(':milestoneId', milestoneId)),
    requestPayment: (projectId: string, milestoneId: string, data: RequestMilestonePaymentDto) => api.post(API_ENDPOINTS.milestones.requestPayment.replace(':projectId', projectId).replace(':milestoneId', milestoneId), data),
    releasePayment: (projectId: string, milestoneId: string, data: ReleaseMilestonePaymentDto) => api.post(API_ENDPOINTS.milestones.releasePayment.replace(':projectId', projectId).replace(':milestoneId', milestoneId), data),
}