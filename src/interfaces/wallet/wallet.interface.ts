export const BANKING_METHOD_TYPES = ['bank_account', 'card', 'paypal', 'wire'] as const;

export interface IBankingMethod {
    _id: string;
    user: string;
    type: typeof BANKING_METHOD_TYPES[number];
    isDefault: boolean;
    accountHolderName: string;
    bankName?: string;
    accountNumberLast4?: string;
    routingNumber?: string;
    paypalEmail?: string;
    metadata?: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}