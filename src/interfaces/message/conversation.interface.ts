import type { IContractor } from "../user/user.interface";

export interface IConversationParticipant {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    role: string;
    isOnline: boolean;
    lastSeen?: Date;
    contractor?: IContractor;
}

export interface IConversationProject {
    _id: string;
    title: string;
    property?: {
        address?: {
            street: string;
            city: string;
            state: string;
        };
    };
}

export interface IConversationMessage {
    _id: string;
    text: string;
    attachments?: string[];
    author: string;
    readBy: string[];
    createdAt: string;
}

export interface IConversation {
    _id: string;
    participants: IConversationParticipant[];
    projects: IConversationProject[];
    messages: IConversationMessage[];
    lastMessage?: IConversationMessage;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface IConversationsResponse {
    items: IConversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
