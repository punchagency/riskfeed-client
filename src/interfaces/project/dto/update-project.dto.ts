import type { PROJECT_RISK_LEVELS, PROJECT_STATUSES, PROJECT_TYPES } from "../project.interface";

interface DurationRangeDto {
    minDays: number;
    maxDays: number;
}

export interface UpdateProjectDto {
    title?: string;
    description?: string;
    projectType?: typeof PROJECT_TYPES[number];
    propertyId?: string;
    minBudget?: number;
    maxBudget?: number;
    durationDays?: number;
    durationRange?: DurationRangeDto;
    startDate?: Date;
    status?: typeof PROJECT_STATUSES[number];
    riskLevel?: typeof PROJECT_RISK_LEVELS[number];
}
