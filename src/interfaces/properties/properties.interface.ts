import type { IProject } from "../project/project.interface";

export const PROPERTIES_TYPES = ['single_family_home', 'townhouse', 'condominium', 'multi-family', 'investment_property', 'vacation_home', 'commercial_property', 'land/lot'] as const;
export const PROPERTY_STATUS = ['active', 'sold', 'archived', 'lease', 'rented'] as const;

export interface IProperties {
    user: string;
    name: string;
    propertyType: typeof PROPERTIES_TYPES[number];
    status: typeof PROPERTY_STATUS[number];
    projects?: Partial<IProject>[];
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    purchaseDate?: Date;
    purchasePrice?: number;
    estimatedValue?: number;
    currentEstimatedValue?: number;
    annualPropertyTax?: number;
    annualInsurance?: number;
    annualMaintenanceCosts?: number;
    squareFeet?: number;
    yearBuilt?: number;
    noOfBedrooms?: number;
    noOfBathrooms?: number;
    lotSize?: string;
    notes?: string;
    images?: string[];
}