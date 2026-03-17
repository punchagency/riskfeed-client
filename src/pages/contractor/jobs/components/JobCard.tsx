import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Calendar, Clock, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { IJob } from '@/interfaces/proposal/proposal.interface';
import { getStatusColor } from '@/constants/status-styles';

interface JobCardProps {
    job: IJob;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

const formatDate = (date?: Date | string) => {
    if (!date) return 'TBD';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
};

const getJobStatusLabel = (status: string) => {
    switch (status) {
        case 'active': return 'Active';
        case 'pending': return 'Pending';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
    const homeowner =
        typeof job.project.homeowner === 'string'
            ? 'Homeowner'
            : `${job.project.homeowner?.firstName ?? ''} ${job.project.homeowner?.lastName ?? ''}`.trim() || 'Homeowner';

    const city = job.project.property?.address?.city ?? 'N/A';
    const state = job.project.property?.address?.state ?? 'N/A';
    const isActive = job.status === 'active';
    const dateLabel = isActive ? 'Due' : 'Starts';
    const dateValue = isActive ? job.estimatedEndDate : job.estimatedStartDate;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 transition-all my-4"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground leading-snug truncate">
                        {job.project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{homeowner}</p>
                </div>
                <Badge
                    variant="outline"
                    className={cn('shrink-0 text-xs border', getStatusColor(job.status))}
                >
                    {getJobStatusLabel(job.status)}
                </Badge>
            </div>

            {/* Info Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0" />
                    <span>{city}, {state}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <DollarSign className="size-4 shrink-0" />
                    <span>{formatCurrency(job.estimatedAmount)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {isActive
                        ? <Calendar className="size-4 shrink-0" />
                        : <Clock className="size-4 shrink-0" />
                    }
                    <span>{dateLabel} {formatDate(dateValue)}</span>
                </div>
            </div>

            {/* Progress Bar */}
            {job.progress !== undefined && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{job.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${job.progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
                <Button size="sm">
                    <Eye className="size-4" />
                    View Details
                </Button>
                <Button size="sm" variant="outline">
                    <MessageSquare className="size-4" />
                    Contact Client
                </Button>
            </div>
        </motion.div>
    );
};

export const JobCardSkeleton: React.FC = () => (
    <div className="bg-card rounded-xl p-5 border border-border my-4">
        <div className="flex items-start justify-between gap-3 mb-1">
            <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-3/4 mb-1.5" />
                <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-3 mt-4">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-32" />
        </div>
    </div>
);
