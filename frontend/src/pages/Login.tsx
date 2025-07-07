import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
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
      const res = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to welcome page
        navigate('/welcome');
      } else {
        const err = await res.json();
        setError(err.error || 'Login failed. Please check your credentials.');
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
              to="/signup"
              className="bg-white text-primaryGreen border-2 border-primaryGreen hover:bg-primaryGreen hover:text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-6">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 font-bold">
              Sign in to your ClearMyFile account
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-black mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-black mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
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

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primaryGreen text-white rounded-lg font-medium hover:bg-hoverGreen focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Links */}
            <div className="text-center mt-8 space-y-4">
              <Link 
                to="/forgot-password"
                className="text-primaryGreen hover:text-hoverGreen font-bold transition-colors duration-200 block"
              >
                Forgot your password?
              </Link>
              
              <p className="text-gray-600 font-bold">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primaryGreen hover:text-hoverGreen font-bold transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;