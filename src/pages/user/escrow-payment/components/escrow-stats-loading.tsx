import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const EscrowStatsLoading: React.FC = () => {
    return (
        <>
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700'>
                    <div className='animate-pulse'>
                        <div className="flex items-center mb-2">
                            <Skeleton className="size-4 mr-2" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-9 w-32" />
                    </div>
                </Card>
            ))}
        </>
    );
};
