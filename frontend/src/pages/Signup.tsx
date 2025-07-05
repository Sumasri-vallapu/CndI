import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { ENDPOINTS } from '../utils/api';
import { useLocationData } from '../hooks/useLocationData';

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  occupation: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  qualification: string;
  password: string;
  confirmPassword: string;
  referralSource: string;
  state: string;
  district: string;
  mandal: string;
  panchayath: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', gender: '', occupation: '', email: '', phone: '',
    dateOfBirth: '', qualification: '', password: '', confirmPassword: '',
    referralSource: '', state: '', district: '', mandal: '', panchayath: ''
  });
  const { locationData, fetchDistricts, fetchMandals, fetchGrampanchayats } = useLocationData();
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const validatePassword = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength({ score: (score / 5) * 100, feedback: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong' });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') validatePassword(value);
    if (field === 'confirmPassword') setPasswordMatch(value === formData.password);
    
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
        body: JSON.stringify({ email: formData.email, name: `${formData.firstName} ${formData.lastName}`.trim() })
      });
      if (res.ok) {
        alert('OTP sent');
        setShowOtpVerification(true);
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

  const verifyOtpAndSignup = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          otp,
          // Send location names instead of IDs
          state: locationData.states.find(s => s.id === formData.state)?.name || formData.state,
          district: locationData.districts.find(d => d.id === formData.district)?.name || formData.district,
          mandal: locationData.mandals.find(m => m.id === formData.mandal)?.name || formData.mandal,
          panchayath: locationData.grampanchayats.find(g => g.id === formData.panchayath)?.name || formData.panchayath
        })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        alert('Account created successfully!');
        navigate('/protected');
      } else {
        const err = await res.json();
        alert(err.error || 'Signup failed');
      }
    } catch {
      alert('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!showOtpVerification) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Please fill required fields');
        return;
      }
      if (!passwordMatch) {
        alert('Passwords do not match');
        return;
      }
      if (passwordStrength.score < 60) {
        alert('Please use a stronger password');
        return;
      }
      sendOtp();
    } else {
      verifyOtpAndSignup();
    }
  };


  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-white/80">Tell us about yourself</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">First Name *</label>
          <input 
            value={formData.firstName} 
            onChange={e => handleInputChange('firstName', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Last Name *</label>
          <input 
            value={formData.lastName} 
            onChange={e => handleInputChange('lastName', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Enter your last name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Gender</label>
          <Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              <SelectItem value="female" className="text-white hover:bg-white/20 focus:bg-white/20">Female</SelectItem>
              <SelectItem value="male" className="text-white hover:bg-white/20 focus:bg-white/20">Male</SelectItem>            
              <SelectItem value="other" className="text-white hover:bg-white/20 focus:bg-white/20">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Occupation</label>
          <input 
            value={formData.occupation} 
            onChange={e => handleInputChange('occupation', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Your current occupation"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Highest Qualification</label>
          <Select value={formData.qualification} onValueChange={v => handleInputChange('qualification', v)}>
            <SelectTrigger className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-r from-[#5C258D] to-[#4389A2] border-white/20 text-white">
              <SelectItem value="10th" className="text-white hover:bg-white/20 focus:bg-white/20">10th Grade</SelectItem>
              <SelectItem value="12th" className="text-white hover:bg-white/20 focus:bg-white/20">12th Grade</SelectItem>
              <SelectItem value="diploma" className="text-white hover:bg-white/20 focus:bg-white/20">Diploma</SelectItem>
              <SelectItem value="bachelor" className="text-white hover:bg-white/20 focus:bg-white/20">Bachelor's Degree</SelectItem>
              <SelectItem value="master" className="text-white hover:bg-white/20 focus:bg-white/20">Master's Degree</SelectItem>
              <SelectItem value="phd" className="text-white hover:bg-white/20 focus:bg-white/20">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Email Address *</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={e => handleInputChange('email', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="your.email@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Phone Number</label>
          <input 
            value={formData.phone} 
            onChange={e => handleInputChange('phone', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Enter your phone number"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Date of Birth</label>
          <input 
            type="date" 
            value={formData.dateOfBirth} 
            onChange={e => handleInputChange('dateOfBirth', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Password *</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={e => handleInputChange('password', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Create a strong password"
          />
          {formData.password && (
            <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Password Strength:</span>
                <span className={`font-medium ${
                  passwordStrength.feedback === 'Weak' ? 'text-red-400' :
                  passwordStrength.feedback === 'Medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {passwordStrength.feedback}
                </span>
              </div>
              <Progress value={passwordStrength.score} className="h-2" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Confirm Password *</label>
          <input 
            type="password" 
            value={formData.confirmPassword} 
            onChange={e => handleInputChange('confirmPassword', e.target.value)} 
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
            placeholder="Re-enter your password"
          />
          {formData.confirmPassword && !passwordMatch && 
            <p className="text-red-400 text-sm mt-2 flex items-center">
              <span className="mr-2">⚠️</span>
              Passwords do not match
            </p>
          }
        </div>
      </div>
    </div>
  );
  
  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">📍</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Address Information</h2>
        <p className="text-white/80">Where are you located?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">State</label>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">District</label>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Mandal</label>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Gram Panchayat</label>
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
  
  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FFEB3B] rounded-full mb-4">
          <span className="text-2xl">ℹ️</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Additional Information</h2>
        <p className="text-white/80">Help us understand you better</p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">How did you hear about us?</label>
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

  const renderOtpVerification = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFEB3B] rounded-full mb-6">
          <span className="text-3xl">✉️</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Check Your Email!</h2>
        <p className="text-white/80 text-lg">We sent you something special ✨</p>
      </div>
      
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <p className="text-white text-center text-lg leading-relaxed">
          We've sent a <span className="font-bold text-[#FFEB3B]">6-digit code</span> to
          <br/>
          <span className="font-bold text-[#FFEB3B] text-xl">{formData.email}</span> 🎉
        </p>
      </div>
      
      <div className="space-y-4">
        <label className="block text-lg font-bold text-white text-center">
          <span className="mr-2">🔢</span>
          Enter Your Verification Code
        </label>
        <input 
          value={otp} 
          onChange={e => setOtp(e.target.value)} 
          maxLength={6} 
          className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest" 
          placeholder="000000"
        />
      </div>
      
      <button 
        onClick={sendOtp} 
        disabled={isLoading} 
        className="w-full text-white border border-white font-semibold py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Resend Code'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#5C258D] to-[#4389A2] text-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-white">
              clearmyfile.org
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
                {showOtpVerification ? 'Email Verification' : `Step ${currentStep} of 3`}
              </span>
              <span className="text-sm text-white/70">
                {showOtpVerification ? 'Verify your email address' : 
                  currentStep === 1 ? 'Personal Information' : 
                  currentStep === 2 ? 'Address Information' : 'Additional Information'}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
              <div 
                className="bg-[#FFEB3B] h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${showOtpVerification ? 100 : (currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Form Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-8">
            {showOtpVerification ? renderOtpVerification() : (
              <>
                {currentStep === 1 && renderSection1()}
                {currentStep === 2 && renderSection2()}
                {currentStep === 3 && renderSection3()}
              </>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button 
              onClick={showOtpVerification ? () => setShowOtpVerification(false) : () => setCurrentStep(Math.max(1, currentStep - 1))} 
              disabled={!showOtpVerification && currentStep === 1} 
              className="text-white border border-white font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            >
              {showOtpVerification ? 'Back to Form' : 'Previous'}
            </button>
            {showOtpVerification ? (
              <button 
                onClick={handleSubmit} 
                disabled={isLoading || !otp} 
                className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            ) : currentStep < 3 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)} 
                className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 order-1 sm:order-2"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            )}
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

export default Signup;