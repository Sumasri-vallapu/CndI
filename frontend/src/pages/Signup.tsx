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
        alert('OTP sent to your email!');
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
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Personal Information</h2>
        <p className="text-lg text-gray-600">Tell us about yourself to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">First Name *</label>
          <input 
            value={formData.firstName} 
            onChange={e => handleInputChange('firstName', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Last Name *</label>
          <input 
            value={formData.lastName} 
            onChange={e => handleInputChange('lastName', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="Enter your last name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Email Address *</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={e => handleInputChange('email', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Phone Number</label>
          <input 
            value={formData.phone} 
            onChange={e => handleInputChange('phone', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="+91 98765 43210"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Gender</label>
          <Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              <SelectItem value="female" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Female</SelectItem>
              <SelectItem value="male" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Male</SelectItem>            
              <SelectItem value="other" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Date of Birth</label>
          <input 
            type="date" 
            value={formData.dateOfBirth} 
            onChange={e => handleInputChange('dateOfBirth', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
          />
        </div>

        {/* Occupation */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Occupation</label>
          <input 
            value={formData.occupation} 
            onChange={e => handleInputChange('occupation', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="Your current occupation"
          />
        </div>

        {/* Qualification */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Highest Qualification</label>
          <Select value={formData.qualification} onValueChange={v => handleInputChange('qualification', v)}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium">
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              <SelectItem value="10th" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">10th Grade</SelectItem>
              <SelectItem value="12th" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">12th Grade</SelectItem>
              <SelectItem value="diploma" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Diploma</SelectItem>
              <SelectItem value="bachelor" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Bachelor's Degree</SelectItem>
              <SelectItem value="master" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Master's Degree</SelectItem>
              <SelectItem value="phd" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800">Password *</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={e => handleInputChange('password', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="Create a strong password"
          />
          {formData.password && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-700 font-medium">Password Strength:</span>
                <span className={`font-bold ${
                  passwordStrength.feedback === 'Weak' ? 'text-red-500' :
                  passwordStrength.feedback === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {passwordStrength.feedback}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    passwordStrength.feedback === 'Weak' ? 'bg-red-500' :
                    passwordStrength.feedback === 'Medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800">Confirm Password *</label>
          <input 
            type="password" 
            value={formData.confirmPassword} 
            onChange={e => handleInputChange('confirmPassword', e.target.value)} 
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium"
            placeholder="Re-enter your password"
          />
          {formData.confirmPassword && !passwordMatch && 
            <div className="flex items-center mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-700 text-sm font-medium">Passwords do not match</span>
            </div>
          }
        </div>
      </div>
    </div>
  );
  
  const renderSection2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Address Information</h2>
        <p className="text-lg text-gray-600">Help us know where you're located</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">State</label>
          <Select value={formData.state} onValueChange={v => handleInputChange('state', v)}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              {locationData.states.map(state => (
                <SelectItem key={state.id} value={state.id} className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">{state.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">District</label>
          <Select value={formData.district} onValueChange={v => handleInputChange('district', v)} disabled={!formData.state}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              {locationData.districts.map(district => (
                <SelectItem key={district.id} value={district.id} className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">{district.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Mandal</label>
          <Select value={formData.mandal} onValueChange={v => handleInputChange('mandal', v)} disabled={!formData.district}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your mandal" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              {locationData.mandals.map(mandal => (
                <SelectItem key={mandal.id} value={mandal.id} className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">{mandal.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">Gram Panchayat</label>
          <Select value={formData.panchayath} onValueChange={v => handleInputChange('panchayath', v)} disabled={!formData.mandal}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue placeholder="Select your gram panchayat" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              {locationData.grampanchayats.map(gp => (
                <SelectItem key={gp.id} value={gp.id} className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">{gp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
  
  const renderSection3 = () => (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Additional Information</h2>
        <p className="text-lg text-gray-600">Help us understand you better</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">How did you hear about us?</label>
          <Select value={formData.referralSource} onValueChange={v => handleInputChange('referralSource', v)}>
            <SelectTrigger className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-base font-medium">
              <SelectValue placeholder="Select how you heard about us" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl">
              <SelectItem value="social-media" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Social Media</SelectItem>
              <SelectItem value="friend-family" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Friend/Family</SelectItem>
              <SelectItem value="google-search" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Google Search</SelectItem>
              <SelectItem value="advertisement" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Advertisement</SelectItem>
              <SelectItem value="news-article" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">News Article</SelectItem>
              <SelectItem value="government-office" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Government Office</SelectItem>
              <SelectItem value="other" className="text-gray-900 hover:bg-indigo-50 focus:bg-indigo-50 rounded-xl m-1 py-3">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderOtpVerification = () => (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Check Your Email!</h2>
        <p className="text-xl text-gray-600">We sent you something special ✨</p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-8 text-center shadow-xl">
        <p className="text-lg text-gray-800 leading-relaxed">
          We've sent a <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">6-digit code</span> to
          <br/>
          <span className="font-bold text-indigo-700 text-xl">{formData.email}</span> 🎉
        </p>
      </div>
      
      <div className="space-y-6">
        <label className="block text-xl font-bold text-gray-900 text-center">
          🔢 Enter Your Verification Code
        </label>
        <input 
          value={otp} 
          onChange={e => setOtp(e.target.value)} 
          maxLength={6} 
          className="w-full px-6 py-6 bg-gray-50 border-2 border-gray-200 rounded-3xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-center text-3xl font-mono tracking-widest shadow-lg font-bold" 
          placeholder="000000"
        />
      </div>
      
      <button 
        onClick={sendOtp} 
        disabled={isLoading} 
        className="w-full text-gray-600 border-2 border-gray-300 bg-white hover:bg-gray-50 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isLoading ? 'Sending...' : 'Resend Code'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ClearMyFile
            </Link>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Create Your Account
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust ClearMyFile for secure document verification
            </p>
          </div>
          
          {/* Modern Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-semibold text-gray-800">
                {showOtpVerification ? 'Email Verification' : `Step ${currentStep} of 3`}
              </span>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {showOtpVerification ? 'Verify your email address' : 
                  currentStep === 1 ? 'Personal Information' : 
                  currentStep === 2 ? 'Address Information' : 'Additional Information'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${showOtpVerification ? 100 : (currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/50 mb-8">
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
              className="text-gray-600 border-2 border-gray-300 bg-white hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 shadow-lg hover:shadow-xl"
            >
              {showOtpVerification ? 'Back to Form' : 'Previous'}
            </button>
            {showOtpVerification ? (
              <button 
                onClick={handleSubmit} 
                disabled={isLoading || !otp} 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            ) : currentStep < 3 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)} 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 order-1 sm:order-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isLoading} 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            )}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200/50">
            <p className="text-base text-gray-600">
              Already have an account? 
              <Link 
                to="/login" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold ml-2 transition-colors duration-300"
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

export default Signup;