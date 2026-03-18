import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { IConversation, IConversationParticipant } from '@/interfaces/message/conversation.interface';

type FilterTab = 'all' | 'client' | 'project';

interface ConversationListProps {
    conversations: IConversation[];
    isLoading: boolean;
    isFetchingNextPage?: boolean;
    hasMore?: boolean;
    selectedId: string | null;
    currentUserId: string;
    onlineUsers: Set<string>;
    onSelect: (conversation: IConversation) => void;
    onSearchChange: (search: string) => void;
    onLoadMore?: () => void;
}

const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return diffMins <= 1 ? 'Just now' : `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
};

const getOtherParticipant = (conversation: IConversation, currentUserId: string) => {
    return conversation.participants.find((p) => p._id !== currentUserId) ?? conversation.participants[0];
};

const getDisplayName = (participant: IConversationParticipant): string => {
    if (participant.role === 'contractor' && participant?.contractor?.companyName) {
        return participant?.contractor?.companyName;
    }
    return `${participant.firstName} ${participant.lastName}`;
};

const getAvatarUrl = (participant: IConversationParticipant) => {
    if (participant.role === 'contractor' && participant.contractor?.companyLogo) {
        return participant.contractor.companyLogo;
    }
    if (participant.profilePicture) {
        return participant.profilePicture;
    }
    return undefined;
};

const getAddress = (conversation: IConversation) => {
    const project = conversation.projects?.[0];
    if (!project?.property?.address) return null;
    const { street, city, state } = project.property.address;
    return [street, city, state].filter(Boolean).join(', ');
};

const ConversationSkeleton = () => (
    <div className="flex items-start gap-3 p-4 border-b border-border">
        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
        </div>
    </div>
);

const ConversationList = ({
    conversations,
    isLoading,
    isFetchingNextPage,
    hasMore,
    selectedId,
    currentUserId,
    onlineUsers,
    onSelect,
    onSearchChange,
    onLoadMore,
}: ConversationListProps) => {
    const [activeFilter] = useState<FilterTab>('all');
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        onSearchChange(value);
    };

    const filteredConversations = conversations.filter((conv) => {
        if (activeFilter === 'client') {
            return conv.participants.some((p) => p.role === 'user');
        }
        if (activeFilter === 'project') {
            return conv.projects.length > 0;
        }
        return true;
    });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 50) {
            if (hasMore && !isFetchingNextPage && onLoadMore) {
                onLoadMore();
            }
        }
    };

    return (
        <div className="flex flex-col h-full border-r border-border">
            {/* Search */}
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        className="pl-9 h-10 bg-muted/40"
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            {/* <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {(['all', 'client', 'project'] as FilterTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize',
                            activeFilter === tab
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                    >
                        {tab === 'all' ? 'All' : tab === 'client' ? 'By Client' : 'By Project'}
                    </button>
                ))}
            </div> */}

            {/* List */}
            <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <ConversationSkeleton key={i} />)
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 p-6 text-center">
                        <p className="text-sm font-medium text-muted-foreground">No conversations found</p>
                        <p className="text-xs text-muted-foreground">Start a new conversation by clicking "New Group Message"</p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => {
                        const other = getOtherParticipant(conversation, currentUserId);
                        const address = getAddress(conversation);
                        const projectName = conversation.projects?.[0]?.title;
                        const lastMsgText = conversation.lastMessage?.text ?? conversation.messages?.at(-1)?.text;
                        const lastMsgTime = conversation.lastMessage?.createdAt ?? conversation.updatedAt;
                        const unread = conversation.unreadCount ?? 0;
                        const isSelected = selectedId === conversation._id;
                        const isMultiParticipant = conversation.participants.length > 2;
                        const isOtherOnline = other ? onlineUsers.has(other._id) : false;

                        return (
                            <motion.button
                                key={conversation._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => onSelect(conversation)}
                                className={cn(
                                    'w-full flex items-start gap-3 p-4 border-b border-border text-left transition-colors',
                                    isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                                )}
                            >
                                {/* Avatar with online dot */}
                                <div className="relative shrink-0">
                                    {isMultiParticipant ? (
                                        <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center">
                                            <span className="text-xs font-semibold text-muted-foreground">
                                                {conversation.participants.length}
                                            </span>
                                        </div>
                                    ) : (
                                        <Avatar className="h-11 w-11">
                                            {other && (
                                                <AvatarImage src={getAvatarUrl(other)} alt={getDisplayName(other)} />
                                            )}
                                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                                                {other ? getInitials(other.firstName, other.lastName) : '??'}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    {/* Online status dot */}
                                    {!isMultiParticipant && isOtherOnline && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 animate-pulse border-2 border-card" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                        <span className={cn('font-semibold text-sm truncate', isSelected && 'text-primary')}>
                                            {isMultiParticipant
                                                ? `${other ? getDisplayName(other) : 'Unknown'} +${conversation.participants.length - 2} more`
                                                : other
                                                ? getDisplayName(other)
                                                : 'Unknown'}
                                        </span>
                                        {lastMsgTime && (
                                            <span className="text-[11px] text-muted-foreground shrink-0">
                                                {formatTime(lastMsgTime)}
                                            </span>
                                        )}
                                    </div>

                                    {address && (
                                        <p className="text-xs text-muted-foreground truncate mb-0.5">
                                            📍 {address}
                                        </p>
                                    )}

                                    {projectName && (
                                        <p className="text-xs font-medium text-primary truncate mb-1">{projectName}</p>
                                    )}

                                    <div className="flex items-center justify-between gap-2">
                                        {lastMsgText && (
                                            <p className="text-xs text-muted-foreground truncate flex-1">{lastMsgText}</p>
                                        )}
                                        {unread > 0 && (
                                            <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-primary text-primary-foreground shrink-0">
                                                {unread}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })
                )}
                {isFetchingNextPage && (
                    <div className="p-4 flex justify-center">
                        <Skeleton className="h-4 w-4 rounded-full animate-bounce" />
                        <Skeleton className="h-4 w-4 rounded-full animate-bounce ml-2" style={{ animationDelay: '0.2s' }} />
                        <Skeleton className="h-4 w-4 rounded-full animate-bounce ml-2" style={{ animationDelay: '0.4s' }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
