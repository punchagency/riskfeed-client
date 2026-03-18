export interface SendMessageDto {
    conversationId: string;
    text: string;
    attachments?: string[];
}

export interface MarkAsReadDto {
    conversationId: string;
}

export interface TypingEventDto {
    conversationId: string;
}
