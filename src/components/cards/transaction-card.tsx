import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/format-currency-price';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { ITransaction } from '@/interfaces/transaction/transaction.interface';
import { getStatusColor } from '@/constants/status-styles';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { IProject } from '@/interfaces/project/project.interface';

interface TransactionCardProps {
    transaction: ITransaction;
    role: 'user' | 'contractor';
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction: tx, role }) => {
    // Determine if amount is incoming or outgoing based on role
    const isIncoming = () => {
        if (role === 'user') {
            return ['wallet_funding', 'refund'].includes(tx.type);
        }
        if (role === 'contractor') {
            return ['milestone_release'].includes(tx.type);
        }
        return false;
    };

    const incoming = isIncoming();
    const amountSign = incoming ? '+' : '-';
    const amountColorClass = incoming ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';
    const IconComponent = incoming ? ArrowDownLeft : ArrowUpRight;
    const iconBgClass = incoming ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';

    // Parse Project title safely
    const projectTitle = typeof tx.project === 'object' && tx.project !== null ? (tx.project as IProject).title : 'Project';
    
    // Construct Display Title
    const formattedType = (tx.type || 'Transaction').replace(/_/g, ' ');
    const titleType = formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
    let displayTitle = titleType;
    if (tx.project || tx.milestoneName) {
        if (tx.project) displayTitle += ` - ${projectTitle}`;
        if (tx.milestoneName) displayTitle += ` (${tx.milestoneName})`;
    }

    // Format Date
    const displayDate = tx.createdAt ? format(new Date(tx.createdAt), "MMM d, yyyy 'at' h:mm a") : '—';

    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#390085] dark:hover:border-[#8b5cf6] transition-colors">
            <div className="flex items-center gap-4">
                <div className={cn("size-10 rounded-full flex items-center justify-center shrink-0", iconBgClass)}>
                    <IconComponent className="size-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {displayTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[12px] text-muted-foreground mr-1">{displayDate}</span>
                        {tx.platformFee && tx.platformFee > 0 ? (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 text-[10px] px-1.5 py-0 rounded-md font-medium h-5">
                                Platform fee: {formatCurrency(tx.platformFee, 'USD')}
                            </Badge>
                        ) : null}
                        <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium h-5 capitalize", getStatusColor(tx.status))}>
                            {tx.status?.replace(/_/g, ' ')}
                        </Badge>
                    </div>
                </div>
            </div>
            
            <div className="text-right shrink-0 ml-4">
                <p className={cn("font-semibold text-[15px]", amountColorClass)}>
                    {amountSign}{formatCurrency(tx.amount || 0, 'USD')}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                    Balance: {role === 'user' ? formatCurrency(tx.userBalanceAfter || 0, 'USD') : formatCurrency(tx.contractorBalanceAfter || 0, 'USD')}
                </p>
            </div>
        </div>
    );
};

export const TransactionCardLoading: React.FC = () => {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 w-full">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="space-y-2 w-full max-w-[280px]">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-2 pt-0.5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-16 mt-0.5 rounded-md" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
};
