import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { ENDPOINTS } from '../utils/api';
import { useLocationData } from '../hooks/useLocationData';

const PROFESSIONAL_GRADIENT = "linear-gradient(135deg, #1e3a8a, #3b82f6, #60a5fa)";

interface FormData {
  name: string;
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
    name: '', gender: '', occupation: '', email: '', phone: '',
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
        body: JSON.stringify({ email: formData.email, name: formData.name })
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
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">1</span>
          </div>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Full Name *</Label>
            <Input 
              value={formData.name} 
              onChange={e => handleInputChange('name', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Gender</Label>
            <Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Occupation</Label>
            <Input 
              value={formData.occupation} 
              onChange={e => handleInputChange('occupation', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your current occupation"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Highest Qualification</Label>
            <Select value={formData.qualification} onValueChange={v => handleInputChange('qualification', v)}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Email Address *</Label>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={e => handleInputChange('email', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Phone Number</Label>
            <Input 
              value={formData.phone} 
              onChange={e => handleInputChange('phone', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Date of Birth</Label>
            <Input 
              type="date" 
              value={formData.dateOfBirth} 
              onChange={e => handleInputChange('dateOfBirth', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Password *</Label>
            <Input 
              type="password" 
              value={formData.password} 
              onChange={e => handleInputChange('password', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Create a strong password"
            />
            {formData.password && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Password Strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.feedback === 'Weak' ? 'text-red-600' :
                    passwordStrength.feedback === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <Progress value={passwordStrength.score} className="h-2" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Confirm Password *</Label>
            <Input 
              type="password" 
              value={formData.confirmPassword} 
              onChange={e => handleInputChange('confirmPassword', e.target.value)} 
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Re-enter your password"
            />
            {formData.confirmPassword && !passwordMatch && 
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 bg-red-100 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-red-600 text-xs">!</span>
                </span>
                Passwords do not match
              </p>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const renderSection2 = () => (
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">2</span>
          </div>
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">State</Label>
            <Select value={formData.state} onValueChange={v => handleInputChange('state', v)}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60">
                {locationData.states.map(state => (
                  <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">District</Label>
            <Select value={formData.district} onValueChange={v => handleInputChange('district', v)} disabled={!formData.state}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your district" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60">
                {locationData.districts.map(district => (
                  <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Mandal</Label>
            <Select value={formData.mandal} onValueChange={v => handleInputChange('mandal', v)} disabled={!formData.district}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your mandal" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60">
                {locationData.mandals.map(mandal => (
                  <SelectItem key={mandal.id} value={mandal.id}>{mandal.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Gram Panchayat</Label>
            <Select value={formData.panchayath} onValueChange={v => handleInputChange('panchayath', v)} disabled={!formData.mandal}>
              <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your gram panchayat" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60">
                {locationData.grampanchayats.map(gp => (
                  <SelectItem key={gp.id} value={gp.id}>{gp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const renderSection3 = () => (
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">3</span>
          </div>
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">How did you hear about us?</Label>
          <Select value={formData.referralSource} onValueChange={v => handleInputChange('referralSource', v)}>
            <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select how you heard about us" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="friend-family">Friend/Family</SelectItem>
              <SelectItem value="google-search">Google Search</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="news-article">News Article</SelectItem>
              <SelectItem value="government-office">Government Office</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderOtpVerification = () => (
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-green-600 font-bold">✓</span>
          </div>
          Verify Your Email
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-slate-700 text-center">
            We've sent a 6-digit verification code to <strong className="text-blue-600">{formData.email}</strong>
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Enter Verification Code</Label>
          <Input 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            maxLength={6} 
            className="text-center text-xl font-mono h-14 border-slate-300 focus:border-blue-500 focus:ring-blue-500 tracking-widest" 
            placeholder="000000"
          />
        </div>
        <Button 
          onClick={sendOtp} 
          disabled={isLoading} 
          variant="outline"
          className="w-full h-11 border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          {isLoading ? 'Sending...' : 'Resend Code'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Create Your Account</h1>
          <p className="text-lg text-slate-600">Join our platform and get started today</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">
                {showOtpVerification ? 'Email Verification' : `Step ${currentStep} of 3`}
              </span>
            </div>
            <span className="text-sm text-slate-500">
              {showOtpVerification ? 'Almost done!' : 
                currentStep === 1 ? 'Personal Details' : 
                currentStep === 2 ? 'Address Information' : 'Final Step'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ 
                width: `${showOtpVerification ? 100 : (currentStep / 3) * 100}%`,
                background: PROFESSIONAL_GRADIENT
              }}
            />
          </div>
        </div>
        
        {/* Form Content */}
        {showOtpVerification ? renderOtpVerification() : (
          <>
            {currentStep === 1 && renderSection1()}
            {currentStep === 2 && renderSection2()}
            {currentStep === 3 && renderSection3()}
          </>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            onClick={showOtpVerification ? () => setShowOtpVerification(false) : () => setCurrentStep(Math.max(1, currentStep - 1))} 
            disabled={!showOtpVerification && currentStep === 1} 
            variant="outline"
            className="h-11 px-8 border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            {showOtpVerification ? 'Back to Form' : 'Previous'}
          </Button>
          {showOtpVerification ? (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !otp} 
              className="h-11 px-8 text-white font-medium"
              style={{ background: PROFESSIONAL_GRADIENT }}
            >
              {isLoading ? 'Verifying...' : 'Verify & Create Account'}
            </Button>
          ) : currentStep < 3 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)} 
              className="h-11 px-8 text-white font-medium"
              style={{ background: PROFESSIONAL_GRADIENT }}
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="h-11 px-8 text-white font-medium"
              style={{ background: PROFESSIONAL_GRADIENT }}
            >
              {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
            </Button>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Already have an account? 
            <button 
              onClick={() => navigate('/login')} 
              className="text-blue-600 hover:text-blue-800 font-medium ml-1"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
