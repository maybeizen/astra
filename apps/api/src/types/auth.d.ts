export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<
    User,
    | "password"
    | "verificationToken"
    | "resetPasswordToken"
    | "resetPasswordExpires"
  >;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  username: string;
  isVerified: boolean;
}
