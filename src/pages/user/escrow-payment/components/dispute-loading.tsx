import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export const DisputeCardLoading: React.FC = () => {
    return (
        <Card className="shadow-none border border-gray-200 dark:border-gray-700 overflow-hidden">
            <CardContent className="p-0">
                {/* Header */}
                <div className="p-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-5 w-20 rounded-md" />
                            </div>
                            <Skeleton className="h-4 w-full max-w-[400px]" />
                        </div>
                        <Skeleton className="h-5 w-28 rounded-md" />
                    </div>
                </div>

                <Separator />

                {/* Details */}
                <div className="p-5 space-y-4">
                    {/* Milestone Info */}
                    <div className="p-3.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <Skeleton className="h-3 w-16 mb-2" />
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-5 w-16 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-9 rounded-full" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-9 rounded-full" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-3 w-28" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const DisputePageLoading: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-5 w-40" />
            </div>

            <div className="space-y-2">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-4 rounded-lg shadow-none border-0 bg-gray-50 dark:bg-gray-700/50">
                        <CardContent className="p-0 space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-7 w-10" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Dispute cards skeleton */}
            <div className="space-y-4">
                <DisputeCardLoading />
                <DisputeCardLoading />
                <DisputeCardLoading />
            </div>
        </div>
    )
}
