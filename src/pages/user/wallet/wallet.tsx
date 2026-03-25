import { AppPagination } from '@/components/app-pagination';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/use-transaction';
import { useBankingMethods, useWalletBalance } from '@/hooks/use-wallet';
import type { GetTransactionsQueryDto } from '@/interfaces/transaction/dto/transaction.dto';
import { formatCurrency } from '@/utils/format-currency-price';
import { CircleCheckBig, Plus, Shield, TrendingUpIcon, Wallet as WalletIcon, FileText } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BankingMethodCard } from './components/banking-method-card';
import type { IBankingMethod } from '@/interfaces/wallet/wallet.interface';
import { Skeleton } from '@/components/ui/skeleton';
import type { ITransaction } from '@/interfaces/transaction/transaction.interface';
import { TransactionCard, TransactionCardLoading } from '@/components/cards/transaction-card';

const Wallet: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = React.useState<GetTransactionsQueryDto>({
        limit: 12,
        page: 1,
        type: undefined,
        status: undefined,
    })
    const walletBalance = useWalletBalance();
    const bankingMethod = useBankingMethods();
    const transactions = useTransactions(filters);

    return (
        <>
            <PageHeader title='My Wallet'
                description='Manage your funds and track all transactions'
            />
            <div className='space-y-4'>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {walletBalance.isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="rounded-xl p-6 border gap-2">
                                <CardHeader className="p-0 flex flex-row items-center gap-2 mb-2">
                                    <Skeleton className="size-5 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </CardHeader>
                                <CardContent className="p-0 space-y-2 mt-4">
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <>
                            <Card className='bg-linear-to-br from-[#390085] to-[#4a0a9e] dark:from-[#8b5cf6] dark:to-[#7c3aed] rounded-xl p-6 text-white gap-2'>
                                <CardHeader className='p-0'>
                                    <CardTitle className='flex items-center font-normal text-xs text-white/80'><WalletIcon className='size-5 mr-2' />Total Balance</CardTitle>
                                </CardHeader>
                                <CardContent className='p-0'>
                                    <p className='font-semibold text-3xl'>{formatCurrency(walletBalance.data?.data?.wallet?.balance || 0, 'USD')}</p>
                                </CardContent>
                                <CardFooter className='p-0'>
                                    <Button size="sm" className='flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium text-[13px] transition-colors'><Plus /> Add Funds</Button>
                                </CardFooter>
                            </Card>

                            <Card className='bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 gap-2'>
                                <CardHeader className='p-0'>
                                    <CardTitle className='flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400'><CircleCheckBig className='size-5 mr-2' />Available Balance</CardTitle>
                                </CardHeader>
                                <CardContent className='p-0'>
                                    <p className='font-semibold text-3xl text-green-600 dark:text-green-400'>{formatCurrency(walletBalance.data?.data?.wallet?.availableBalance || 0, 'USD')}</p>
                                    <p className='font-normal text-[12px] text-gray-500 dark:text-gray-400 mt-1'>Ready to use</p>
                                </CardContent>
                            </Card>

                            <Card className='bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 gap-2'>
                                <CardHeader className='p-0'>
                                    <CardTitle className='flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400'><Shield className='size-5 mr-2' />In Escrow</CardTitle>
                                </CardHeader>
                                <CardContent className='p-0'>
                                    <p className='font-semibold text-3xl text-red-600 dark:text-red-400'>{formatCurrency(walletBalance.data?.data?.wallet?.holdBalance || 0, 'USD')}</p>
                                    <p className='font-normal text-[12px] text-gray-500 dark:text-gray-400 mt-1'>Held for projects</p>
                                </CardContent>
                            </Card>

                            <Card className='bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 gap-2'>
                                <CardHeader className='p-0'>
                                    <CardTitle className='flex items-center font-normal text-[13px] text-gray-500 dark:text-gray-400'><TrendingUpIcon className='size-5 mr-2' />Total Spent</CardTitle>
                                </CardHeader>
                                <CardContent className='p-0'>
                                    <p className='font-semibold text-3xl'>{formatCurrency(walletBalance.data?.data?.wallet?.totalWithdrawn || 0, 'USD')}</p>
                                    <p className='font-normal text-[12px] text-gray-500 dark:text-gray-400 mt-1'>All time</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 gap-2'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold'>Bank Accounts</h3>
                        <Button size="sm" onClick={() => navigate('/wallet/add-banking-method')}><Plus /> Add Bank Account</Button>
                    </div>

                    {bankingMethod.isLoading ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 gap-4'>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Card key={i} className="p-4 rounded-lg border-2 gap-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <Skeleton className="size-6 rounded-full" />
                                        <Skeleton className="h-5 w-16 xl:w-20 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2 mb-1" />
                                    <Skeleton className="h-3 w-1/3" />
                                </Card>
                            ))}
                        </div>
                    ) : bankingMethod.data?.data?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-4 border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mb-3">
                                <WalletIcon className="size-6 text-gray-400" />
                            </div>
                            <h4 className="text-sm font-semibold mb-1">No Bank Accounts</h4>
                            <p className="text-xs text-muted-foreground mb-4">Add a bank account to start managing your funds.</p>
                            <Button size="sm" variant="outline" onClick={() => navigate('/wallet/add-banking-method')}><Plus className="size-4 mr-2" /> Add Bank Account</Button>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 gap-4'>
                            {bankingMethod.data?.data?.map((method: IBankingMethod) => (
                                <BankingMethodCard key={method._id} bankingMethod={method} />
                            ))}
                        </div>
                    )}

                </div>

                <div className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 gap-2'>
                    <h3 className='text-lg font-semibold mb-4'>Transaction History</h3>

                    {transactions.isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TransactionCardLoading key={i} />
                            ))}
                        </div>
                    ) : transactions.data?.data?.items?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="size-10 mb-3 text-gray-300 dark:text-gray-600" />
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">No transactions yet</p>
                            <p className="text-xs mt-1 text-muted-foreground">Transactions will appear here once processed.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.data?.data?.items?.map((tx: ITransaction) => (
                                <TransactionCard key={tx._id} transaction={tx} role="user" />
                            ))}
                        </div>
                    )}

                    {!transactions.isLoading && transactions?.data?.data?.pagination?.pages > 1 && (
                        <AppPagination
                            page={transactions.data.data.pagination.page}
                            pages={transactions.data.data.pagination.pages}
                            limit={transactions.data.data.pagination.limit}
                            total={transactions.data.data.pagination.total}
                            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Wallet;