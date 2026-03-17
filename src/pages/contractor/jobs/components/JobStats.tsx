import { BriefcaseBusiness, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface IJobStats {
    activeJobsCount: number;
    completedJobsCount: number;
    pendingProposalsCount: number;
    totalValue: number;
}

interface JobStatsProps {
    data?: IJobStats;
    isLoading?: boolean;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

const STATS = (data: IJobStats) => [
    {
        label: 'Active Jobs',
        value: data.activeJobsCount,
        sub: data.activeJobsCount === 1 ? 'job in progress' : 'jobs in progress',
        icon: BriefcaseBusiness,
        iconClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
        label: 'Completed',
        value: data.completedJobsCount,
        sub: data.completedJobsCount === 1 ? 'job finished' : 'jobs finished',
        icon: CheckCircle,
        iconClass: 'text-green-600 dark:text-green-400',
        bgClass: 'bg-green-50 dark:bg-green-950/40',
    },
    {
        label: 'Pending Proposals',
        value: data.pendingProposalsCount,
        sub: data.pendingProposalsCount === 1 ? 'awaiting response' : 'awaiting response',
        icon: Clock,
        iconClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
        label: 'Total Value',
        value: formatCurrency(data.totalValue),
        sub: 'across all jobs',
        icon: DollarSign,
        iconClass: 'text-purple-600 dark:text-purple-400',
        bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    },
];

export const JobStats: React.FC<JobStatsProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-4 gap-0">
                        <div className="flex items-center justify-between mb-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="size-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-7 w-20 mb-1.5" />
                        <Skeleton className="h-3 w-24" />
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS(data).map(({ label, value, sub, icon: Icon, iconClass, bgClass }) => (
                <Card key={label} className="p-4 hover:shadow-md transition-shadow gap-0">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">{label}</span>
                        <div className={`size-8 rounded-lg flex items-center justify-center ${bgClass}`}>
                            <Icon className={`size-4 ${iconClass}`} />
                        </div>
                    </div>
                    <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                </Card>
            ))}
        </div>
    );
};
