import type { GetContractorsFilterDto } from "@/interfaces/contractor/dto/get-contractors-filter.dto";
import API_ENDPOINTS from "../api_endpoints";
import api from "../client";


export const ContractorApi = {
    getContractors: (data: GetContractorsFilterDto) => api.get(API_ENDPOINTS.contractor.getContractors, { params: { ...data } }),
    getContractorById: (id: string) => api.get(API_ENDPOINTS.contractor.getContractorById.replace(":id", id)),
}