import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const SpeakerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (res.ok) {
        const data = await res.json();

        // Verify user is a speaker (can also be host)
        if (!data.user.is_speaker) {
          setError('This account is not registered as a Speaker. Please use Host login or sign up as Speaker.');
          return;
        }

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userType', data.user.user_type);

        navigate('/speaker/dashboard');
      } else {
        const err = await res.json();

        // Handle approval status errors
        if (err.approval_status === 'pending') {
          navigate('/pending-approval');
          return;
        } else if (err.approval_status === 'rejected') {
          navigate('/account-rejected', {
            state: { rejectionReason: err.rejection_reason }
          });
          return;
        }

        setError(err.error || 'Login failed. Please check your credentials.');
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
            <Link to="/" className="text-2xl font-bold text-white">
              C&I
            </Link>
            <Link
              to="/speaker-signup"
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-1.5 text-sm"
            >
              Sign Up as Speaker
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-4 sm:py-6 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white mb-3">
              Speaker Login
            </h1>
            <p className="text-base text-white font-normal">
              Sign in to manage your speaker profile and events
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
                  disabled={isLoading}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-white cursor-pointer"
                  />
                  <label htmlFor="showPassword" className="text-white text-xs font-medium cursor-pointer select-none">
                    Show Password
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <span className="text-red-200 text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#27465C] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Speaker'}
              </button>
            </form>

            {/* Links */}
            <div className="text-center mt-4 space-y-2">
              <Link
                to="/forgot-password"
                className="text-white hover:text-gray-200 text-sm font-medium transition-colors duration-200 block"
              >
                Forgot your password?
              </Link>

              <p className="text-white text-sm font-normal">
                Don't have an account?{' '}
                <Link
                  to="/speaker-signup"
                  className="text-white hover:text-gray-200 font-medium underline transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>

              <div className="border-t border-white/20 pt-3 mt-4">
                <p className="text-white/70 font-normal text-xs mb-2">
                  Are you an event organizer looking for speakers?
                </p>
                <Link
                  to="/host-login"
                  className="text-white hover:text-gray-200 text-sm font-medium underline transition-colors duration-200"
                >
                  Sign in as Host
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerLogin;