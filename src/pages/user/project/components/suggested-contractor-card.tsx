import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Award, BadgeCheck, Building2 } from 'lucide-react';
import type { IContractor } from '@/interfaces/user/user.interface';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SuggestedContractorCardProps {
    contractor: IContractor;
    matchPercentage: number;
    riskFactor: number;
    onViewProfile?: (contractorId: string) => void;
    onInvite?: (contractorId: string) => void;
}

export const SuggestedContractorCard: React.FC<SuggestedContractorCardProps> = ({
    contractor,
    matchPercentage,
    onViewProfile,
    onInvite
}) => {
    // Fallbacks for missing data
    const averageRating = contractor.ratings?.averageRatings || 0;
    const totalProjects = contractor.portfolio?.length || 0;

    return (
        <Card className="mb-4 overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow p-0">
            <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    {/* Left Section: Info */}
                    <div className="flex gap-4 items-start">
                        {/* Avatar */}
                        <Avatar className="size-11 md:size-13 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                                <Building2 className="md:size-7 size-5" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="font-semibold text-lg md:text-xl text-foreground flex items-center gap-1.5">
                                    {contractor.companyName}
                                    {contractor.verification?.businessVerificationStatus === 'verified' && (
                                        <BadgeCheck className="size-5 text-primary" />
                                    )}
                                </h3>
                                <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-0 rounded-md font-medium text-xs px-2 py-0.5">
                                    {matchPercentage}% Match
                                </Badge>
                            </div>
                            
                            {contractor.businessName && contractor.businessName !== contractor.companyName && (
                                <p className="text-muted-foreground text-sm">
                                    {contractor.businessName}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 text-yellow-500">
                                    <Star className="size-4 fill-current" />
                                    <span className="font-medium text-foreground">{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
                                    {totalProjects > 0 && <span className="text-muted-foreground">({totalProjects} projects)</span>}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Award className="size-4" />
                                    <span>{contractor.yearsInBusiness} years</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Hourly Rate / Attributes */}
                    {contractor.hourlyRate && (
                        <div className="flex flex-col md:items-end text-sm mt-4 md:mt-0 shrink-0">
                            <span className="text-muted-foreground">Estimated Rate</span>
                            <span className="font-semibold text-lg text-foreground">${contractor.hourlyRate}/hr</span>
                        </div>
                    )}
                </div>

                {/* Body Section: Tags & Details */}
                <div className="mt-6 space-y-4">
                    {/* Why this match - Placeholder text using styling similar to image */}
                    <div className="bg-primary/5 rounded-lg p-4">
                        <p className="text-xs font-semibold text-primary mb-1">Why this match?</p>
                        <p className="text-sm text-muted-foreground">
                            Highly rated professional with {contractor.yearsInBusiness}+ years of experience, a {matchPercentage}% match to your project's specific requirements.
                        </p>
                    </div>

                    {/* Certifications - Green textual tags */}
                    {contractor.certifications && contractor.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {contractor.certifications.slice(0, 3).map((cert, idx) => (
                                <span key={idx} className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                                    {cert.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Services Tags */}
                    {contractor.services && contractor.services.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {contractor.services.slice(0, 5).map((service, idx) => (
                                <Badge key={idx} variant="secondary" className="capitalize bg-muted text-muted-foreground hover:bg-muted/80 font-normal border border-border/50">
                                    {service.replace(/_/g, ' ')}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Section */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
                    <Button 
                        variant="secondary" 
                        className="flex-1 bg-muted/80 hover:bg-muted font-medium"
                        onClick={() => onViewProfile?.(contractor._id)}
                    >
                        View Full Profile
                    </Button>
                    <Button 
                        className="flex-1 font-medium"
                        onClick={() => onInvite?.(contractor._id)}
                    >
                        Invite to Bid
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
