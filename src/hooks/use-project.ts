import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ProjectApi } from '@/api/services/project';
import APIErrorResponse from '@/utils/HandleAPIError';
import type { PROJECT_RISK_LEVELS, PROJECT_STATUSES } from '@/interfaces/project/project.interface';
import type { CreateProjectDto } from '@/interfaces/project/dto/create-project.dto';
import type { UpdateProjectDto } from '@/interfaces/project/dto/update-project.dto';
import type { InviteContractorDto } from '@/interfaces/project/dto/invite-contractor.dto';

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProjectDto) => ProjectApi.createProject(data),
        onSuccess: () => {
            toast.success('Project created successfully');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) => ProjectApi.updateProject(id, data),
        onSuccess: (_, variables) => {
            toast.success('Project updated successfully');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useProjects = (data: { page: number; limit?: number; search?: string; riskLevel?: typeof PROJECT_RISK_LEVELS[number]; status?: typeof PROJECT_STATUSES[number]; minBudget?: number; maxBudget?: number }) => {
    return useQuery({
        queryKey: ['projects', data],
        queryFn: () => ProjectApi.getProjects(data),
        select: (response) => response.data,
    });
};

export const useProjectById = (id: string) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: () => ProjectApi.getProjectById(id),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useSuggestContractors = (id: string) => {
    return useQuery({
        queryKey: ['suggested-contractors', id],
        queryFn: () => ProjectApi.suggestContractors(id),
        select: (responose) => responose.data,
        enabled: !!id 
    })
}

export const useInviteContractor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: InviteContractorDto }) => ProjectApi.inviteContractor(id, data),
        onSuccess: (_, variables) => {
            toast.success('Contractor invited successfully');
            queryClient.invalidateQueries({ queryKey: ['suggested-contractors', variables.id] });
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
}