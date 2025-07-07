import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const ResetPasswordNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp, verified } = location.state || {};
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Redirect back if no email/otp or not verified
    if (!email || !otp || !verified) {
      navigate('/forgot-password');
    }
  }, [email, otp, verified, navigate]);

  const validatePassword = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength({ 
      score: (score / 5) * 100, 
      feedback: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong' 
    });
  };

  const handleInputChange = (field: 'newPassword' | 'confirmPassword', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      validatePassword(value);
      setPasswordMatch(value === formData.confirmPassword);
    }
    if (field === 'confirmPassword') {
      setPasswordMatch(value === formData.newPassword);
    }
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    if (!passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 60) {
      setError('Please use a stronger password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          new_password: formData.newPassword
        })
      });

      if (res.ok) {
        setSuccess(true);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to reset password. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !otp || !verified) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-[#49a741]">
              ClearMyFile
            </Link>
            <Link 
              to="/login"
              className="bg-[#49a741] text-white font-medium shadow hover:bg-[#3e9238] transition rounded px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
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
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#49a741] mb-6">
              Create New Password
            </h1>
            <p className="text-lg text-gray-600 font-bold">
              Enter your new password for <span className="text-[#49a741] font-bold">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* New Password */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">New Password *</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:border-[#49a741] transition-colors duration-200 text-base"
                    disabled={isLoading}
                  />
                  {formData.newPassword && (
                    <div className="mt-4 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-700 font-bold">Password Strength:</span>
                        <span className={`font-bold ${
                          passwordStrength.feedback === 'Weak' ? 'text-red-500' :
                          passwordStrength.feedback === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {passwordStrength.feedback}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            passwordStrength.feedback === 'Weak' ? 'bg-red-500' :
                            passwordStrength.feedback === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700 mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:border-[#49a741] transition-colors duration-200 text-base"
                    disabled={isLoading}
                  />
                  {formData.confirmPassword && !passwordMatch && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <span className="text-red-700 font-bold">Passwords do not match</span>
                    </div>
                  )}
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
                  disabled={isLoading || !passwordMatch || passwordStrength.score < 60}
                  className="w-full h-12 bg-[#49a741] text-white rounded-lg font-medium hover:bg-[#3e9238] focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Password Reset Successfully!</h3>
                  <p className="text-green-700">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                  <p className="text-green-700 mt-2">
                    Redirecting to login page...
                  </p>
                </div>
              </div>
            )}

            {/* Security Info */}
            {!success && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                  <li>• Include at least one special character</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordNew;