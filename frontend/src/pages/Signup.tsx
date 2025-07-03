import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { ENDPOINTS } from '../utils/api';

interface FormData {
  // Personal Information
  name: string;
  gender: string;
  occupation: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  qualification: string;
  password: string;
  confirmPassword: string;
  
  // Address Information
  state: string;
  district: string;
  mandal: string;
  panchayath: string;
  
  // Referral Source
  referralSource: string;
}

interface LocationData {
  states: Array<{id: number; name: string}>;
  districts: Array<{id: number; name: string; state_id: number}>;
  mandals: Array<{id: number; name: string; district_id: number}>;
  grampanchayats: Array<{id: number; name: string; mandal_id: number}>;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    occupation: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    qualification: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    mandal: '',
    panchayath: '',
    referralSource: ''
  });

  const [locationData, setLocationData] = useState<LocationData>({
    states: [],
    districts: [],
    mandals: [],
    grampanchayats: []
  });

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Load location data
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch(ENDPOINTS.GET_STATES);
      const data = await response.json();
      setLocationData(prev => ({ ...prev, states: data }));
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchDistricts = async (stateId: number) => {
    try {
      const response = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`);
      const data = await response.json();
      setLocationData(prev => ({ ...prev, districts: data, mandals: [], grampanchayats: [] }));
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const fetchMandals = async (districtId: number) => {
    try {
      const response = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`);
      const data = await response.json();
      setLocationData(prev => ({ ...prev, mandals: data, grampanchayats: [] }));
    } catch (error) {
      console.error('Failed to fetch mandals:', error);
    }
  };

  const fetchGrampanchayats = async (mandalId: number) => {
    try {
      const response = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
      const data = await response.json();
      setLocationData(prev => ({ ...prev, grampanchayats: data }));
    } catch (error) {
      console.error('Failed to fetch grampanchayats:', error);
    }
  };

  // Password strength validation
  const validatePassword = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) feedback = 'Weak';
    else if (score <= 4) feedback = 'Medium';
    else feedback = 'Strong';

    setPasswordStrength({ score: (score / 5) * 100, feedback });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Handle location cascading
    if (field === 'state') {
      const selectedState = locationData.states.find(s => s.name === value);
      if (selectedState) {
        fetchDistricts(selectedState.id);
        setFormData(prev => ({ ...prev, district: '', mandal: '', panchayath: '' }));
      }
    } else if (field === 'district') {
      const selectedDistrict = locationData.districts.find(d => d.name === value);
      if (selectedDistrict) {
        fetchMandals(selectedDistrict.id);
        setFormData(prev => ({ ...prev, mandal: '', panchayath: '' }));
      }
    } else if (field === 'mandal') {
      const selectedMandal = locationData.mandals.find(m => m.name === value);
      if (selectedMandal) {
        fetchGrampanchayats(selectedMandal.id);
        setFormData(prev => ({ ...prev, panchayath: '' }));
      }
    }

    // Password validation
    if (field === 'password') {
      validatePassword(value);
    }
    if (field === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name
        }),
      });

      if (response.ok) {
        setShowOtpVerification(true);
        alert('OTP sent to your email!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
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
      const response = await fetch(ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          otp: otp
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        alert('Account created successfully!');
        navigate('/protected');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!showOtpVerification) {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Please fill in all required fields');
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
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#7A3D1A]">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              placeholder="Your occupation"
            />
          </div>
          <div>
            <Label htmlFor="qualification">Highest Qualification</Label>
            <Select value={formData.qualification} onValueChange={(value) => handleInputChange('qualification', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Your phone number"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
            />
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.feedback === 'Weak' ? 'text-red-600' :
                    passwordStrength.feedback === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
                <Progress value={passwordStrength.score} className="mt-1" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && !passwordMatch && (
              <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection2 = () => (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#7A3D1A]">Address Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {locationData.states.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="district">District</Label>
            <Select 
              value={formData.district} 
              onValueChange={(value) => handleInputChange('district', value)}
              disabled={!formData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {locationData.districts.map((district) => (
                  <SelectItem key={district.id} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mandal">Mandal</Label>
            <Select 
              value={formData.mandal} 
              onValueChange={(value) => handleInputChange('mandal', value)}
              disabled={!formData.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mandal" />
              </SelectTrigger>
              <SelectContent>
                {locationData.mandals.map((mandal) => (
                  <SelectItem key={mandal.id} value={mandal.name}>
                    {mandal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="panchayath">Panchayath/Municipality</Label>
            <Select 
              value={formData.panchayath} 
              onValueChange={(value) => handleInputChange('panchayath', value)}
              disabled={!formData.mandal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select panchayath" />
              </SelectTrigger>
              <SelectContent>
                {locationData.grampanchayats.map((gp) => (
                  <SelectItem key={gp.id} value={gp.name}>
                    {gp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection3 = () => (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#7A3D1A]">How did you hear about us?</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="referralSource">Referral Source</Label>
          <Select value={formData.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select how you heard about us" />
            </SelectTrigger>
            <SelectContent>
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
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#7A3D1A]">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          We've sent a verification code to <strong>{formData.email}</strong>
        </p>
        <div>
          <Label htmlFor="otp">Enter 6-digit code</Label>
          <Input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={6}
            className="text-center text-lg font-mono"
          />
        </div>
        <Button
          variant="outline"
          onClick={sendOtp}
          disabled={isLoading}
          className="w-full"
        >
          Resend Code
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A3D1A] via-[#A86543] to-[#7A3D1A] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">
              {showOtpVerification ? 'Email Verification' : `Step ${currentStep} of 3`}
            </span>
            <span className="text-white/80 text-sm">
              {showOtpVerification ? 'Verify your email address' :
               currentStep === 1 ? 'Personal Information' : 
               currentStep === 2 ? 'Address Details' : 
               'Final Step'}
            </span>
          </div>
          <Progress 
            value={showOtpVerification ? 100 : (currentStep / 3) * 100} 
            className="h-2" 
          />
        </div>

        {/* Form Sections */}
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
            variant="outline"
            onClick={showOtpVerification ? () => setShowOtpVerification(false) : prevStep}
            disabled={!showOtpVerification && currentStep === 1}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {showOtpVerification ? 'Back to Form' : 'Previous'}
          </Button>
          
          {showOtpVerification ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !otp}
              className="bg-white text-[#7A3D1A] hover:bg-white/90 font-medium"
            >
              {isLoading ? 'Verifying...' : 'Verify & Create Account'}
            </Button>
          ) : currentStep < 3 ? (
            <Button
              onClick={nextStep}
              className="bg-white text-[#7A3D1A] hover:bg-white/90 font-medium"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-white text-[#7A3D1A] hover:bg-white/90 font-medium"
            >
              {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;