import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { IBankingMethod } from '@/interfaces/wallet/wallet.interface'
import { cn } from '@/lib/utils'
import { Building2, CreditCard, CircleDollarSign, Landmark } from 'lucide-react'
import React from 'react'

interface BankingMethodCardProps {
    bankingMethod: IBankingMethod
}

export const BankingMethodCard: React.FC<BankingMethodCardProps> = ({ bankingMethod }) => {
    const getIcon = () => {
        switch (bankingMethod.type) {
            case 'card':
                return <CreditCard className='size-6 text-gray-600 dark:text-gray-400' />;
            case 'paypal':
                return <CircleDollarSign className='size-6 text-gray-600 dark:text-gray-400' />;
            case 'wire':
                return <Landmark className='size-6 text-gray-600 dark:text-gray-400' />;
            case 'bank_account':
            default:
                return <Building2 className='size-6 text-gray-600 dark:text-gray-400' />;
        }
    }

    const getTitle = () => {
        switch (bankingMethod.type) {
            case 'card':
                return 'Credit / Debit Card';
            case 'paypal':
                return 'PayPal Account';
            case 'wire':
                return bankingMethod.bankName || 'Wire Transfer';
            case 'bank_account':
            default:
                return bankingMethod.bankName || 'Bank Account';
        }
    }

    return (
        <Card className={cn('p-4 rounded-lg border-2 transition-all gap-0', bankingMethod.isDefault ? 'border-[#390085] dark:border-[#8b5cf6] bg-purple-50 dark:bg-purple-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600')}>
            <div className='flex items-center justify-between mb-2'>
                {getIcon()}
                {bankingMethod.isDefault && <Badge className="bg-[#390085] hover:bg-[#390085]/90 dark:bg-[#8b5cf6] dark:hover:bg-[#8b5cf6]/90 border-transparent text-white">DEFAULT</Badge>}
            </div>
            <h4 className='font-semibold text-[15px] text-gray-900 dark:text-white mb-1'>{getTitle()}</h4>
            <p className='font-normal text-[13px] text-gray-600 dark:text-gray-400 mb-0.5'>{bankingMethod.accountHolderName}</p>
            {bankingMethod.type === 'paypal' ? (
                <p className='font-normal text-[13px] text-gray-600 dark:text-gray-400 mb-0.5'>{bankingMethod.paypalEmail}</p>
            ) : (
                <p className='font-normal text-[13px] text-gray-600 dark:text-gray-400 mb-0.5'>•••• {bankingMethod.accountNumberLast4 || '****'}</p>
            )}
        </Card>
    )
}
