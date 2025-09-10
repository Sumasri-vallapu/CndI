import { ENDPOINTS } from './api';

export interface AuthResponse {
  message: string;
  access?: string;
  refresh?: string;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
  };
}

export interface SignupRequestData {
  email: string;
  user_type: 'host' | 'speaker';
  first_name?: string;
  last_name?: string;
}

export interface OTPVerificationData {
  email: string;
  otp_code: string;
  purpose: string;
}

export interface PasswordSetData {
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp_code: string;
  new_password: string;
  confirm_password: string;
}

class AuthService {
  
  /**
   * Step 1: Request OTP for signup (Host or Speaker)
   */
  async signupRequest(data: SignupRequestData): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.SIGNUP_REQUEST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Signup request failed');
    }
    
    return response.json();
  }

  /**
   * Step 2: Verify OTP code
   */
  async verifyOTP(data: OTPVerificationData): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'OTP verification failed');
    }
    
    return response.json();
  }

  /**
   * Step 3: Set password after OTP verification (completes signup)
   */
  async setPassword(data: PasswordSetData): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.SET_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Password creation failed');
    }
    
    const result = await response.json();
    
    // Store tokens if signup is complete
    if (result.access && result.refresh) {
      this.storeTokens(result.access, result.refresh);
    }
    
    return result;
  }

  /**
   * Login with email and password
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Login failed');
    }
    
    const result = await response.json();
    
    // Store tokens
    if (result.access && result.refresh) {
      this.storeTokens(result.access, result.refresh);
    }
    
    return result;
  }

  /**
   * Step 1 of password reset: Request OTP
   */
  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Password reset request failed');
    }
    
    return response.json();
  }

  /**
   * Step 2 of password reset: Reset password with OTP
   */
  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Password reset failed');
    }
    
    return response.json();
  }

  /**
   * Resend OTP for any purpose
   */
  async resendOTP(email: string, purpose: string): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.AUTH.RESEND_OTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, purpose }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Resend OTP failed');
    }
    
    return response.json();
  }

  /**
   * Check if email already exists
   */
  async checkEmailExists(email: string): Promise<{ exists: boolean; email: string }> {
    const response = await fetch(ENDPOINTS.AUTH.CHECK_EMAIL_EXISTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Email check failed');
    }
    
    return response.json();
  }

  /**
   * Helper function to get OTP purpose based on user type
   */
  getOTPPurpose(userType: string): string {
    return userType === 'host' ? 'signup_host' : 'signup_speaker';
  }

  /**
   * Store JWT tokens in localStorage
   */
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Clear stored tokens (logout)
   */
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;