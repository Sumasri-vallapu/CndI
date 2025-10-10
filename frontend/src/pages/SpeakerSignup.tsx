import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';
import CustomDropdown from '../components/CustomDropdown';

interface SpeakerFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  expertise: string;
  experience: string;
  bio: string;
  location: string;
  website: string;
  linkedin: string;
}

const SpeakerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState<SpeakerFormData>({
    email: '', otp: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', phone: '', expertise: '', experience: '', bio: '', location: '', website: '', linkedin: ''
  });

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

  // Start cooldown timer
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (field: keyof SpeakerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');

    if (field === 'password') validatePassword(value);
    if (field === 'confirmPassword') setPasswordMatch(value === formData.password);
  };

  const sendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(ENDPOINTS.AUTH.SIGNUP_REQUEST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          user_type: 'speaker',
          first_name: formData.firstName,
          last_name: formData.lastName
        })
      });

      if (res.ok) {
        setOtpSent(true);
        setError('');
        startResendCooldown();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to send OTP');
      }
    } catch {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(ENDPOINTS.AUTH.RESEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          purpose: 'signup_speaker'
        })
      });

      if (res.ok) {
        setError('');
        startResendCooldown();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to resend OTP');
      }
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp_code: formData.otp,
          purpose: 'signup_speaker'
        })
      });

      if (res.ok) {
        setEmailVerified(true);
        setError('');
      } else {
        const err = await res.json();
        setError(err.error || 'Invalid OTP');
      }
    } catch {
      setError('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepValidation = () => {
    if (currentStep === 1) {
      if (!emailVerified) {
        setError('Please verify your email first');
        return false;
      }
      if (!formData.password || !formData.confirmPassword) {
        setError('Please set your password');
        return false;
      }
      if (!passwordMatch) {
        setError('Passwords do not match');
        return false;
      }
      if (passwordStrength.score < 60) {
        setError('Please use a stronger password');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (handleStepValidation()) {
      setCurrentStep(prev => Math.min(3, prev + 1));
      setError('');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setError('');
  };

  const handleFinalSubmit = async () => {
    if (!handleStepValidation()) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(ENDPOINTS.AUTH.SET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userType', data.user.user_type);
        navigate('/speaker/dashboard');
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to create account');
      }
    } catch {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-3">Email Verification & Password</h2>
        <p className="text-base text-white font-normal">Let's start by verifying your email</p>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Email Address *</label>
        <div className="flex gap-4">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="w-full flex-1 h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            disabled={otpSent}
          />
          {!otpSent && (
            <button
              onClick={sendOtp}
              disabled={isLoading || !formData.email}
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-1.5 h-10 disabled:opacity-50 whitespace-nowrap text-sm"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          )}
        </div>
      </div>

      {/* OTP Verification */}
      {otpSent && !emailVerified && (
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <p className="text-white text-center font-medium text-sm">
              We've sent a 4-digit code to <span className="font-medium text-white underline">{formData.email}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              placeholder="Enter 4-digit code"
              maxLength={4}
              className="w-full flex-1 h-14 px-4 py-3 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-center font-mono tracking-wider text-base text-white placeholder:text-white/70"
            />
            <button
              onClick={verifyOtp}
              disabled={isLoading || !formData.otp}
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-1.5 h-10 disabled:opacity-50 whitespace-nowrap text-sm"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              onClick={resendOtp}
              disabled={isLoading || resendCooldown > 0}
              className="text-white hover:text-gray-200 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : 'Didn\'t receive code? Resend'}
            </button>
          </div>
        </div>
      )}

      {/* Password Setup */}
      {emailVerified && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-lg font-medium text-white mb-2">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
              className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            />
            {formData.password && (
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-white font-medium">Password Strength:</span>
                  <span className={`font-medium ${passwordStrength.feedback === 'Weak' ? 'text-red-300' :
                      passwordStrength.feedback === 'Medium' ? 'text-yellow-300' : 'text-green-300'
                    }`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.feedback === 'Weak' ? 'bg-red-400' :
                        passwordStrength.feedback === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-medium text-white mb-2">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
              className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            />
            {formData.confirmPassword && !passwordMatch && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <span className="text-red-200 font-medium">Passwords do not match</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-white/20 text-white focus:ring-2 focus:ring-white cursor-pointer"
            />
            <label htmlFor="showPassword" className="text-white text-sm font-medium cursor-pointer select-none">
              Show Password
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-3">Personal Information</h2>
        <p className="text-base text-white font-normal">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">First Name *</label>
          <input
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Last Name *</label>
          <input
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Phone Number</label>
          <input
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Location</label>
          <input
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="block text-lg font-medium text-white mb-2">Areas of Expertise</label>
          <input
            value={formData.expertise}
            onChange={(e) => handleInputChange('expertise', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="Technology, Business, Marketing, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-3">Professional Profile</h2>
        <p className="text-base text-white font-normal">Complete your speaker profile</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <CustomDropdown
            label="Years of Experience"
            options={[
              { value: '', label: 'Select experience level' },
              { value: '0-2', label: '0-2 years' },
              { value: '3-5', label: '3-5 years' },
              { value: '6-10', label: '6-10 years' },
              { value: '11-15', label: '11-15 years' },
              { value: '15+', label: '15+ years' }
            ]}
            value={formData.experience}
            onChange={(value) => handleInputChange('experience', value)}
            placeholder="Select experience level"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Professional Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-base text-white placeholder:text-white/70 resize-none"
            placeholder="Tell us about your background, achievements, and what makes you a great speaker..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Website (Optional)</label>
          <input
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">LinkedIn Profile (Optional)</label>
          <input
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-3">🎉 You're almost done!</h3>
          <p className="text-white/80">
            Click "Create Account" to complete your registration and start your speaking journey.
          </p>
        </div>
      </div>
    </div>
  );

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
              to="/speaker-login"
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-1.5 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-4 sm:py-6">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-3">
              Create Speaker Account
            </h1>
            <p className="text-base text-white font-normal max-w-2xl mx-auto">
              Join as a speaker to showcase your expertise and connect with event organizers
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <span className="text-base font-medium text-white">
                Step {currentStep} of 3
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 sm:p-6 mb-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm mb-6">
              <span className="text-red-200 font-medium">{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 flex-1 sm:flex-none sm:min-w-[140px] h-10"
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="bg-white text-black font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200 order-1 sm:order-2 flex-1 sm:flex-none sm:min-w-[140px] h-10"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="bg-white text-black font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 flex-1 sm:flex-none sm:min-w-[180px] h-10"
              >
                {isLoading ? 'Creating Account...' : 'Create Speaker Account'}
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-4 pt-4 border-t border-white/20">
            <p className="text-white font-normal text-sm">
              Already have an account?{' '}
              <Link
                to="/speaker-login"
                className="text-white hover:text-gray-200 font-medium underline transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>

            <div className="mt-2 space-y-2">
              <p className="text-white/70 font-normal text-xs">
                Are you an event organizer looking for speakers?
              </p>
              <Link
                to="/host-signup"
                className="text-white hover:text-gray-200 font-medium underline transition-colors duration-200 text-sm"
              >
                Sign up as Host
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerSignup;