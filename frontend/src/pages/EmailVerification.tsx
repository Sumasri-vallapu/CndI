import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(!!location.state?.email);

  const sendOtp = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: 'Friend' })
      });
      if (res.ok) {
        alert('Verification code sent to your email');
        setShowOtpInput(true);
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
    if (!otp) {
      alert('Please enter the verification code');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      if (res.ok) {
        // Navigate to password setup with verified email
        navigate('/set-password', { state: { email, verified: true } });
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
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFEB3B] rounded-full mb-6">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {!showOtpInput ? 'Get Started' : 'Check Your Email'}
            </h1>
            <p className="text-white/80 text-lg">
              {!showOtpInput 
                ? 'Enter your email to create your account' 
                : 'We sent a verification code to your email'
              }
            </p>
          </div>
          
          {/* Form Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-8">
            {!showOtpInput ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Email Address *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                  />
                </div>
                
                <button 
                  onClick={sendOtp} 
                  disabled={isLoading || !email} 
                  className="w-full bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-white text-center">
                    Verification code sent to:
                    <br/>
                    <span className="font-bold text-[#FFEB3B]">{email}</span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-lg font-bold text-white text-center">
                    <span className="mr-2">🔢</span>
                    Enter Verification Code
                  </label>
                  <input 
                    value={otp} 
                    onChange={e => setOtp(e.target.value)} 
                    maxLength={6} 
                    className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest" 
                    placeholder="000000"
                    disabled={isLoading}
                  />
                </div>
                
                <button 
                  onClick={verifyOtp} 
                  disabled={isLoading || !otp} 
                  className="w-full bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
                
                <button 
                  onClick={() => setShowOtpInput(false)} 
                  className="w-full text-white border border-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Change Email
                </button>
                
                <button 
                  onClick={sendOtp} 
                  disabled={isLoading} 
                  className="w-full text-white font-semibold py-2 px-4 hover:bg-white/10 transition-all duration-200 text-sm"
                >
                  {isLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="text-center">
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

export default EmailVerification;