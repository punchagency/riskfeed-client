import { BANKING_METHOD_TYPES } from "../wallet.interface";

export interface FundWalletDto {
    amount: number;
}

export interface AddBankingMethodDto {
    type: typeof BANKING_METHOD_TYPES[number];
    accountHolderName: string;
    bankName?: string;
    accountNumberLast4?: string;
    routingNumber?: string;
    paypalEmail?: string;
    isDefault?: boolean;
}

export interface WithdrawalRequestDto {
    amount: number;
    bankingMethodId?: string;
    notes?: string;
}
