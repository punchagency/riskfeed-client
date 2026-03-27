import { MilestonesApi } from "@/api/services/milestones"
import type { ReleaseMilestonePaymentDto, RequestMilestonePaymentDto } from "@/interfaces/project/dto/milestone-actions.dto"
import HandleAPIError from "@/utils/HandleAPIError"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useStartMilestone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({projectId, milestoneId}: {projectId: string, milestoneId: string}) => MilestonesApi.startMilestone(projectId, milestoneId),
        onSuccess: (_, {projectId}) => {
            toast.success("Milestone started successfully")
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['escrow-payments']})
            queryClient.invalidateQueries({queryKey: ['escrow-payment-stats']})
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useRequestPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({projectId, milestoneId, data}: {projectId: string, milestoneId: string, data: RequestMilestonePaymentDto}) => MilestonesApi.requestPayment(projectId, milestoneId, data),
        onSuccess: (_, {projectId}) => {
            toast.success("Payment requested successfully")
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['escrow-payments']})
            queryClient.invalidateQueries({queryKey: ['escrow-payment-stats']})
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useReleasePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({projectId, milestoneId, data}: {projectId: string, milestoneId: string, data: ReleaseMilestonePaymentDto}) => MilestonesApi.releasePayment(projectId, milestoneId, data),
        onSuccess: (_, {projectId}) => {
            toast.success("Payment released successfully")
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['escrow-payments']})
            queryClient.invalidateQueries({queryKey: ['escrow-payment-stats']})
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}