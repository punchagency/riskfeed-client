import type { CreatePropertyDto, GetPropertiesDto } from "@/interfaces/properties/dto/create-property.dto";
import API_ENDPOINTS from "../api_endpoints";
import api from "../client";
import type { UpdatePropertyDto } from "@/interfaces/properties/dto/update-property.dto";


export const PropertiesApi = {
    createProperties: (data: CreatePropertyDto) => api.post(API_ENDPOINTS.properties.createProperties, data),
    getProperties: (data: GetPropertiesDto) => api.get(API_ENDPOINTS.properties.getProperties, { params: { ...data}}),
    updatePropeties: (id: string, data: UpdatePropertyDto) => api.patch(API_ENDPOINTS.properties.updateProperties.replace(":id", id), data),
    deleteProperties: (id: string) => api.delete(API_ENDPOINTS.properties.deleteProperties.replace(":id", id)),
    getPropertyById: (id: string) => api.get(API_ENDPOINTS.properties.getPropertyById.replace(":id", id)),
    getPropertiesAnalytics: () => api.get(API_ENDPOINTS.properties.getPropertiesAnalytics),
}