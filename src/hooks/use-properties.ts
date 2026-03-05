import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import HandleAPIError from '@/utils/HandleAPIError';
import { PropertiesApi } from '@/api/services/properties';
import type { CreatePropertyDto, GetPropertiesDto } from '@/interfaces/properties/dto/create-property.dto';
import type { UpdatePropertyDto } from '@/interfaces/properties/dto/update-property.dto';

export const useCreateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePropertyDto) => PropertiesApi.createProperties(data),
        onSuccess: () => {
            toast.success('Property created successfully');
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    });
}

export const useUpdateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePropertyDto }) => PropertiesApi.updatePropeties(id, data),
        onSuccess: (_, variables) => {
            toast.success('Property updated successfully');
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    });
}

export const useProperties = (data: GetPropertiesDto) => {
    return useQuery({
        queryKey: ['properties', data],
        queryFn: () => PropertiesApi.getProperties(data),
        select: (response) => response.data,
    });
};

export const usePropertyById = (id: string) => {
    return useQuery({
        queryKey: ['properties', id],
        queryFn: () => PropertiesApi.getPropertyById(id),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useDeleteProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PropertiesApi.deleteProperties(id),
        onSuccess: (_, variables) => {
            toast.success("Property deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['properties', variables] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    })
}

export const usePropertiesAnalytics = () => {
    return useQuery({
        queryKey: ['properties-analytics'],
        queryFn: () => PropertiesApi.getPropertiesAnalytics(),
        select: (response) => response.data,
    });
}