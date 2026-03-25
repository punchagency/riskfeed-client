import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAddBankingMethod } from '@/hooks/use-wallet';

import { PageBackButton } from '@/components/page-back-button';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

import { BANKING_METHOD_TYPES } from '@/interfaces/wallet/wallet.interface';
import type { AddBankingMethodDto } from '@/interfaces/wallet/dto/wallet.dto';

const bankingMethodSchema = z.object({
    type: z.enum(BANKING_METHOD_TYPES),
    accountHolderName: z.string().min(1, 'Account holder name is required'),
    bankName: z.string().optional(),
    accountNumberLast4: z.string().optional(),
    routingNumber: z.string().optional(),
    paypalEmail: z.string().optional(),
    isDefault: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.type === 'bank_account' || data.type === 'wire') {
        if (!data.bankName?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Bank name is required', path: ['bankName'] });
        }
        if (!data.accountNumberLast4?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Account number is required', path: ['accountNumberLast4'] });
        }
        if (!data.routingNumber?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Routing number is required', path: ['routingNumber'] });
        }
    }
    if (data.type === 'paypal') {
        if (!data.paypalEmail?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PayPal email is required', path: ['paypalEmail'] });
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.paypalEmail)) {
                 ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid email address', path: ['paypalEmail'] });
            }
        }
    }
});

const AddBankingMethod: React.FC = () => {
    const navigate = useNavigate();
    const addBankingMethod = useAddBankingMethod();

    const form = useForm<z.infer<typeof bankingMethodSchema>>({
        resolver: zodResolver(bankingMethodSchema),
        mode: 'onChange',
        defaultValues: {
            type: 'bank_account',
            accountHolderName: '',
            bankName: '',
            accountNumberLast4: '',
            routingNumber: '',
            paypalEmail: '',
            isDefault: false,
        },
    });

    const selectedType = useWatch({ control: form.control, name: 'type' });

    const onSubmit = (data: z.infer<typeof bankingMethodSchema>) => {
        const payload: AddBankingMethodDto = {
            type: data.type,
            accountHolderName: data.accountHolderName,
            isDefault: data.isDefault,
        };

        if (data.type === 'bank_account' || data.type === 'wire') {
            payload.bankName = data.bankName;
            payload.accountNumberLast4 = data.accountNumberLast4;
            payload.routingNumber = data.routingNumber;
        } else if (data.type === 'paypal') {
            payload.paypalEmail = data.paypalEmail;
        }

        addBankingMethod.mutate(payload, {
            onSuccess: () => {
                navigate('/wallet');
            },
        });
    };

    return (
        <>
            <PageBackButton text='Back to Wallet' onClick={() => navigate('/wallet')} />
            <PageHeader title='Add Banking Method' description='Add a new banking method to your wallet' />

            <div className="backdrop-blur-sm rounded-2xl p-8 border">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Bank Account Details</h2>
                    <p className="text-muted-foreground">Enter the details for your new bank account</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method Type <span className='text-destructive'>*</span></FormLabel>
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        // Reset irrelevant fields on type change
                                        if (val !== 'paypal') {
                                            form.setValue('paypalEmail', '');
                                        }
                                        if (val !== 'bank_account' && val !== 'wire') {
                                            form.setValue('bankName', '');
                                            form.setValue('accountNumberLast4', '');
                                            form.setValue('routingNumber', '');
                                        }
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select method type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {BANKING_METHOD_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountHolderName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Holder Name <span className='text-destructive'>*</span></FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="John Doe" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {(selectedType === 'bank_account' || selectedType === 'wire') && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name <span className='text-destructive'>*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Chase Bank" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="accountNumberLast4"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Number <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter account number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="routingNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Routing Number <span className='text-destructive'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter routing number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {selectedType === 'paypal' && (
                            <FormField
                                control={form.control}
                                name="paypalEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PayPal Email <span className='text-destructive'>*</span></FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="john@example.com" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {selectedType === 'card' && (
                            <div className="rounded-lg border p-4 bg-muted/50">
                                <p className="text-sm text-muted-foreground text-center">
                                    Card details will be collected securely via our payment provider during transactions.
                                </p>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <FormLabel>Set as Default</FormLabel>
                                        <p className="text-sm text-muted-foreground">Make this your primary banking method</p>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between pt-6">
                            <Button type="button" variant="outline" onClick={() => navigate('/wallet')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={addBankingMethod.isPending}>
                                {addBankingMethod.isPending ? 'Adding...' : 'Add Method'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default AddBankingMethod;