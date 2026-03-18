import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Session from '@/utils/Session';
import type { IConversationMessage } from '@/interfaces/message/conversation.interface';

const SOCKET_URL = import.meta.env.VITE_API_URL || '';
const MESSAGES_ROUTE_PREFIX = '/messages';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NewMessageListener = (conversationId: string, message: IConversationMessage) => void;
type MessageReadListener = (conversationId: string, userId: string) => void;
type TypingListener = (conversationId: string, userId: string, userName: string) => void;
type TypingStopListener = (conversationId: string, userId: string) => void;

interface SocketContextValue {
    /** Set of user IDs currently online */
    onlineUsers: Set<string>;


    seedOnlineUsers: (userIds: string[]) => void;

    /** Register/unregister local listeners (used by the messages pages) */
    addNewMessageListener: (fn: NewMessageListener) => void;
    removeNewMessageListener: (fn: NewMessageListener) => void;
    addMessageReadListener: (fn: MessageReadListener) => void;
    removeMessageReadListener: (fn: MessageReadListener) => void;
    addTypingStartListener: (fn: TypingListener) => void;
    removeTypingStartListener: (fn: TypingListener) => void;
    addTypingStopListener: (fn: TypingStopListener) => void;
    removeTypingStopListener: (fn: TypingStopListener) => void;

    /** Emit helpers */
    sendMessage: (conversationId: string, text: string, attachments?: string[]) => void;
    markAsRead: (conversationId: string) => void;
    startTyping: (conversationId: string) => void;
    stopTyping: (conversationId: string) => void;

    isConnected: () => boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SocketContext = createContext<SocketContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const socketRef = useRef<Socket | null>(null);

    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    // Listener sets — use refs so we can add/remove without re-creating the socket
    const newMessageListeners = useRef<Set<NewMessageListener>>(new Set());
    const messageReadListeners = useRef<Set<MessageReadListener>>(new Set());
    const typingStartListeners = useRef<Set<TypingListener>>(new Set());
    const typingStopListeners = useRef<Set<TypingStopListener>>(new Set());

    // Keep location in a ref so the toast handler doesn't go stale
    const locationRef = useRef(location);
    useEffect(() => { locationRef.current = location; }, [location]);

    useEffect(() => {
        const token = Session.getCookie('token');

        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 10000,
        });

        socketRef.current = socket;

        // ── message:new ──────────────────────────────────────────────────────
        socket.on('message:new', ({ conversationId, message }: { conversationId: string; message: IConversationMessage }) => {
            // Forward to any registered listeners (messages pages)
            newMessageListeners.current.forEach((fn) => fn(conversationId, message));

            // Show a toast only when user is NOT on the messages page
            const isOnMessagesPage = locationRef.current.pathname.startsWith(MESSAGES_ROUTE_PREFIX);
            if (!isOnMessagesPage) {
                const preview = message.text
                    ? message.text.length > 60
                        ? `${message.text.slice(0, 60)}…`
                        : message.text
                    : '📎 Attachment';
                toast.info('New message', {
                    description: preview,
                    duration: 5000,
                });
            }
        });

        // ── message:read ─────────────────────────────────────────────────────
        socket.on('message:read', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
            messageReadListeners.current.forEach((fn) => fn(conversationId, userId));
        });

        // ── typing ───────────────────────────────────────────────────────────
        socket.on('typing:start', ({ conversationId, userId, userName }: { conversationId: string; userId: string; userName: string }) => {
            typingStartListeners.current.forEach((fn) => fn(conversationId, userId, userName));
        });

        socket.on('typing:stop', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
            typingStopListeners.current.forEach((fn) => fn(conversationId, userId));
        });

        // ── presence ─────────────────────────────────────────────────────────
        socket.on('user:online', ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => new Set([...prev, userId]));
        });

        socket.on('user:offline', ({ userId }: { userId: string }) => {
            setOnlineUsers((prev) => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []); // Mount once — token is stable for the session lifetime

    // ── Listener registration ────────────────────────────────────────────────
    const addNewMessageListener = useCallback((fn: NewMessageListener) => {
        newMessageListeners.current.add(fn);
    }, []);
    const removeNewMessageListener = useCallback((fn: NewMessageListener) => {
        newMessageListeners.current.delete(fn);
    }, []);

    const addMessageReadListener = useCallback((fn: MessageReadListener) => {
        messageReadListeners.current.add(fn);
    }, []);
    const removeMessageReadListener = useCallback((fn: MessageReadListener) => {
        messageReadListeners.current.delete(fn);
    }, []);

    const addTypingStartListener = useCallback((fn: TypingListener) => {
        typingStartListeners.current.add(fn);
    }, []);
    const removeTypingStartListener = useCallback((fn: TypingListener) => {
        typingStartListeners.current.delete(fn);
    }, []);

    const addTypingStopListener = useCallback((fn: TypingStopListener) => {
        typingStopListeners.current.add(fn);
    }, []);
    const removeTypingStopListener = useCallback((fn: TypingStopListener) => {
        typingStopListeners.current.delete(fn);
    }, []);

    // ── Emit helpers ─────────────────────────────────────────────────────────
    const sendMessage = useCallback((conversationId: string, text: string, attachments: string[] = []) => {
        socketRef.current?.emit('message:send', { conversationId, text, attachments });
    }, []);

    const markAsRead = useCallback((conversationId: string) => {
        socketRef.current?.emit('message:read', { conversationId });
    }, []);

    const startTyping = useCallback((conversationId: string) => {
        socketRef.current?.emit('typing:start', { conversationId });
    }, []);

    const stopTyping = useCallback((conversationId: string) => {
        socketRef.current?.emit('typing:stop', { conversationId });
    }, []);

    const isConnected = useCallback(() => socketRef.current?.connected ?? false, []);

    const seedOnlineUsers = useCallback((userIds: string[]) => {
        if (userIds.length === 0) return;
        setOnlineUsers((prev) => {
            const next = new Set(prev);
            userIds.forEach((id) => next.add(id));
            return next;
        });
    }, []);

    return (
        <SocketContext.Provider
            value={{
                onlineUsers,
                seedOnlineUsers,
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
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): SocketContextValue => {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return ctx;
};
