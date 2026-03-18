import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useGetConversationsInfinite } from '@/hooks/use-message';
import { useMessageSocket } from '@/hooks/use-message-socket';
import { useSocket } from '@/context/socket-context';
import { useAppSelector } from '@/store/hooks';
import { useQueryClient } from '@tanstack/react-query';
import type { IConversation, IConversationMessage } from '@/interfaces/message/conversation.interface';
import { cn } from '@/lib/utils';
import ConversationList from '@/pages/user/messages/components/ConversationList';
import MessageThread from '@/pages/user/messages/components/MessageThread';

const EmptyThreadState = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full gap-4 text-center p-10"
    >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageSquarePlus className="h-8 w-8 text-primary" />
        </div>
        <div>
            <p className="font-semibold text-lg">Select a conversation</p>
            <p className="text-sm text-muted-foreground mt-1">
                Choose a conversation from the left to view messages.
            </p>
        </div>
    </motion.div>
);

const Messages: React.FC = () => {
    const currentUser = useAppSelector((state) => state.user.user);
    const currentUserId = currentUser?.user?._id ?? '';
    const currentUserRole = currentUser?.user?.role ?? 'contractor';

    const queryClient = useQueryClient();

    const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
    const [search, setSearch] = useState('');
    const [socketMessages, setSocketMessages] = useState<Record<string, IConversationMessage[]>>({});
    const [typingUsers, setTypingUsers] = useState<Record<string, { userId: string; userName: string }[]>>({});

    // Online users from global socket context
    const { onlineUsers, seedOnlineUsers } = useSocket();

    const conversationsQuery = useGetConversationsInfinite({ limit: 20, search: search || undefined });
    const conversations = useMemo<IConversation[]>(() => {
        return conversationsQuery.data?.pages.flatMap((page) => page.data.items) ?? [];
    }, [conversationsQuery.data]);

    useEffect(() => {
        const onlineIds = conversations
            .flatMap((c) => c.participants)
            .filter((p) => p.isOnline)
            .map((p) => p._id);
        seedOnlineUsers(onlineIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationsQuery.dataUpdatedAt]);

    // Keep selectedConversation in sync with the updated conversation list
    useEffect(() => {
        if (selectedConversation) {
            const updated = conversations.find(c => c._id === selectedConversation._id);
            if (updated && updated.messages.length !== selectedConversation.messages.length) {
                setSelectedConversation(updated);
            }
        }
    }, [conversations, selectedConversation]);

    const handleNewMessage = useCallback((conversationId: string, message: IConversationMessage) => {
        setSocketMessages((prev) => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] ?? []), message],
        }));
        // Keep conversation list and individual conversation cache fresh
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    }, [queryClient]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMessageRead = useCallback((_conversationId: string, _userId: string) => {
        // read receipts — no-op for now
    }, []);

    const handleTypingStart = useCallback((conversationId: string, userId: string, userName: string) => {
        setTypingUsers((prev) => {
            const existing = prev[conversationId] ?? [];
            if (existing.find((u) => u.userId === userId)) return prev;
            return { ...prev, [conversationId]: [...existing, { userId, userName }] };
        });
    }, []);

    const handleTypingStop = useCallback((conversationId: string, userId: string) => {
        setTypingUsers((prev) => ({
            ...prev,
            [conversationId]: (prev[conversationId] ?? []).filter((u) => u.userId !== userId),
        }));
    }, []);

    const { sendMessage, markAsRead, startTyping, stopTyping } = useMessageSocket({
        onNewMessage: handleNewMessage,
        onMessageRead: handleMessageRead,
        onTypingStart: handleTypingStart,
        onTypingStop: handleTypingStop,
    });

    const handleSelectConversation = (conversation: IConversation) => {
        setSelectedConversation(conversation);
        // Clear stale socket messages so the fresh API fetch is the source of truth
        setSocketMessages((prev) => ({ ...prev, [conversation._id]: [] }));
    };

    const activeSocketMessages = selectedConversation
        ? (socketMessages[selectedConversation._id] ?? [])
        : [];

    const activeTypingUsers = selectedConversation
        ? (typingUsers[selectedConversation._id] ?? []).filter((u) => u.userId !== currentUserId)
        : [];

    return (
        <>
            <PageHeader
                title="Messages"
                description="Communicate with your clients"
            />

            <div className="flex h-[calc(100vh-221px)] rounded-xl border border-border overflow-hidden bg-card">
                {/* Left: Conversation List */}
                <div className={cn("shrink-0 border-r border-border", selectedConversation ? "hidden md:block md:w-85" : "w-full md:w-85")}>
                    <ConversationList
                        conversations={conversations}
                        isLoading={conversationsQuery.isLoading}
                        isFetchingNextPage={conversationsQuery.isFetchingNextPage}
                        hasMore={conversationsQuery.hasNextPage}
                        selectedId={selectedConversation?._id ?? null}
                        currentUserId={currentUserId}
                        onlineUsers={onlineUsers}
                        onSelect={handleSelectConversation}
                        onSearchChange={setSearch}
                        onLoadMore={() => {
                            if (conversationsQuery.hasNextPage && !conversationsQuery.isFetchingNextPage) {
                                conversationsQuery.fetchNextPage();
                            }
                        }}
                    />
                </div>

                {/* Right: Message Thread or Empty State */}
                <div className={cn("flex-1 min-w-0 bg-card", !selectedConversation ? "hidden md:block" : "block")}>
                    <AnimatePresence mode="wait">
                        {selectedConversation ? (
                            <motion.div
                                key={selectedConversation._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                            >
                                <MessageThread
                                    conversation={selectedConversation}
                                    currentUserId={currentUserId}
                                    currentUserRole={currentUserRole}
                                    newSocketMessages={activeSocketMessages}
                                    typingUsers={activeTypingUsers}
                                    onlineUsers={onlineUsers}
                                    onSendMessage={sendMessage}
                                    onMarkAsRead={markAsRead}
                                    onStartTyping={startTyping}
                                    onStopTyping={stopTyping}
                                    onClose={() => setSelectedConversation(null)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                            >
                                <EmptyThreadState />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default Messages;
