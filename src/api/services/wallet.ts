import type { AddBankingMethodDto, FundWalletDto, WithdrawalRequestDto } from "@/interfaces/wallet/dto/wallet.dto";
import API_ENDPOINTS from "../api_endpoints";
import { api } from "../client";


export const WalletApi = {
    getWalletBalance: () => api.get(API_ENDPOINTS.wallet.getWalletBalance),
    fundWallet: (data: FundWalletDto) => api.post(API_ENDPOINTS.wallet.fundWallet, data),
    withdrawWallet: (data: WithdrawalRequestDto) => api.post(API_ENDPOINTS.wallet.withdrawWallet, data),
    getBankingMethods: () => api.get(API_ENDPOINTS.wallet.getBankingMethods),
    addBankingMethod: (data: AddBankingMethodDto) => api.post(API_ENDPOINTS.wallet.addBankingMethod, data),
    removeBankingMethod: (id: string) => api.delete(API_ENDPOINTS.wallet.removeBankingMethod.replace(':id', id)),
    setDefaultBankingMethod: (id: string) => api.put(API_ENDPOINTS.wallet.setDefaultBankingMethod.replace(':id', id)),
}