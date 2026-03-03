import type { PROJECT_MILESTONES_STATUSES, PROJECT_STATUSES } from "../project.interface";

interface AddressDto {
    street: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
}

interface PropertyDto {
    type: string;
    name?: string;
    address: AddressDto;
    ownershipType?: string;
    sizeSqFt?: number;
    ownerName?: string;
}

interface MilestoneDto {
    name: string;
    percentage: number;
    amount: number;
    sequence: number;
    status?: typeof PROJECT_MILESTONES_STATUSES[number];
}

interface DurationRangeDto {
    minDays: number;
    maxDays: number;
}

export interface UpdateProjectDto {
    title?: string;
    description?: string;
    property?: PropertyDto;
    minBudget?: number;
    maxBudget?: number;
    durationDays?: number;
    durationRange?: DurationRangeDto;
    startDate?: string;
    status?: typeof PROJECT_STATUSES[number];
    milestones?: MilestoneDto[];
}
