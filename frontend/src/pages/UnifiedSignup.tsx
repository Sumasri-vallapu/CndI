import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ENDPOINTS } from '../utils/api';
import { useLocationData } from '../hooks/useLocationData';

interface FormData {
  // Step 1: Email & Password
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;

  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  qualification: string;
  phone: string;

  // Step 3: Address
  district: string;
  mandal: string;
  panchayath: string;

  // Step 4: Referral
  referralSource: string;
}

const UnifiedSignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    email: '', otp: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', dateOfBirth: '', gender: '', occupation: '', qualification: '', phone: '',
    district: '', mandal: '', panchayath: '',
    referralSource: ''
  });

  const { locationData, fetchMandals, fetchGrampanchayats } = useLocationData();

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'password') validatePassword(value);
    if (field === 'confirmPassword') setPasswordMatch(value === formData.password);

    // Location cascade
    if (field === 'district') {
      setFormData(prev => ({ ...prev, mandal: '', panchayath: '' }));
      if (value) fetchMandals(value);
    }
    if (field === 'mandal') {
      setFormData(prev => ({ ...prev, panchayath: '' }));
      if (value) fetchGrampanchayats(value);
    }
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      // First check if email already exists
      const checkRes = await fetch(`${ENDPOINTS.CHECK_EMAIL_EXISTS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists) {
          alert('This email address is already registered. Please use a different email or sign in.');
          setIsLoading(false);
          return;
        }
      }

      // If email doesn't exist, proceed with sending OTP
      const res = await fetch(ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: 'User' // Will be updated with actual name later
        })
      });

      if (res.ok) {
        alert('OTP sent to your email!');
        setOtpSent(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send OTP');
      }
    } catch {
      alert('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      });

      if (res.ok) {
        alert('Email verified successfully!');
        setEmailVerified(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Invalid OTP');
      }
    } catch {
      alert('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepValidation = () => {
    if (currentStep === 1) {
      if (!emailVerified) {
        alert('Please verify your email first');
        return false;
      }
      if (!formData.password || !formData.confirmPassword) {
        alert('Please set your password');
        return false;
      }
      if (!passwordMatch) {
        alert('Passwords do not match');
        return false;
      }
      if (passwordStrength.score < 60) {
        alert('Please use a stronger password');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        alert('Please fill in all required fields');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.district) {
        alert('Please select a district');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (handleStepValidation()) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async () => {
    if (!handleStepValidation()) return;

    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          occupation: formData.occupation,
          qualification: formData.qualification,
          state: 'Telangana',
          district: locationData.districts.find(d => d.id === formData.district)?.name || formData.district,
          mandal: locationData.mandals.find(m => m.id === formData.mandal)?.name || formData.mandal,
          panchayath: locationData.grampanchayats.find(g => g.id === formData.panchayath)?.name || formData.panchayath,
          referralSource: formData.referralSource,
          otp: formData.otp
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        alert('Account created successfully! Welcome to ClearMyFile!');
        navigate('/protected');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create account');
      }
    } catch {
      alert('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };



  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#49a741] mb-4">Email Verification & Password</h2>
        <p className="text-lg text-gray-600 font-bold">Let's start by verifying your email</p>
      </div>

      {/* Email Input */}
      <div className="space-y-3">
        <label className="block text-lg font-medium text-gray-700 mb-2">Email Address *</label>
        <div className="flex gap-4">
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className="w-full flex-1 h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:border-[#49a741] transition-colors duration-200 text-base"
            disabled={otpSent}
          />
          {!otpSent && (
            <button
              onClick={sendOtp}
              disabled={isLoading || !formData.email}
              className="bg-[#49a741] text-white font-medium shadow hover:bg-[#3e9238] transition rounded px-6 h-14 disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          )}
        </div>
      </div>

      {/* OTP Verification */}
      {otpSent && !emailVerified && (
        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <p className="text-gray-800 text-center font-bold">
              We've sent a 6-digit code to <span className="font-bold text-primaryGreen">{formData.email}</span>
            </p>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full flex-1 h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:border-[#49a741] transition-colors duration-200 text-center font-mono tracking-wider text-base"
            />
            <button
              onClick={verifyOtp}
              disabled={isLoading || !formData.otp}
              className="bg-[#49a741] text-white rounded-lg px-6 h-14 font-medium hover:bg-[#3e9238] focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      )}

      {/* Password Setup */}
      {emailVerified && (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
              className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
            />
            {formData.password && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-700 font-bold">Password Strength:</span>
                  <span className={`font-bold ${passwordStrength.feedback === 'Weak' ? 'text-red-500' :
                      passwordStrength.feedback === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.feedback === 'Weak' ? 'bg-red-500' :
                        passwordStrength.feedback === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-700 mb-2">Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Re-enter your password"
              className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
            />
            {formData.confirmPassword && !passwordMatch && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-700 font-bold">Passwords do not match</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#49a741] mb-4">Personal Information</h2>
        <p className="text-lg text-gray-600 font-bold">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">First Name *</label>
          <input
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Gender</label>
          <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
            <SelectTrigger className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base bg-white">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              <SelectItem value="male" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Male</SelectItem>
              <SelectItem value="female" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Female</SelectItem>
              <SelectItem value="other" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Occupation</label>
          <input
            value={formData.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base"
            placeholder="Your current occupation"
          />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <label className="block text-lg font-medium text-gray-700 mb-2">Highest Qualification</label>
          <Select value={formData.qualification} onValueChange={(v) => handleInputChange('qualification', v)}>
            <SelectTrigger className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base bg-white">
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              <SelectItem value="no-formal-education" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">No Formal Education</SelectItem>
              <SelectItem value="10th" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">10th Grade</SelectItem>
              <SelectItem value="12th" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">12th Grade</SelectItem>
              <SelectItem value="diploma" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Diploma</SelectItem>
              <SelectItem value="bachelor" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Bachelor's Degree</SelectItem>
              <SelectItem value="master" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Master's Degree</SelectItem>
              <SelectItem value="phd" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#49a741] mb-4">Address Information</h2>
        <p className="text-lg text-gray-600 font-bold">Help us know where you're located</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">District *</label>
          <Select value={formData.district} onValueChange={(v) => handleInputChange('district', v)}>
            <SelectTrigger className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base bg-white">
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              {locationData.districts.map(district => (
                <SelectItem key={district.id} value={district.id} className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Mandal</label>
          <Select value={formData.mandal} onValueChange={(v) => handleInputChange('mandal', v)} disabled={!formData.district}>
            <SelectTrigger className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base bg-white disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your mandal" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              {locationData.mandals.map(mandal => (
                <SelectItem key={mandal.id} value={mandal.id} className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">
                  {mandal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">Gram Panchayat</label>
          <Select value={formData.panchayath} onValueChange={(v) => handleInputChange('panchayath', v)} disabled={!formData.mandal}>
            <SelectTrigger className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base bg-white disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your gram panchayat" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              {locationData.grampanchayats.map(gp => (
                <SelectItem key={gp.id} value={gp.id} className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">
                  {gp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#49a741] mb-4">Final Details</h2>
        <p className="text-lg text-gray-600 font-bold">Help us understand you better</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-lg font-medium text-gray-700 mb-2">How did you hear about us?</label>
          <Select value={formData.referralSource} onValueChange={(v) => handleInputChange('referralSource', v)}>
            <SelectTrigger className="w-full h-14 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-primaryGreen transition-colors duration-200 text-base bg-white">
              <SelectValue placeholder="Select how you heard about us" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              <SelectItem value="social-media" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Social Media</SelectItem>
              <SelectItem value="friend-family" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Friend/Family</SelectItem>
              <SelectItem value="google-search" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Google Search</SelectItem>
              <SelectItem value="advertisement" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Advertisement</SelectItem>
              <SelectItem value="news-article" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">News Article</SelectItem>
              <SelectItem value="government-office" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Government Office</SelectItem>
              <SelectItem value="other" className="text-gray-700 hover:bg-green-50 focus:bg-green-50 rounded m-1 py-3">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">🎉 You're almost done!</h3>
          <p className="text-green-700">
            Click "Create Account" to complete your registration and join ClearMyFile.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl md:text-3xl font-bold text-[#49a741]">
              ClearMyFile
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#49a741] text-white font-medium shadow hover:bg-[#3e9238] transition rounded px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-8 sm:py-12">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#49a741] mb-6">
              Create Your Account
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-bold max-w-2xl mx-auto">
              Join thousands of users who trust ClearMyFile for secure services
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <span className="text-lg font-bold text-[#49a741]">
                Step {currentStep} of 4
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#4caf50] h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-12">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-white text-[#49a741] border-2 border-[#49a741] hover:bg-[#49a741] hover:text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 flex-1 sm:flex-none sm:min-w-[140px] h-14"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="bg-[#49a741] text-white rounded-lg font-medium hover:bg-[#3e9238] focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:ring-offset-2 transition-colors duration-200 order-1 sm:order-2 flex-1 sm:flex-none sm:min-w-[140px] h-14"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="bg-[#49a741] text-white rounded-lg font-medium hover:bg-[#3e9238] focus:outline-none focus:ring-2 focus:ring-[#49a741] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 flex-1 sm:flex-none sm:min-w-[180px] h-14"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t-2 border-gray-100">
            <p className="text-gray-600 font-bold">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#49a741] hover:text-[#3e9238] font-bold transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSignup;