import { ContractorApi } from "@/api/services/contractor";
import type { GetContractorsFilterDto } from "@/interfaces/contractor/dto/get-contractors-filter.dto";
import { useQuery } from "@tanstack/react-query";


export const useGetContractors = (data: GetContractorsFilterDto) => {
    return useQuery({
        queryFn: () => ContractorApi.getContractors(data),
        queryKey: ["contractors", data],
        select: (response) => response.data,
    })
}

export const useGetContractorById = (id: string) => {
    return useQuery({
        queryKey: ["contractor", id],
        queryFn: () => ContractorApi.getContractorById(id),
        select: (response) => response.data,
        enabled: !!id
    });
}