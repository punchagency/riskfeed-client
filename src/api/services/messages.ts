import type { CreateConversationDto } from "@/interfaces/message/dto/create-conversation.dto";
import API_ENDPOINTS from "../api_endpoints";
import api from "../client";
import type { ListConversationsDto } from "@/interfaces/message/dto/list-conversations.dto";

export const MessagesApi = {
    createConversation: (data: CreateConversationDto) => api.post(API_ENDPOINTS.messages.createConversation, data),
    getConversations: (data: ListConversationsDto) => api.get(API_ENDPOINTS.messages.getConversations, { params: data }),
    getConversationById: (conversationId: string) => api.get(API_ENDPOINTS.messages.getConversationById.replace(':id', conversationId)),
    uploadMessageAttachment: (formData: FormData) => api.post(API_ENDPOINTS.messages.uploadMessageAttachment, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
}