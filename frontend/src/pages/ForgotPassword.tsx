import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setSuccess(true);
        // Auto-redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password-otp', { state: { email } });
        }, 2000);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to send reset code. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              Forgot Password?
            </h1>
            <p className="text-lg text-white font-normal">
              Don't worry! Enter your email and we'll send you a reset code.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-white/20">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Input */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full h-12 px-4 py-3 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-base text-white placeholder:text-white/70"
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                    <span className="text-red-200 font-medium">{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-white text-black font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#27465C] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Reset Code Sent!</h3>
                  <p className="text-white">
                    We've sent a 4-digit reset code to <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-white/80 mt-2">
                    Redirecting to verification page...
                  </p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center mt-8">
              <p className="text-white font-normal">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-white hover:text-gray-200 font-medium underline transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;