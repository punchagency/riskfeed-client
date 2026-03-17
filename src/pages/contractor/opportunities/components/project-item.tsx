import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, DollarSign, Calendar, Clock, Eye, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IProject } from '@/interfaces/project/project.interface';
import { cn } from '@/lib/utils';
import { Badge } from '../../../../components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface ProjectItemProps {
  project: IProject;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPropertyType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getDurationText = () => {
    if (project.durationRange) {
      const minWeeks = Math.ceil(project.durationRange.minDays / 7);
      const maxWeeks = Math.ceil(project.durationRange.maxDays / 7);
      return `${minWeeks}-${maxWeeks} weeks`;
    }
    if (project.durationDays) {
      const weeks = Math.ceil(project.durationDays / 7);
      return `${weeks} weeks`;
    }
    return 'TBD';
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'TBD';
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(date));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-[#390085] dark:hover:border-[#8b5cf6] transition-all',
        isHovered ? 'border-primary' : 'border-border'
      )}
    >
      <div className="flex items-start gap-6">
        {/* Match Badge */}
        <div className={cn('size-20 rounded-xl bg-linear-to-br from-[#390085] to-[#4a0a9e] dark:from-[#8b5cf6] dark:to-[#7c3aed] flex flex-col items-center justify-center text-white')}>
          <span className="text-2xl font-semibold text-primary-foreground">{project.matchPercentage || 0}%</span>
          <span className="text-xs font-medium text-primary-foreground uppercase">Match</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className='flex gap-3'>
                <h3 className="text-xl font-semibold text-foreground mb-1">{project.title}</h3>
                {!project.isInvited && <Badge className='px-1.5 py-0.9 text-[12px] h-fit'>You are Invited</Badge>}
              </div>
              <p className="font-normal text-[14px] text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[11px] font-medium">
              {project.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(project.createdAt)) : '2 days ago'}
            </span>
          </div>

          {/* Property Info */}
          <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              <span>{typeof project.homeowner === 'string' ? 'Homeowner' : `${project.homeowner?.firstName || ''} ${project.homeowner?.lastName || ''}`.trim() || 'Homeowner'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{project.property?.address?.city || 'N/A'}, {project.property?.address?.state || 'N/A'}</span>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6 mt-3">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <DollarSign className="size-4 text-green-600 dark:text-green-400" />
                <span className="text-xs">Budget</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(project.minBudget)} - {formatCurrency(project.maxBudget)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs">Timeline</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{getDurationText()}</span>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs">Start Date</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{formatDate(project.startDate)}</span>
            </div>

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Home className="size-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs">Property</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {project.property?.propertyType ? formatPropertyType(project.property.propertyType) : 'Single Family Home'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!project?.hasSentProposal && (
              <Button className="flex items-center gap-2"
                onClick={() => navigate(`/opportunities/express-interest/${project._id}`, { state: project })}
              >
                <Heart className="w-4 h-4" />
                Express Interest
              </Button>
            )}

            <Button variant="secondary" className="flex items-center text-foreground border-border border gap-2">
              <FileText className="w-4 h-4" />
              Request Site Visit
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
