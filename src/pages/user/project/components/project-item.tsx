import { Calendar, DollarSign, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IProject, PROJECT_RISK_LEVELS } from '@/interfaces/project/project.interface';

interface ProjectItemProps {
    project: IProject;
    onClick?: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const getRiskColor = (riskLevel: typeof PROJECT_RISK_LEVELS[number]) => {
    switch (riskLevel) {
        case 'low':
            return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
        case 'medium':
            return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
        case 'high':
            return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
        default:
            return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'draft':
            return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
        case 'published':
            return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
        case 'in_progress':
            return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
        case 'completed':
            return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
        case 'cancelled':
            return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
        default:
            return 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400';
    }
};

export const ProjectItem: React.FC<ProjectItemProps> = ({ project, onClick }) => {
    const riskStyle = getRiskColor(project.riskLevel || "low");
    const statusStyle = getStatusColor(project.status);

    const currentMilestone = project.milestones?.find(m => m.status === 'in_progress');
    const completedMilestones = project.milestones?.filter(m => m.status === 'completed').length || 0;
    const totalMilestones = project.milestones?.length || 0;
    const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    const formatDate = (date?: Date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatBudget = (min: number, max: number) => {
        return `$${min.toLocaleString()} / $${max.toLocaleString()}`;
    };

    const formatTimeline = () => {
        if (project.durationRange) {
            return `${formatDate(project.startDate)} - ${formatDate(new Date(new Date(project.startDate!).getTime() + project.durationRange.maxDays * 24 * 60 * 60 * 1000))}`;
        }
        if (project.durationDays && project.startDate) {
            return `${formatDate(project.startDate)} - ${formatDate(new Date(new Date(project.startDate).getTime() + project.durationDays * 24 * 60 * 60 * 1000))}`;
        }
        return 'Not scheduled';
    };

    return (
        <div
            onClick={onClick}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl text-foreground font-semibold mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        <span>{project.property.address.street}, {project.property.address.city}, {project.property.address.state}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusStyle)}>
                        {project.status === "published" ? "Not Started" : project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {project.riskLevel && (
                        <span className={cn('px-2 py-1 rounded-full text-xs capitalize font-light', riskStyle)}>
                            {project.riskLevel}
                        </span>
                    )}
                </div>
            </div>

            {(currentMilestone || project.status === 'published') && (
                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{currentMilestone?.name || 'No Contractor Assigned'}</span>
                        <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-sm text-foreground font-medium">{formatBudget(project.minBudget, project.maxBudget)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground">Timeline</p>
                        <p className="text-sm text-foreground font-medium">{formatTimeline()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
