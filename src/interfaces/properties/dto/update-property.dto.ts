import type { PROPERTIES_TYPES, PROPERTY_STATUS } from "../properties.interface";

interface AddressDto {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface UpdatePropertyDto {
    name?: string;
    propertyType?: typeof PROPERTIES_TYPES[number];
    status?: typeof PROPERTY_STATUS[number];
    address?: AddressDto;
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
    imagesToRemove?: string[];
}
