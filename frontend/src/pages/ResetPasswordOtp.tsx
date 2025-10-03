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
      const res = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
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
    <div className="min-h-screen bg-[#27465C] flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#27465C] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl md:text-3xl font-black text-white">
              C&I
            </Link>
            <Link
              to="/login"
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-6">
              Enter Reset Code
            </h1>
            <p className="text-lg text-white font-normal">
              We've sent a 4-digit code to <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Input */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Reset Code *</label>
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
                  className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[white] focus:border-[white] transition-colors duration-200 text-center font-mono tracking-wider text-xl"
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
                className="w-full h-12 bg-white text-black rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#27465C] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Next'}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-gray-600 font-medium mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-[#27465C] hover:text-[#1f3a48] font-medium transition-colors duration-200 disabled:opacity-50 underline"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </form>

            {/* Back Link */}
            <div className="text-center mt-8">
              <Link
                to="/forgot-password"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
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