import type { PROPERTIES_TYPES, PROPERTY_STATUS } from "../properties.interface";

interface AddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface CreatePropertyDto {
    name: string;
    propertyType: typeof PROPERTIES_TYPES[number];
    status?: typeof PROPERTY_STATUS[number];
    address: AddressDto;
    purchaseDate?: string;
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
    propertyImages?: File[]
}



export interface GetPropertiesDto {
    page: number;
    limit?: number;
    search?: string;
    status?: typeof PROPERTY_STATUS[number];
    propertyType?: typeof PROPERTIES_TYPES[number];
    lite?: boolean;
}