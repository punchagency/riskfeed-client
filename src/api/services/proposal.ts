import type { CreateProposalDto } from "@/interfaces/proposal/dto/create-proposal.dto";
import API_ENDPOINTS from "../api_endpoints";
import api from "../client";
import type { UpdateProposalDto } from "@/interfaces/proposal/dto/update-proposal.dto";
import type { GetJobsQueryDto, GetProposalsQueryDto } from "@/interfaces/proposal/dto/proposal-query.dto";

export const ProposalApi = {
    createProposal: (data: CreateProposalDto) => api.post(API_ENDPOINTS.proposals.createProposal, data),
    getProjectProposals: (projectId: string) => api.get(API_ENDPOINTS.proposals.getProjectProposals.replace(':projectId', projectId)),
    getContractorProposals: (contractorId: string) => api.get(API_ENDPOINTS.proposals.getContractorProposals.replace(':contractorId', contractorId)),
    getProposalById: (id: string) => api.get(API_ENDPOINTS.proposals.getProposalById.replace(':id', id)),
    updateProposal: (id: string, data: UpdateProposalDto) => api.patch(API_ENDPOINTS.proposals.updateProposal.replace(':id', id), data),
    acceptProposal: (id: string, data: { pin: string }) => api.patch(API_ENDPOINTS.proposals.acceptProposal.replace(':id', id), data),
    rejectProposal: (id: string) => api.patch(API_ENDPOINTS.proposals.rejectProposal.replace(':id', id)),
    withdrawProposal: (id: string) => api.delete(API_ENDPOINTS.proposals.withdawProposal.replace(':id', id)),
    getProposals: (data: GetProposalsQueryDto) => api.get(API_ENDPOINTS.proposals.getProposals, { params: { ...data }}),
    getJobs: (data: GetJobsQueryDto) => api.get(API_ENDPOINTS.proposals.getJobs, { params: { ...data }}),
    getJobStats: () => api.get(API_ENDPOINTS.proposals.getJobStats),
}