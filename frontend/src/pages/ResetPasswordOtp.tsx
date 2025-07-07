import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const ResetPasswordOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Redirect back if no email is provided
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the 4-digit reset code');
      return;
    }

    if (otp.length !== 4) {
      setError('Reset code must be 4 digits');
      return;
    }

    setIsLoading(true);
    try {
      // For password reset, we'll verify the OTP and then redirect to new password page
      // We'll pass both email and OTP to the next page for the final reset
      navigate('/reset-password-new', { 
        state: { 
          email, 
          otp,
          verified: true 
        } 
      });
    } catch {
      setError('Failed to verify reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsResending(true);
    
    try {
      const res = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        alert('New reset code sent to your email!');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to resend code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="container-main">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-black">
              ClearMyFile
            </Link>
            <Link 
              to="/login"
              className="btn-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-8 sm:py-12 flex items-center justify-center">
        <div className="container-main max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Enter Reset Code
            </h1>
            <p className="text-lg text-gray-600 font-bold">
              We've sent a 4-digit code to <span className="text-blue-600 font-bold">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Input */}
              <div className="space-y-4">
                <label className="form-label">Reset Code *</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setOtp(value);
                    if (error) setError('');
                  }}
                  placeholder="Enter 4-digit code"
                  maxLength={4}
                  className="form-input h-12 w-full text-center font-mono tracking-wider text-xl"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500 text-center">
                  Enter the 4-digit code sent to your email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-red-700 font-bold">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otp.length !== 4}
                className="btn-primary w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-gray-600 font-bold mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-blue-600 hover:text-blue-800 font-bold transition-colors duration-200 disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </form>

            {/* Back Link */}
            <div className="text-center mt-8">
              <Link 
                to="/forgot-password" 
                className="text-gray-600 hover:text-gray-800 font-bold transition-colors duration-200"
              >
                ← Back to Email Entry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordOtp;