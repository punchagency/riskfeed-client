import { DisputesApi } from "@/api/services/disputes"
import type { RaiseMilestoneDisputeDto, ResolveDisputeDto, RespondToDisputeDto } from "@/interfaces/disputes/dto/dispute.dto"
import HandleAPIError from "@/utils/HandleAPIError"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useGetProjectDisputes = (projectId?: string) => {
    return useQuery({
        queryKey: ['project-disputes'],
        queryFn: () => DisputesApi.getProjectDisputes(projectId!),
        select: (response) => response.data,
        enabled: !!projectId
    })
}

export const useResolveDispute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({disputeId, data}: {disputeId: string, data: ResolveDisputeDto}) => DisputesApi.resolveDispute(disputeId, data),
        onSuccess: () => {
            toast.success("Dispute resolved successfully")
            queryClient.invalidateQueries({queryKey: ['project-disputes']})
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useRaiseDisputeForMilestone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({projectId, milestoneId, data}: {projectId: string, milestoneId: string, data: RaiseMilestoneDisputeDto}) => {
            // If files are uploaded, send as FormData
            if (data.disputeAttachments && data.disputeAttachments.length > 0) {
                const formData = new FormData();
                formData.append('reason', data.reason);
                formData.append('description', data.description);
                data.disputeAttachments.forEach((file) => {
                    formData.append('disputeAttachments', file);
                });
                return DisputesApi.raiseDisputeForMilestone(projectId, milestoneId, formData as unknown as RaiseMilestoneDisputeDto);
            }
            // Otherwise send as JSON
            return DisputesApi.raiseDisputeForMilestone(projectId, milestoneId, data);
        },
        onSuccess: (_, {projectId}) => {
            toast.success("Dispute raised successfully")
            queryClient.invalidateQueries({queryKey: ['project-disputes']})
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['escrow-payments']})
            queryClient.invalidateQueries({queryKey: ['escrow-payment-stats']})
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useRespondToDispute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({disputeId, data}: {disputeId: string, data: RespondToDisputeDto}) => {
            // If files are uploaded, send as FormData
            if (data.disputeAttachments && data.disputeAttachments.length > 0) {
                const formData = new FormData();
                formData.append('message', data.message);
                data.disputeAttachments.forEach((file) => {
                    formData.append('disputeAttachments', file);
                });
                return DisputesApi.respondToDispute(disputeId, formData as unknown as RespondToDisputeDto);
            }
            // Otherwise send as JSON
            return DisputesApi.respondToDispute(disputeId, data);
        },
        onSuccess: () => {
            toast.success("Dispute responded successfully")
            queryClient.invalidateQueries({queryKey: ['project-disputes']})
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}