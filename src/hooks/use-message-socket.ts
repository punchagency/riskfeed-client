import { useEffect } from 'react';
import { useSocket } from '@/context/socket-context';
import type { IConversationMessage } from '@/interfaces/message/conversation.interface';

interface UseMessageSocketOptions {
    onNewMessage: (conversationId: string, message: IConversationMessage) => void;
    onMessageRead: (conversationId: string, userId: string) => void;
    onTypingStart: (conversationId: string, userId: string, userName: string) => void;
    onTypingStop: (conversationId: string, userId: string) => void;
}

/**
 * Registers per-page listeners on the global singleton socket.
 * Returns the same emit helpers so existing call sites remain unchanged.
 */
export const useMessageSocket = ({
    onNewMessage,
    onMessageRead,
    onTypingStart,
    onTypingStop,
}: UseMessageSocketOptions) => {
    const {
        addNewMessageListener,
        removeNewMessageListener,
        addMessageReadListener,
        removeMessageReadListener,
        addTypingStartListener,
        removeTypingStartListener,
        addTypingStopListener,
        removeTypingStopListener,
        sendMessage,
        markAsRead,
        startTyping,
        stopTyping,
        isConnected,
    } = useSocket();

    useEffect(() => {
        addNewMessageListener(onNewMessage);
        return () => removeNewMessageListener(onNewMessage);
    }, [addNewMessageListener, removeNewMessageListener, onNewMessage]);

    useEffect(() => {
        addMessageReadListener(onMessageRead);
        return () => removeMessageReadListener(onMessageRead);
    }, [addMessageReadListener, removeMessageReadListener, onMessageRead]);

    useEffect(() => {
        addTypingStartListener(onTypingStart);
        return () => removeTypingStartListener(onTypingStart);
    }, [addTypingStartListener, removeTypingStartListener, onTypingStart]);

    useEffect(() => {
        addTypingStopListener(onTypingStop);
        return () => removeTypingStopListener(onTypingStop);
    }, [addTypingStopListener, removeTypingStopListener, onTypingStop]);

    return { sendMessage, markAsRead, startTyping, stopTyping, isConnected };
};
