import { WalletApi } from "@/api/services/wallet"
import type { AddBankingMethodDto, FundWalletDto, WithdrawalRequestDto } from "@/interfaces/wallet/dto/wallet.dto"
import HandleAPIError from "@/utils/HandleAPIError"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useWalletBalance = () => {
    return useQuery({
        queryKey: ['wallet-balance'],
        queryFn: () => WalletApi.getWalletBalance(),
        select: (response) => response.data,
    })
}

export const useBankingMethods = () => {
    return useQuery({
        queryKey: ['banking-methods'],
        queryFn: () => WalletApi.getBankingMethods(),
        select: (response) => response.data,
    })
}

export const useAddBankingMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AddBankingMethodDto) => WalletApi.addBankingMethod(data),
        onSuccess: () => {
            toast.success('Banking method added successfully');
            queryClient.invalidateQueries({ queryKey: ['banking-methods'] })
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useRemoveBankingMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => WalletApi.removeBankingMethod(id),
        onSuccess: () => {
            toast.success('Banking method removed successfully');
            queryClient.invalidateQueries({ queryKey: ['banking-methods'] })
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useSetDefaultBankingMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => WalletApi.setDefaultBankingMethod(id),
        onSuccess: () => {
            toast.success('Banking method set as default successfully');
            queryClient.invalidateQueries({ queryKey: ['banking-methods'] })
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useWithdrawWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: WithdrawalRequestDto) => WalletApi.withdrawWallet(data),
        onSuccess: () => {
            toast.success('Withdrawal request sent successfully');
            queryClient.invalidateQueries({ queryKey: ['banking-methods'] })
            queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}

export const useFundWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FundWalletDto) => WalletApi.fundWallet(data),
        onSuccess: () => {
            toast.success('Wallet funded successfully');
            queryClient.invalidateQueries({ queryKey: ['wallet-balance'] })
        },
        onError: (error) => {
            HandleAPIError(error)
        }
    })
}