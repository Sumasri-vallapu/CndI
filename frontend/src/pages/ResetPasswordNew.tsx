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
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await fetch(ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp_code: otp,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword
        })
      });

      if (res.ok) {
        setSuccess(true);
        // Auto-redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
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
    <div className="min-h-screen bg-[#27465C] flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#27465C] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-white">
              C&I
            </Link>
            <Link
              to="/"
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-4 sm:py-6 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-3">
              Create New Password
            </h1>
            <p className="text-base text-white font-normal">
              Enter your new password for <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">New Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-10 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[white] focus:border-[white] transition-colors duration-200 text-sm"
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full h-10 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[white] focus:border-[white] transition-colors duration-200 text-sm"
                    disabled={isLoading}
                  />
                  {formData.confirmPassword && !passwordMatch && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <span className="text-red-700 font-bold">Passwords do not match</span>
                    </div>
                  )}
                </div>

                {/* Show Password Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#27465C] focus:ring-2 focus:ring-[#27465C] cursor-pointer"
                  />
                  <label htmlFor="showPassword" className="text-gray-700 text-sm font-medium cursor-pointer select-none">
                    Show Password
                  </label>
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
                  className="w-full h-10 bg-white text-black rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#27465C] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-base font-bold text-green-800 mb-2">Password Reset Successfully!</h3>
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
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Password Requirements:</h4>
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