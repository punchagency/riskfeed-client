import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useGetConversationById } from '@/hooks/use-message';
import { useUploadMessageAttachment } from '@/hooks/use-message';
import { toast } from 'sonner';
import type { IConversation, IConversationMessage, IConversationParticipant } from '@/interfaces/message/conversation.interface';
import { formatDistanceToNow } from 'date-fns';
import { MessageAttachment, PendingAttachment } from './MessageAttachment';

interface MessageThreadProps {
    conversation: IConversation;
    currentUserId: string;
    /** Role of the currently authenticated user */
    currentUserRole: string;
    newSocketMessages: IConversationMessage[];
    typingUsers: { userId: string; userName: string }[];
    /** Set of online user IDs */
    onlineUsers: Set<string>;
    onSendMessage: (conversationId: string, text: string, attachments: string[]) => void;
    onMarkAsRead: (conversationId: string) => void;
    onStartTyping: (conversationId: string) => void;
    onStopTyping: (conversationId: string) => void;
    onClose?: () => void;
}

const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

const shouldShowDateSeparator = (current: IConversationMessage, previous: IConversationMessage | undefined) => {
    if (!previous) return true;
    const currentDate = new Date(current.createdAt).toDateString();
    const prevDate = new Date(previous.createdAt).toDateString();
    return currentDate !== prevDate;
};

const getParticipantDisplayName = (participant: IConversationParticipant): string => {
    if (participant.role === 'contractor' && participant?.contractor?.companyName) {
        return participant?.contractor?.companyName;
    }
    return `${participant.firstName} ${participant.lastName}`;
};

const MessageSkeleton = () => (
    <div className="flex flex-col gap-4 p-6">
        {[...Array(3)].map((_, i) => (
            <div key={i} className={cn('flex gap-3', i % 2 === 1 && 'flex-row-reverse')}>
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className={cn('space-y-1', i % 2 === 1 && 'items-end flex flex-col')}>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className={cn('h-12 rounded-2xl', i === 0 ? 'w-64' : i === 1 ? 'w-80' : 'w-56')} />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>
        ))}
    </div>
);

const TYPING_DEBOUNCE_MS = 1500;

const MessageThread = ({
    conversation,
    currentUserId,
    newSocketMessages,
    typingUsers,
    onlineUsers,
    onSendMessage,
    onMarkAsRead,
    onStartTyping,
    onStopTyping,
    onClose,
}: MessageThreadProps) => {
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: conversationData, isLoading } = useGetConversationById(conversation._id);
    const uploadMutation = useUploadMessageAttachment();

    // Merge API messages + socket messages, deduplicated by _id
    const activeData = conversationData?.data || conversationData;
    const apiMessages: IConversationMessage[] = activeData?.messages ?? conversation.messages ?? [];

    const allMessages = [...apiMessages, ...newSocketMessages].reduce<IConversationMessage[]>((acc, msg) => {
        if (!acc.find((m) => m._id === msg._id)) acc.push(msg);
        return acc;
    }, []).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const otherParticipants = conversation.participants.filter((p) => p._id !== currentUserId);
    const primaryParticipant = otherParticipants[0];
    const projectName = conversation.projects?.[0]?.title;
    const address = conversation.projects[0]?.property?.address;
    const addressText = address ? `${address.street}, ${address.city}, ${address.state}` : null;

    // Derive header display name based on who the current user is
    const headerDisplayName = primaryParticipant ? getParticipantDisplayName(primaryParticipant) : 'Conversation';
    const getAvatarUrl = (participant: IConversationParticipant) => {
    if (participant.role === 'contractor' && participant.contractor?.companyLogo) {
        return participant.contractor.companyLogo;
    }
    if (participant.profilePicture) {
        return participant.profilePicture;
    }
    return undefined;
};
    // Online status for the primary other participant
    const isPrimaryOnline = primaryParticipant ? onlineUsers.has(primaryParticipant._id) : false;

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages]);

    // Mark as read when conversation opens
    useEffect(() => {
        onMarkAsRead(conversation._id);
    }, [conversation._id, onMarkAsRead]);

    const handleTyping = useCallback(() => {
        if (!isTyping) {
            setIsTyping(true);
            onStartTyping(conversation._id);
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onStopTyping(conversation._id);
        }, TYPING_DEBOUNCE_MS);
    }, [isTyping, conversation._id, onStartTyping, onStopTyping]);

    const handleTextChange = (value: string) => {
        setText(value);
        if (value.trim()) handleTyping();
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed && attachments.length === 0) return;
        onSendMessage(conversation._id, trimmed, attachments);
        setText('');
        setAttachments([]);
        if (isTyping) {
            setIsTyping(false);
            onStopTyping(conversation._id);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('messageAttachments', file));

        uploadMutation.mutate(formData, {
            onSuccess: (response) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const urls: string[] = (response.data as any)?.data?.attachments ?? [];
                setAttachments((prev) => [...prev, ...urls]);
                toast.success('Attachments uploaded');
            },
        });

        e.target.value = '';
    };

    const removeAttachment = (url: string) => {
        setAttachments((prev) => prev.filter((a) => a !== url));
    };

    /** Name to show in the message bubble author label */
    const getParticipantName = (authorId: string) => {
        const participant = conversation.participants.find((p) => p._id === authorId);
        if (!participant) return 'Unknown';
        return getParticipantDisplayName(participant);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                    {onClose && (
                        <button 
                            onClick={onClose} 
                            className="md:hidden mr-1 shrink-0 p-1.5 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                            aria-label="Back to conversations"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    <div className="relative shrink-0">
                        <Avatar className="h-10 w-10">
                            {primaryParticipant && (
                                <AvatarImage src={getAvatarUrl(primaryParticipant)} />
                            )}
                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                                {primaryParticipant
                                    ? getInitials(primaryParticipant.firstName, primaryParticipant.lastName)
                                    : '??'}
                            </AvatarFallback>
                        </Avatar>
                        {/* Online indicator dot on the header avatar */}
                        {primaryParticipant && isPrimaryOnline && (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm leading-tight">
                            {headerDisplayName}
                            {otherParticipants.length > 1 && (
                                <span className="text-muted-foreground font-normal">
                                    {' '}+{otherParticipants.length - 1} more
                                </span>
                            )}
                        </p>

                        {/* Online / Last seen status */}
                        {!primaryParticipant.isOnline && primaryParticipant?.lastSeen && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className='text-xs text-muted-foreground'>{formatDistanceToNow(new Date(primaryParticipant?.lastSeen))}</span>
                            </div>
                        )}

                        {addressText && (
                            <p className="text-xs text-muted-foreground max-w-[300px] truncate">📍 {addressText}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {projectName && (
                        <Badge variant="secondary" className="text-xs font-medium">
                            {projectName}
                        </Badge>
                    )}
                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button> */}
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-1">
                {isLoading ? (
                    <MessageSkeleton />
                ) : allMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center pt-10">
                        <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {allMessages.map((msg, index) => {
                            const isOwn = msg.author === currentUserId;
                            const prevMsg = allMessages[index - 1];
                            const showSeparator = shouldShowDateSeparator(msg, prevMsg);
                            const showAuthorLabel =
                                !isOwn &&
                                (index === 0 || prevMsg?.author !== msg.author || showSeparator);

                            return (
                                <div key={msg._id}>
                                    {/* Date Separator */}
                                    {showSeparator && (
                                        <div className="flex items-center gap-3 my-4">
                                            <div className="flex-1 h-px bg-border" />
                                            <span className="text-xs text-muted-foreground font-medium px-2">
                                                {formatDateSeparator(msg.createdAt)}
                                            </span>
                                            <div className="flex-1 h-px bg-border" />
                                        </div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn('flex gap-2 mb-1', isOwn ? 'flex-row-reverse' : 'flex-row')}
                                    >
                                        {/* Avatar — only for others */}
                                        {!isOwn && (
                                            <Avatar className="h-7 w-7 shrink-0 mt-1">
                                                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                                                    {(() => {
                                                        const p = conversation.participants.find((p) => p._id === msg.author);
                                                        return p ? getInitials(p.firstName, p.lastName) : '??';
                                                    })()}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className={cn('max-w-[70%] flex flex-col gap-0.5', isOwn && 'items-end')}>
                                            {showAuthorLabel && (
                                                <span className="text-[11px] text-muted-foreground px-1">
                                                    {getParticipantName(msg.author)}
                                                </span>
                                            )}

                                            {/* Attachments */}
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className={cn('flex flex-wrap gap-2', isOwn && 'justify-end')}>
                                                    {msg.attachments.map((url, i) => (
                                                        <MessageAttachment key={i} url={url} />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Bubble */}
                                            {msg.text && (
                                                <div
                                                    className={cn(
                                                        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                                                        isOwn
                                                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                            : 'bg-muted text-foreground rounded-tl-sm'
                                                    )}
                                                >
                                                    {msg.text}
                                                </div>
                                            )}

                                            <span className="text-[10px] text-muted-foreground px-1">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </AnimatePresence>
                )}

                {/* Typing Indicator */}
                <AnimatePresence>
                    {typingUsers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="flex items-center gap-2 mt-2"
                        >
                            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {typingUsers.map((u) => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-border bg-card">
                {/* Pending Attachments */}
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                        {attachments.map((url, i) => (
                            <PendingAttachment key={i} url={url} onRemove={() => removeAttachment(url)} />
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-3">
                    {/* Attachment Button */}
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.mp4,.mp3"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadMutation.isPending}
                        >
                            {uploadMutation.isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Paperclip className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {/* Text Input */}
                    <Textarea
                        placeholder="Type your message..."
                        className="min-h-10 max-h-32 resize-none flex-1 py-2.5 text-sm"
                        rows={2.8}
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    {/* Send Button */}
                    <Button
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={handleSend}
                        disabled={!text.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MessageThread;
