import { MessagesApi } from "@/api/services/messages";
import type { ListConversationsDto } from "@/interfaces/message/dto/list-conversations.dto";
import HandleAPIError from "@/utils/HandleAPIError";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetConversations = (data: ListConversationsDto) => {
    return useQuery({
        queryFn: () => MessagesApi.getConversations(data),
        queryKey: ['conversations', data],
        select: (response) => response.data,
    })
}

export const useGetConversationsInfinite = (data: Omit<ListConversationsDto, 'page'>) => {
    return useInfiniteQuery({
        queryKey: ['conversations', 'infinite', data],
        queryFn: ({ pageParam = 1 }) => MessagesApi.getConversations({ ...data, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const responseData = lastPage.data;
            if (responseData.page < responseData.totalPages) {
                return responseData.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    })
}

export const useGetConversationById = (id: string | undefined) => {
    return useQuery({
        queryFn: () => MessagesApi.getConversationById(id!),
        queryKey: ['conversation', id],
        select: (response) => response.data,
        enabled: !!id,
    })
}

export const useUploadMessageAttachment = () => {
    return useMutation({
        mutationFn: MessagesApi.uploadMessageAttachment,
        onError: (error) => {
            HandleAPIError(error);
        },
    });
}

export const useCreateConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: MessagesApi.createConversation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            toast.success('Conversation created successfully');
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    });
}