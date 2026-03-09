import React from 'react';

import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Star,
    BadgeCheck,
    MapPin,
    Briefcase,
    DollarSign,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import type { IContractor } from '@/interfaces/user/user.interface';

interface ContractorItemProps {
    contractor: IContractor;
    onViewProfile?: (contractorId: string) => void;
    onInvite?: (contractorId: string) => void;
}

// Deterministic simulated AI match data from existing contractor fields
const getMatchData = (contractor: IContractor) => {
    const base = contractor.riskScore ?? 5;
    const overall = Math.min(98, Math.max(50, Math.round(base * 9.2 + (contractor.completedProjects ?? 0) * 0.3)));
    const specialty = Math.min(99, Math.max(40, Math.round(base * 8 + (contractor.yearsInBusiness ?? 0) * 1.5)));
    const budget = Math.min(95, Math.max(35, Math.round(55 + (contractor.completedProjects ?? 0) * 0.7)));
    const availability = Math.min(95, Math.max(25, Math.round(90 - (contractor.activeProjects ?? 0) * 8)));
    const location = Math.min(98, Math.max(40, Math.round(base * 7.5 + 15)));

    const label = overall >= 85 ? 'Great Match' : overall >= 65 ? 'Good Match' : 'Fair Match';
    const labelColor =
        overall >= 85
            ? 'text-green-400'
            : overall >= 65
              ? 'text-blue-400'
              : 'text-yellow-400';

    return { overall, specialty, budget, availability, location, label, labelColor };
};

const getFinancialHealthLabel = (contractor: IContractor) => {
    const status = contractor.verification?.financialHealthStatus;
    if (status === 'verified') return { text: 'Strong Financial Health', color: 'text-green-400' };
    if (status === 'in_progress') return { text: 'Moderate Financial Health', color: 'text-yellow-400' };
    return { text: 'Financial Health Pending', color: 'text-muted-foreground' };
};

const formatBudget = (value?: number) => {
    if (!value) return 'N/A';
    if (value >= 1000) return `$${Math.round(value).toLocaleString()}`;
    return `$${value}`;
};

const getAvailabilityNote = (activeProjects?: number) => {
    if (!activeProjects || activeProjects === 0) return 'Currently available';
    return `Currently busy with ${activeProjects} projects`;
};

export const ContractorItem: React.FC<ContractorItemProps> = ({
    contractor,
    onViewProfile,
    onInvite,
}) => {
    const matchData = getMatchData(contractor);
    const financialHealth = getFinancialHealthLabel(contractor);
    const averageRating = contractor.ratings?.averageRatings ?? 0;
    const totalReviews = contractor.ratings?.totalReviews ?? 0;
    const isVerified = contractor.verification?.businessVerificationStatus === 'verified';
    const isInsured = !!contractor.insurance;
    const city = contractor.businessAddress?.city;
    const state = contractor.businessAddress?.state;
    const locationText = [city, state].filter(Boolean).join(', ');
    const primaryService = contractor.services?.[0]?.replace(/_/g, ' ') ?? '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-300 p-0">
                <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Section — Contractor Info */}
                        <div className="flex-1 p-5 md:p-6 space-y-5">
                            {/* Header: Name, badge, certification */}
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h3 className="font-semibold text-lg md:text-xl text-foreground flex items-center gap-1.5">
                                        {contractor.companyName}
                                        {isVerified && (
                                            <BadgeCheck className="size-5 text-primary" />
                                        )}
                                    </h3>
                                    {isVerified && (
                                        <Badge className="bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary border-0 rounded-full font-semibold text-[11px] px-2.5 py-0.5 uppercase tracking-wide">
                                            Indigo Certified
                                        </Badge>
                                    )}
                                </div>
                                {primaryService && (
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {contractor.services?.map((service) => service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ') || 'N/A'}
                                    </p>
                                )}
                            </div>

                            {/* Meta row: active projects, financial health, insurance */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                                {contractor.activeProjects !== undefined && (
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="size-3.5" />
                                        <span>{contractor.activeProjects} active projects</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <DollarSign className="size-3.5" />
                                    <span className={financialHealth.color}>
                                        {financialHealth.text}
                                    </span>
                                </div>
                                {isInsured && (
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="size-3.5" />
                                        <span>Insured</span>
                                    </div>
                                )}
                            </div>

                            {/* Rating + Location */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-foreground">
                                        {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                                    </span>
                                    {totalReviews > 0 && (
                                        <span className="text-muted-foreground">
                                            ({totalReviews} reviews)
                                        </span>
                                    )}
                                </div>
                                {locationText && (
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="size-3.5" />
                                        <span>{locationText}</span>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border/50" />

                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">AI Risk Score</p>
                                    <p className="text-xl font-bold text-foreground">
                                        {contractor.riskScore ? `${contractor.riskScore.toFixed(1)}/10` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Completed Projects</p>
                                    <p className="text-xl font-bold text-foreground">
                                        {contractor.completedProjects ?? 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Avg. Budget</p>
                                    <p className="text-xl font-bold text-foreground">
                                        {contractor.averageBudget
                                            ? `${formatBudget(contractor.averageBudget)} - ${formatBudget(contractor.averageBudget * 1.6)}`
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">On-Time Rate</p>
                                    <p className="text-xl font-bold text-green-500">
                                        {contractor.completedProjects && contractor.completedProjects > 0
                                            ? `${Math.min(99, Math.round(85 + (contractor.riskScore ?? 0) * 1.2))}%`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 font-medium"
                                    onClick={() => onViewProfile?.(contractor._id)}
                                >
                                    View Profile
                                </Button>
                                <Button
                                    className="flex-1 font-medium"
                                    onClick={() => onInvite?.(contractor._id)}
                                >
                                    Invite to Project
                                </Button>
                            </div>
                        </div>
                        {/* Right Section — AI Match Score Panel */}
                        <div className="lg:w-[320px] xl:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-border/50 bg-muted/30 dark:bg-muted/10 p-5 md:p-6 space-y-4">
                            {/* Score Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-5 text-primary" />
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            AI Match Score
                                        </p>
                                        <p className="text-3xl font-bold text-primary">
                                            {matchData.overall}%
                                        </p>
                                    </div>
                                </div>
                                <span className={cn('text-sm font-semibold', matchData.labelColor)}>
                                    {matchData.label}
                                </span>
                            </div>

                            {/* Match Factors */}
                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-foreground">Match Factors:</p>

                                <MatchFactor
                                    label="Specialty Match"
                                    value={matchData.specialty}
                                    description={primaryService || 'General experience'}
                                    barColor="bg-green-500"
                                />
                                <MatchFactor
                                    label="Budget Alignment"
                                    value={matchData.budget}
                                    description="Slightly above your budget range"
                                    barColor="bg-blue-500"
                                />
                                <MatchFactor
                                    label="Availability"
                                    value={matchData.availability}
                                    description={getAvailabilityNote(contractor.activeProjects)}
                                    barColor="bg-orange-500"
                                />
                                <MatchFactor
                                    label="Location Proximity"
                                    value={matchData.location}
                                    description={locationText ? 'Within 15 miles' : 'Location unknown'}
                                    barColor="bg-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// --- Match Factor Sub-component ---

interface MatchFactorProps {
    label: string;
    value: number;
    description: string;
    barColor: string;
}

const MatchFactor: React.FC<MatchFactorProps> = ({ label, value, description, barColor }) => (
    <div className="space-y-1">
        <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-semibold text-foreground">{value}%</span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
                className={cn('h-full rounded-full transition-all duration-500', barColor)}
                style={{ width: `${value}%` }}
            />
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
    </div>
);
