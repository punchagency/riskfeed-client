import { ProposalApi } from "@/api/services/proposal";
import type { CreateProposalDto } from "@/interfaces/proposal/dto/create-proposal.dto";
import type { GetJobsQueryDto, GetProposalsQueryDto } from "@/interfaces/proposal/dto/proposal-query.dto";
import HandleAPIError from "@/utils/HandleAPIError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";



export const useCreateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProposalDto) => ProposalApi.createProposal(data),
        onSuccess: () => {
            toast.success('Proposal created successfully');
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    })
}

export const useUpdateProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateProposalDto }) => ProposalApi.updateProposal(id, data),
        onSuccess: () => {
            toast.success('Proposal updated successfully');
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    })
}

export const useAcceptProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ProposalApi.acceptProposal(id),
        onSuccess: () => {
            toast.success('Proposal accepted successfully');
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    })
}

export const useRejectProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ProposalApi.rejectProposal(id),
        onSuccess: () => {
            toast.success('Proposal rejected successfully');
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    })
}

export const useWithdrawProposal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ProposalApi.withdrawProposal(id),
        onSuccess: () => {
            toast.success('Proposal withdrawn successfully');
            queryClient.invalidateQueries({ queryKey: ['proposals'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    })
}

export const useGetProjectProposals = (projectId: string | undefined) => {
    return useQuery({
        queryKey: ['project-proposals', projectId],
        queryFn: () => ProposalApi.getProjectProposals(projectId!),
        enabled: !!projectId,
        select: (response) => response.data,
    })
}

export const useGetProposalById = (id: string | undefined) => {
    return useQuery({
        queryKey: ['proposal', id],
        queryFn: () => ProposalApi.getProposalById(id!),
        enabled: !!id,
        select: (response) => response.data,
    })
}

export const useGetProposals = (query: GetProposalsQueryDto) => {
    return useQuery({
        queryKey: ['proposals', query],
        queryFn: () => ProposalApi.getProposals(query),
        select: (response) => response.data,
    })
}

export const useGetContractorProposals = (contractorId: string | undefined) => {
    return useQuery({
        queryKey: ['contractor-proposals', contractorId],
        queryFn: () => ProposalApi.getContractorProposals(contractorId!),
        enabled: !!contractorId,
        select: (response) => response.data,
    })
}

export const useGetJobs = (query: GetJobsQueryDto) => {
    return useQuery({
        queryKey: ['jobs', query],
        queryFn: () => ProposalApi.getJobs(query),
        select: (response) => response.data,
    })
}

export const useGetJobStats = () => {
    return useQuery({
        queryKey: ['job-stats'],
        queryFn: () => ProposalApi.getJobStats(),
        select: (response) => response.data,
    })
}