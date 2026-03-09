import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ContractorSkeleton: React.FC = () => {
    return (
        <Card className="overflow-hidden border-border bg-card p-0">
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section Skeleton */}
                    <div className="flex-1 p-5 md:p-6 space-y-5">
                        {/* Name + Badge */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-28 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-36" />
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-5">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-20" />
                        </div>

                        {/* Rating + Location */}
                        <div className="flex items-center gap-5">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border/50" />

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Skeleton className="h-9 flex-1 rounded-md" />
                            <Skeleton className="h-9 flex-1 rounded-md" />
                        </div>
                    </div>

                    {/* Right Section Skeleton */}
                    <div className="lg:w-[320px] xl:w-[340px] shrink-0 border-t lg:border-t-0 lg:border-l border-border/50 bg-muted/30 dark:bg-muted/10 p-5 md:p-6 space-y-4">
                        {/* Score Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-5 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-20" />
                        </div>

                        {/* Match Factors */}
                        <div className="space-y-3">
                            <Skeleton className="h-3 w-24" />
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-3 w-8" />
                                    </div>
                                    <Skeleton className="h-1.5 w-full rounded-full" />
                                    <Skeleton className="h-2.5 w-36" />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
