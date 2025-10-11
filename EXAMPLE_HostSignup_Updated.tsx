import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/authService';

interface HostFormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const HostSignupUpdated: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState<HostFormData>({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
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

  const handleInputChange = (field: keyof HostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');

    if (field === 'password') {
      validatePassword(value);
      if (formData.confirmPassword) {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }
    if (field === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }
  };

  // Step 1: Send OTP to email
  const handleStepOne = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if email already exists
      const emailCheck = await authService.checkEmailExists(formData.email);
      if (emailCheck.exists) {
        setError('This email address is already registered. Please use a different email or sign in.');
        return;
      }

      // Request OTP
      await authService.signupRequest({
        email: formData.email,
        user_type: 'host',
        first_name: formData.firstName,
        last_name: formData.lastName
      });

      setCurrentStep(2);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleStepTwo = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyOTP({
        email: formData.email,
        otp_code: formData.otp,
        purpose: 'signup_host'
      });

      setCurrentStep(3);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set Password (Complete Signup)
  const handleStepThree = async () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please enter and confirm your password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authService.setPassword({
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });

      // Account created successfully and tokens are stored
      console.log('Account created:', result.user);
      
      // Navigate to success page or dashboard
      navigate('/host-dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError('');

    try {
      await authService.resendOTP(formData.email, 'signup_host');
      setError('');
      
      // Start cooldown
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
          currentStep >= 1 ? 'bg-[#27465C] text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          1
        </div>
        <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-[#27465C]' : 'bg-gray-300'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
          currentStep >= 2 ? 'bg-[#27465C] text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          2
        </div>
        <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-[#27465C]' : 'bg-gray-300'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
          currentStep >= 3 ? 'bg-[#27465C] text-white' : 'bg-gray-300 text-gray-600'
        }`}>
          3
        </div>
      </div>
      <div className="ml-4 text-sm text-gray-600">
        {currentStep === 1 && 'Enter Details'}
        {currentStep === 2 && 'Verify Email'}
        {currentStep === 3 && 'Create Password'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#27465C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-black text-center mb-2">Host Registration</h1>
        <p className="text-center text-gray-600 mb-8">Create your host account</p>
        
        {renderStepIndicator()}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Email and Name */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <button
              onClick={handleStepOne}
              disabled={isLoading}
              className="w-full bg-white text-black border-2 border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                We've sent a verification code to <br />
                <strong>{formData.email}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code *
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                placeholder="000000"
              />
            </div>

            <button
              onClick={handleStepTwo}
              disabled={isLoading}
              className="w-full bg-white text-black border-2 border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isLoading}
                className="text-[#27465C] hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {resendCooldown > 0 
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend verification code'
                }
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Password Creation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Email verified! Now create your password.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                placeholder="Create a strong password"
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.feedback === 'Strong' ? 'text-green-600' :
                      passwordStrength.feedback === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.feedback === 'Strong' ? 'bg-green-600' :
                        passwordStrength.feedback === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${passwordStrength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent ${
                  formData.confirmPassword && !passwordMatch ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && !passwordMatch && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              onClick={handleStepThree}
              disabled={isLoading || !passwordMatch}
              className="w-full bg-white text-black border-2 border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/host-login" className="text-[#27465C] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostSignupUpdated;