import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ENDPOINTS } from '../utils/api';
import { useLocationData } from '../hooks/useLocationData';

interface FormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  qualification: string;
  occupation: string;
  state: string;
  district: string;
  mandal: string;
  panchayath: string;
  referralSource: string;
}

const UnifiedSignup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: email+otp+password, 2: personal info, 3: address, 4: referral
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '', otp: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', dateOfBirth: '', gender: '', phone: '',
    qualification: '', occupation: '', state: '', district: '', mandal: '', 
    panchayath: '', referralSource: ''
  });
  const { locationData, fetchDistricts, fetchMandals, fetchGrampanchayats } = useLocationData();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle location cascade
    if (field === 'state') {
      setFormData(prev => ({ ...prev, district: '', mandal: '', panchayath: '' }));
      if (value) fetchDistricts(value);
    }
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
      const res = await fetch(ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: 'Friend' })
      });
      if (res.ok) {
        setOtpSent(true);
        alert('Verification code sent to your email!');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send verification code');
      }
    } catch {
      alert('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      alert('Please enter the verification code');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      if (res.ok) {
        setEmailVerified(true);
        alert('Email verified successfully!');
      } else {
        const err = await res.json();
        alert(err.error || 'Invalid verification code');
      }
    } catch {
      alert('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (currentStep < 4) {
      // Validate current step
      if (currentStep === 1) {
        if (!emailVerified) {
          alert('Please verify your email first');
          return;
        }
        if (!formData.password || !formData.confirmPassword) {
          alert('Please enter and confirm your password');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        if (formData.password.length < 8) {
          alert('Password must be at least 8 characters long');
          return;
        }
      }
      if (currentStep === 2) {
        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
          alert('Please fill in all required personal information fields');
          return;
        }
      }
      if (currentStep === 3) {
        if (!formData.state || !formData.district) {
          alert('Please select at least your state and district');
          return;
        }
      }
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission
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
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          qualification: formData.qualification,
          occupation: formData.occupation,
          // Send location names instead of IDs
          state: locationData.states.find(s => s.id === formData.state)?.name || formData.state,
          district: locationData.districts.find(d => d.id === formData.district)?.name || formData.district,
          mandal: locationData.mandals.find(m => m.id === formData.mandal)?.name || formData.mandal,
          panchayath: locationData.grampanchayats.find(g => g.id === formData.panchayath)?.name || formData.panchayath,
          referralSource: formData.referralSource
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

  const renderStepOne = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">✉</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Email & Password Setup</h2>
        <p className="text-white/80">Verify your email and create a secure password</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
          <div className="flex gap-2">
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => handleInputChange('email', e.target.value)}
              disabled={otpSent}
              className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
              placeholder="your.email@example.com"
            />
            {!otpSent && (
              <button
                onClick={sendOtp}
                disabled={isLoading || !formData.email}
                className="px-4 py-3 bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
            )}
          </div>
        </div>

        {otpSent && !emailVerified && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">Verification Code *</label>
            <div className="flex gap-2">
              <input 
                value={formData.otp} 
                onChange={e => handleInputChange('otp', e.target.value)}
                maxLength={6}
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200 text-center font-mono tracking-wider"
                placeholder="000000"
              />
              <button
                onClick={verifyOtp}
                disabled={isLoading || !formData.otp}
                className="px-4 py-3 bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <button
              onClick={sendOtp}
              disabled={isLoading}
              className="mt-2 text-[#FFEB3B] hover:text-yellow-300 text-sm transition-colors duration-200"
            >
              Resend Code
            </button>
          </div>
        )}

        {emailVerified && (
          <div className="space-y-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm font-medium">✓ Email verified successfully!</p>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password *</label>
              <input 
                type="password" 
                value={formData.password} 
                onChange={e => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                placeholder="Create a strong password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password *</label>
              <input 
                type="password" 
                value={formData.confirmPassword} 
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-white/80">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">First Name *</label>
          <input 
            value={formData.firstName} 
            onChange={e => handleInputChange('firstName', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Last Name *</label>
          <input 
            value={formData.lastName} 
            onChange={e => handleInputChange('lastName', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Enter your last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Date of Birth *</label>
          <input 
            type="date" 
            value={formData.dateOfBirth} 
            onChange={e => handleInputChange('dateOfBirth', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Gender</label>
          <Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              <SelectItem value="male" className="text-white hover:bg-white/20 focus:bg-white/20">Male</SelectItem>
              <SelectItem value="female" className="text-white hover:bg-white/20 focus:bg-white/20">Female</SelectItem>
              <SelectItem value="other" className="text-white hover:bg-white/20 focus:bg-white/20">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
          <input 
            value={formData.phone} 
            onChange={e => handleInputChange('phone', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Highest Educational Qualification</label>
          <Select value={formData.qualification} onValueChange={v => handleInputChange('qualification', v)}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              <SelectItem value="no-formal-education" className="text-white hover:bg-white/20 focus:bg-white/20">No Formal Education</SelectItem>
              <SelectItem value="10th" className="text-white hover:bg-white/20 focus:bg-white/20">10th Grade</SelectItem>
              <SelectItem value="12th" className="text-white hover:bg-white/20 focus:bg-white/20">12th Grade</SelectItem>
              <SelectItem value="diploma" className="text-white hover:bg-white/20 focus:bg-white/20">Diploma</SelectItem>
              <SelectItem value="bachelor" className="text-white hover:bg-white/20 focus:bg-white/20">Bachelor's Degree</SelectItem>
              <SelectItem value="master" className="text-white hover:bg-white/20 focus:bg-white/20">Master's Degree</SelectItem>
              <SelectItem value="phd" className="text-white hover:bg-white/20 focus:bg-white/20">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Occupation</label>
        <input 
          value={formData.occupation} 
          onChange={e => handleInputChange('occupation', e.target.value)} 
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
          placeholder="Your current occupation"
        />
      </div>
    </div>
  );
  
  const renderAddressInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">📍</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Address Information</h2>
        <p className="text-white/80">Where are you located?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">State *</label>
          <Select value={formData.state} onValueChange={v => handleInputChange('state', v)}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              {locationData.states.map(state => (
                <SelectItem key={state.id} value={state.id} className="text-white hover:bg-white/20 focus:bg-white/20">{state.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">District *</label>
          <Select value={formData.district} onValueChange={v => handleInputChange('district', v)} disabled={!formData.state}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              {locationData.districts.map(district => (
                <SelectItem key={district.id} value={district.id} className="text-white hover:bg-white/20 focus:bg-white/20">{district.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Mandal</label>
          <Select value={formData.mandal} onValueChange={v => handleInputChange('mandal', v)} disabled={!formData.district}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select your mandal" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              {locationData.mandals.map(mandal => (
                <SelectItem key={mandal.id} value={mandal.id} className="text-white hover:bg-white/20 focus:bg-white/20">{mandal.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Gram Panchayat</label>
          <Select value={formData.panchayath} onValueChange={v => handleInputChange('panchayath', v)} disabled={!formData.mandal}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select your gram panchayat" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              {locationData.grampanchayats.map(gp => (
                <SelectItem key={gp.id} value={gp.id} className="text-white hover:bg-white/20 focus:bg-white/20">{gp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
  
  const renderReferralInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">ℹ️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">How did you find us?</h2>
        <p className="text-white/80">Help us understand you better</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">How did you hear about us?</label>
        <Select value={formData.referralSource} onValueChange={v => handleInputChange('referralSource', v)}>
          <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
            <SelectValue placeholder="Select how you heard about us" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
            <SelectItem value="social-media" className="text-white hover:bg-white/20 focus:bg-white/20">Social Media</SelectItem>
            <SelectItem value="friend-family" className="text-white hover:bg-white/20 focus:bg-white/20">Friend/Family</SelectItem>
            <SelectItem value="google-search" className="text-white hover:bg-white/20 focus:bg-white/20">Google Search</SelectItem>
            <SelectItem value="advertisement" className="text-white hover:bg-white/20 focus:bg-white/20">Advertisement</SelectItem>
            <SelectItem value="news-article" className="text-white hover:bg-white/20 focus:bg-white/20">News Article</SelectItem>
            <SelectItem value="government-office" className="text-white hover:bg-white/20 focus:bg-white/20">Government Office</SelectItem>
            <SelectItem value="other" className="text-white hover:bg-white/20 focus:bg-white/20">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const getStepName = () => {
    switch(currentStep) {
      case 1: return 'Email & Password';
      case 2: return 'Personal Info';
      case 3: return 'Address';
      case 4: return 'Final Details';
      default: return 'Setup';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#5C258D] to-[#4389A2] text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-white">
              clearmyfile.com
            </Link>
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded text-sm sm:text-base"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
              Create Your Account
            </h1>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-sm font-medium text-white/90">
                Step {currentStep} of 4
              </span>
              <span className="text-sm text-white/70">
                {getStepName()}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
              <div 
                className="bg-[#FFEB3B] h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Form Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-8">
            {currentStep === 1 && renderStepOne()}
            {currentStep === 2 && renderPersonalInfo()}
            {currentStep === 3 && renderAddressInfo()}
            {currentStep === 4 && renderReferralInfo()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} 
              disabled={currentStep === 1} 
              className="text-white border border-white font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              Previous
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isLoading || (currentStep === 1 && !emailVerified)} 
              className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {currentStep === 4 ? (isLoading ? 'Creating Account...' : 'Create Account') : 'Next Step'}
            </button>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20">
            <p className="text-sm text-white/80">
              Already have an account? 
              <Link 
                to="/login" 
                className="text-[#FFEB3B] hover:text-yellow-300 font-medium ml-1 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-[#FFEB3B]/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-[#5C258D]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default UnifiedSignup;