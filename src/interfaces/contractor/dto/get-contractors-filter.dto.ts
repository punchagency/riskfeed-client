import type { PROJECT_TYPES } from "@/interfaces/project/project.interface";

export interface GetContractorsFilterDto {
    search?: string;
    speciality?: typeof PROJECT_TYPES[number];
    location?: string;
    minRating?: number;
    maxRiskScore?: number;
    page?: number;
    limit?: number;
}
