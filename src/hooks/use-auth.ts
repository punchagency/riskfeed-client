import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthApi from '../api/services/auth';
import { useDispatch, useSelector } from 'react-redux';
import Session from '@/utils/Session';
import { clearAuth, setAuth } from '@/store/slices/authSlice';
import { setUser, clearUser } from '@/store/slices/userSlice';
import APIErrorResponse from '@/utils/HandleAPIError';
import { useEffect } from 'react';
import type { RootState } from '@/store';
import HandleAPIError from '@/utils/HandleAPIError';
import { toast } from 'sonner';

export const useAuth = () => {
    const dispatch = useDispatch();
    const profileQuery = useQuery({
        queryKey: ['user-profile'],
        queryFn: AuthApi.getProfile,
        enabled: !!Session.getCookie("token"),
        select: (response) => response.data,
    });
    useEffect(() => {

        if (profileQuery.data) {
            dispatch(setUser(profileQuery.data));
            Session.set('user', profileQuery.data);
            if (profileQuery.data.contractor) {
                Session.set('contractor', profileQuery.data.contractor);
            }
            const token = Session.getCookie('token');
            const refreshToken = Session.getCookie('refreshToken');
            if (token) {
                dispatch(setAuth({ token, refreshToken }));
            }
        }
    }, [profileQuery.data, dispatch]);
};

export const useReduxAuth = () => {
    return useSelector((state: RootState) => ({
        isAuthenticated: state.auth.isAuthenticated,
        user: state.user.user,
    }));
};

export const useRegister = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.register,
        onSuccess: (response) => {
            const { accessToken, refreshToken } = response.data;
            Session.setCookie('token', accessToken);
            if (refreshToken) Session.setCookie('refreshToken', refreshToken);
            dispatch(setAuth({ token: accessToken, refreshToken }));
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useLogin = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.login,
        onSuccess: (response) => {
            const { accessToken, refreshToken } = response.data;
            Session.setCookie('token', accessToken);
            if (refreshToken) Session.setCookie('refreshToken', refreshToken);
            dispatch(setAuth({ token: accessToken, refreshToken }));
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useLogout = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.logout,
        onSuccess: () => {
            Session.clearAllCookies();
            Session.removeAll();
            dispatch(clearAuth());
            dispatch(clearUser());
            queryClient.clear();
            window.location.href = '/';
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useActivateAccount = () => {
    return useMutation({
        mutationFn: AuthApi.activateAccount,
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useResendActivationEmail = () => {
    return useMutation({
        mutationFn: AuthApi.resendActivationCode,
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
}

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: AuthApi.forgotPassword,
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: AuthApi.resetPassword,
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useResendResetPasswordCode = () => {
    return useMutation({
        mutationFn: AuthApi.resendResetCode,
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
}
export const useChangePassword = () => {
    return useMutation({
        mutationFn: AuthApi.changePassword,
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useUpdateProfile = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AuthApi.updateProfile,
        onSuccess: (response) => {
            dispatch(setUser(response.data.user));
            Session.set('user', response.data.user);
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: (error) => {
            APIErrorResponse(error);
        },
    });
};

export const useSetTransactionPin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AuthApi.setTransactionPin,
        onSuccess: () => {
            toast.success('Transaction pin set successfully');
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    });
};

export const useResetTransactionPinCode = () => {
    return useMutation({
        mutationFn: AuthApi.resetTransactionPinCode,
        onSuccess: () => {
            toast.success('Transaction pin reset code sent successfully');
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    });
};

export const useChangeTransactionPin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AuthApi.changeTransactionPin,
        onSuccess: () => {
            toast.success('Transaction pin changed successfully');
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        },
        onError: (error) => {
            HandleAPIError(error);
        },
    });
};