import api from "../client";
import API_ENDPOINTS from "../api_endpoints";
import type { CreateProjectDto } from "@/interfaces/project/dto/create-project.dto";
import type { UpdateProjectDto } from "@/interfaces/project/dto/update-project.dto";
import { PROJECT_RISK_LEVELS, PROJECT_STATUSES } from "@/interfaces/project/project.interface";

export const ProjectApi = {
    createProject: (data: CreateProjectDto) => api.post(API_ENDPOINTS.project.createProject, data),
    updateProject: (id: string, data: UpdateProjectDto) => api.patch(API_ENDPOINTS.project.updateProject.replace(":id", id), data),
    getProjects: (data: { page: number, limit?: number, search?: string, riskLevel?: typeof PROJECT_RISK_LEVELS[number],  status?: typeof PROJECT_STATUSES[number], minBudget?: number, maxBudget?: number }) => api.get(API_ENDPOINTS.project.getProjects, { params: { ...data } }),
    getProjectById: (id: string) => api.get(API_ENDPOINTS.project.getProjectById.replace(":id", id)),
    suggestContractors: (id: string) => api.get(API_ENDPOINTS.project.suggestContractors.replace(":id", id))
};