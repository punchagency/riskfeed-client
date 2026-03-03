import api from "../client";
import API_ENDPOINTS from "../api_endpoints";
import type { RegisterUserDto } from "@/interfaces/user/dto/register-user.dto";
import type { ActivateAccountDto, ChangePasswordDto, ForgotPasswordDto, LoginDto, RefreshTokenDto, ResendActivationCodeDto, ResendResetPasswordCodeDto, ResetPasswordDto, ValidateTokenDto } from "@/interfaces/user/dto/auth-requests.dto";
import type { UpdateProfileDto } from "@/interfaces/user/dto/update-profile.dto";

const AuthApi = {
    register: (data: RegisterUserDto) => api.post(API_ENDPOINTS.auth.register, data, { authenticated: false }),
    login: (data: LoginDto) => api.post(API_ENDPOINTS.auth.login, data, { authenticated: false }),
    refreshAccessToken: (data: RefreshTokenDto) => api.post(API_ENDPOINTS.auth.refreshAccessToken, data, { authenticated: false }),
    activateAccount: (data: ActivateAccountDto) => api.post(API_ENDPOINTS.auth.activateAccount, data, { authenticated: false }),
    resendActivationCode: (data: ResendActivationCodeDto) => api.post(API_ENDPOINTS.auth.resendActivationCode, data, { authenticated: false }),
    forgotPassword: (data: ForgotPasswordDto) => api.post(API_ENDPOINTS.auth.forgotPassword, data, { authenticated: false }),
    resetPassword: (data: ResetPasswordDto) => api.post(API_ENDPOINTS.auth.resetPassword, data, { authenticated: false }),
    resendResetCode: (data: ResendResetPasswordCodeDto) => api.post(API_ENDPOINTS.auth.resendResetPasswordCode, data, { authenticated: false }),
    validateToken: (data: ValidateTokenDto) => api.post(API_ENDPOINTS.auth.validateToken, data, { authenticated: true }),
    getProfile: () => api.get(API_ENDPOINTS.user.getProfile),
    updateProfile: (data: UpdateProfileDto) => api.put(API_ENDPOINTS.user.updateProfile, data, { authenticated: true }),
    changePassword: (data: ChangePasswordDto) => api.post(API_ENDPOINTS.user.changePassword, data, { authenticated: true }),
    logout: () => api.post(API_ENDPOINTS.user.logout, {}, { authenticated: true }),
};

export default AuthApi;