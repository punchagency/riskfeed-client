import { Skeleton } from '@/components/ui/skeleton';

export const PropertyItemSkeleton = () => {
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
                {/* Image Section Skeleton */}
                <div className="relative w-full md:w-80 h-96 bg-muted shrink-0">
                    <Skeleton className="w-full h-full rounded-none" />
                    {/* Badges Skeleton */}
                    <div className="absolute top-4 px-3 w-full flex justify-between items-center gap-2">
                        <Skeleton className="h-7 w-24 rounded-md" />
                        <Skeleton className="h-7 w-32 rounded-md" />
                    </div>
                </div>

                {/* Content Section Skeleton */}
                <div className="flex-1 p-6">
                    {/* Header Skeleton */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-1" />
                            <Skeleton className="h-4 w-2/5" />
                        </div>
                        {/* Action Buttons Skeleton */}
                        <div className="flex gap-2">
                            <Skeleton className="size-10 rounded-lg" />
                            <Skeleton className="size-10 rounded-lg" />
                            <Skeleton className="size-10 rounded-lg" />
                        </div>
                    </div>

                    {/* Stats Grid - Top Row Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-3 w-16 mb-2" />
                                <Skeleton className="h-6 w-24 mb-1" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>

                    {/* Stats Grid - Bottom Row Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-border">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-3 w-20 mb-2" />
                                <Skeleton className="h-5 w-28" />
                            </div>
                        ))}
                    </div>

                    {/* Documents Section Skeleton */}
                    <div className="flex items-center justify-end mt-4">
                        <div className="text-right">
                            <Skeleton className="h-3 w-20 mb-2 ml-auto" />
                            <Skeleton className="h-5 w-8 ml-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
