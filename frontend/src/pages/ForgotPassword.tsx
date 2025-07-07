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
    <div className="min-h-screen bg-[#f7fafc] flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-black">
              ClearMyFile
            </Link>
            <Link 
              to="/login"
              className="bg-white text-primaryGreen border-2 border-primaryGreen hover:bg-primaryGreen hover:text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200"
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
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Forgot Password?
            </h1>
            <p className="text-lg text-gray-600 font-bold">
              Don't worry! Enter your email and we'll send you a reset code.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email Input */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-black mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
                    disabled={isLoading}
                  />
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
                  disabled={isLoading}
                  className="w-full h-12 bg-primaryGreen text-white rounded-lg font-medium hover:bg-hoverGreen focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Reset Code Sent!</h3>
                  <p className="text-green-700">
                    We've sent a 4-digit reset code to <span className="font-bold">{email}</span>
                  </p>
                  <p className="text-green-700 mt-2">
                    Redirecting to verification page...
                  </p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center mt-8">
              <p className="text-gray-600 font-bold">
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  className="text-primaryGreen hover:text-hoverGreen font-bold transition-colors duration-200"
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