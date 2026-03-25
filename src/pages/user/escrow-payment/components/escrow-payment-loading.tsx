import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const EscrowPaymentLoading: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 animate-pulse">
            {/* Header Section Skeleton */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-md" />
                </div>

                {/* Escrow Summary Section Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/20 shadow-none border-0">
                            <CardContent className="p-0 space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Payment Milestones Skeleton */}
            <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <Card key={i} className="shadow-none p-0 gap-0 rounded-lg border border-gray-200 dark:border-gray-700">
                            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                {/* Left side: Milestone Details */}
                                <div className="flex gap-4 items-start w-full md:w-auto">
                                    <Skeleton className="min-w-8 h-8 rounded-full mt-0.5" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-64" />
                                    </div>
                                </div>

                                {/* Right side: Status and Actions */}
                                <div className="flex flex-col items-end gap-2 shrink-0 md:min-w-[200px]">
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                    <div className="flex items-center gap-2 mt-2">
                                        <Skeleton className="h-8 w-20 rounded-md" />
                                        <Skeleton className="h-8 w-28 rounded-md" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
