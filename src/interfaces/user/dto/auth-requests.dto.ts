
export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ValidateTokenDto {
  token: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ActivateAccountDto {
  email: string;
  activationCode: string;
}

export interface ResendActivationCodeDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResendResetPasswordCodeDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  resetPasswordCode: string;
  newPassword: string;
}

