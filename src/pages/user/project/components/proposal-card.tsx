import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Star, Award, BadgeCheck, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { IProposal } from '@/interfaces/proposal/proposal.interface';
import type { IContractor } from '@/interfaces/user/user.interface';
import { useAcceptProposal, useRejectProposal } from '@/hooks/use-proposal';
import { getYearsFromNow } from '@/utils/getYearsfromNow';
import { cn } from '@/lib/utils';

interface ProposalCardProps {
    proposal: IProposal;
    onViewProfile?: (contractorId: string) => void;
}

const formatDate = (date: Date | string | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatTimeline = (proposal: IProposal): string => {
    if (proposal.minEstimatedDurationDays && proposal.maxEstimatedDurationDays) {
        const minWeeks = Math.ceil(proposal.minEstimatedDurationDays / 7);
        const maxWeeks = Math.ceil(proposal.maxEstimatedDurationDays / 7);
        return `${minWeeks}–${maxWeeks} weeks`;
    }
    if (proposal.estimatedDurationDays) {
        const weeks = Math.ceil(proposal.estimatedDurationDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    }
    return '—';
};

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onViewProfile }) => {
    const acceptMutation = useAcceptProposal();
    const rejectMutation = useRejectProposal();

    const [coverLetterExpanded, setCoverLetterExpanded] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'accept' | 'decline' | null>(null);

    const contractor = typeof proposal.contractor === 'object' ? proposal.contractor as IContractor : null;
    const averageRating = contractor?.ratings?.averageRatings ?? 0;
    const totalProjects = contractor?.portfolio?.length ?? 0;
    const isPending = proposal.status === 'pending';

    const coverLetterLines = proposal.coverLetter?.split('\n') ?? [];
    const isLong = coverLetterLines.length > 3 || (proposal.coverLetter?.length ?? 0) > 240;
    const displayedCoverLetter =
        !isLong || coverLetterExpanded
            ? proposal.coverLetter
            : coverLetterLines.slice(0, 3).join('\n') || proposal.coverLetter?.slice(0, 240);

    const statusBadgeClass: Record<string, string> = {
        pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
        accepted: 'bg-green-500/10 text-green-700 dark:text-green-400',
        rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
        withdrawn: 'bg-muted text-muted-foreground',
    };

    const contractorName = contractor?.companyName ?? 'this contractor';

    const handleConfirm = () => {
        if (confirmAction === 'accept') {
            acceptMutation.mutate(proposal._id);
        } else if (confirmAction === 'decline') {
            rejectMutation.mutate(proposal._id);
        }
        setConfirmAction(null);
    };

    return (
        <>
            <Card className="mb-4 overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow p-0">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
                        {/* Left: Contractor info */}
                        <div className="flex gap-4 items-start">
                            <Avatar className="size-12 rounded-xl bg-primary/10 text-primary shrink-0">
                                <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                                    <Building2 className="size-6" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-semibold text-lg text-foreground flex items-center gap-1.5">
                                        {contractor?.companyName ?? 'Unknown Contractor'}
                                        {contractor?.verification?.businessVerificationStatus === 'verified' && (
                                            <BadgeCheck className="size-5 text-primary" />
                                        )}
                                    </h3>
                                    <Badge
                                        className={`border-0 rounded-md font-medium text-xs px-2 py-0.5 capitalize ${statusBadgeClass[proposal.status] ?? ''}`}
                                    >
                                        {proposal.status}
                                    </Badge>
                                </div>

                                {contractor?.businessName && contractor.businessName !== contractor.companyName && (
                                    <p className="text-muted-foreground text-sm">{contractor.businessName}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5 text-yellow-500">
                                        <Star className="size-4 fill-current" />
                                        <span className="font-medium text-foreground">
                                            {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                                        </span>
                                        {totalProjects > 0 && (
                                            <span className="text-muted-foreground">({totalProjects} projects)</span>
                                        )}
                                    </div>
                                    {contractor?.yearEstablished && (
                                        <div className="flex items-center gap-1.5">
                                            <Award className="size-4" />
                                            <span>{getYearsFromNow(contractor.yearEstablished)} years in business</span>
                                        </div>
                                    )}
                                </div>

                                {/* Certifications */}
                                {contractor?.certifications && contractor.certifications.length > 0 && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                                        {contractor.certifications.slice(0, 3).map((cert, idx) => (
                                            <span key={idx} className="text-xs font-medium text-green-600 dark:text-green-400">
                                                {cert.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Budget + timeline */}
                        <div className="flex flex-col md:items-end shrink-0 gap-0.5">
                            <span className="text-xs text-muted-foreground">Proposed Budget</span>
                            <span className="font-semibold text-2xl text-primary">
                                ${proposal.estimatedAmount?.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Timeline: {formatTimeline(proposal)}
                            </span>
                        </div>
                    </div>

                    {/* Proposal Details (cover letter with expand/collapse) */}
                    {proposal.coverLetter && (
                        <div className="mt-5">
                            <p className="font-semibold text-sm text-foreground mb-1.5">Proposal Details</p>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {displayedCoverLetter}
                                {isLong && !coverLetterExpanded && '...'}
                            </p>
                            {isLong && (
                                <button
                                    onClick={() => setCoverLetterExpanded((prev) => !prev)}
                                    className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                >
                                    {coverLetterExpanded ? (
                                        <>Show less <ChevronUp className="size-3.5" /></>
                                    ) : (
                                        <>See more <ChevronDown className="size-3.5" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Cost Breakdown (milestones) */}
                    {proposal.milestones && proposal.milestones.length > 0 && (
                        <div className="mt-5">
                            <p className="font-semibold text-sm text-foreground mb-3">Cost Breakdown</p>
                            <div className="space-y-0">
                                {proposal.milestones
                                    .sort((a, b) => a.sequence - b.sequence)
                                    .map((milestone, idx) => (
                                        <React.Fragment key={milestone._id}>
                                            <div className="flex items-center justify-between py-2.5">
                                                <span className="text-sm text-muted-foreground">{milestone.name}</span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    ${milestone.amount?.toLocaleString()}
                                                </span>
                                            </div>
                                            {idx < (proposal.milestones?.length ?? 0) - 1 && (
                                                <Separator className="opacity-50" />
                                            )}
                                        </React.Fragment>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Specializations */}
                    {contractor?.services && contractor.services.length > 0 && (
                        <div className="mt-5">
                            <p className="font-semibold text-sm text-foreground mb-2">Specializations</p>
                            <div className="flex flex-wrap gap-2">
                                {contractor.services.slice(0, 5).map((service, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="capitalize bg-muted text-muted-foreground hover:bg-muted/80 font-normal border border-border/50"
                                    >
                                        {service.replace(/_/g, ' ')}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submitted / Available to Start */}
                    <div className="mt-5 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
                            <p className="text-sm font-semibold text-foreground">{formatDate(proposal.submissionDate)}</p>
                        </div>
                        {proposal.estimatedStartDate && (
                            <div className="flex-1 bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-0.5">Available to Start</p>
                                <p className="text-sm font-semibold text-foreground">
                                    Starting {formatDate(proposal.estimatedStartDate)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-col sm:flex-row gap-3 pt-5 border-t border-border/50">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => contractor && onViewProfile?.(contractor._id)}
                        >
                            View Profile
                        </Button>
                        {isPending && (
                            <>
                                <Button
                                    variant="secondary"
                                    className="flex-1 text-destructive hover:text-destructive"
                                    disabled={rejectMutation.isPending}
                                    onClick={() => setConfirmAction('decline')}
                                >
                                    Decline
                                </Button>
                                <Button
                                    className="flex-1"
                                    disabled={acceptMutation.isPending}
                                    onClick={() => setConfirmAction('accept')}
                                >
                                    Accept Proposal
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Confirmation dialog */}
            <AlertDialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction === 'accept' ? 'Accept this proposal?' : 'Decline this proposal?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction === 'accept' ? (
                                <>
                                    You are about to accept the proposal from <strong>{contractorName}</strong>. All
                                    other pending proposals for this project will be automatically declined. This action
                                    cannot be undone.
                                </>
                            ) : (
                                <>
                                    You are about to decline the proposal from <strong>{contractorName}</strong>. The
                                    contractor will be notified. This action cannot be undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='h-10'>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={cn(confirmAction === 'decline' ? 'bg-destructive text-white hover:bg-destructive/90' : '', "h-10")}
                        >
                            {confirmAction === 'accept' ? 'Accept Proposal' : 'Decline'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
