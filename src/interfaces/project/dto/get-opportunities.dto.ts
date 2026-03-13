import type { PROPERTIES_TYPES } from "@/interfaces/properties/properties.interface";
import type { PROJECT_TYPES } from "../project.interface";

export interface GetOpportunitiesDto {
  page?: number;
  limit?: number;
  minMatchPercentage?: number;
  maxMatchPercentage?: number;
  propertyState?: string;
  propertyType?: typeof PROPERTIES_TYPES[number];
  projectType?: typeof PROJECT_TYPES[number];
}
