import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const sendResetOtp = async () => {
        if (!email) {
            alert('Please enter your email address');
            return;
        }

        setIsLoading(true);
        console.log('Attempting to send reset OTP to:', email);
        console.log('Using endpoint:', ENDPOINTS.FORGOT_PASSWORD);
        
        try {
            const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                alert('Password reset code sent! Check your email and backend console logs for the OTP.');
                setStep(2);
            } else {
                if (response.status === 404) {
                    alert('No account found with this email address. Please check your email or create a new account.');
                } else {
                    alert(responseData.error || 'Failed to send reset code. Please try again.');
                }
                console.error('Reset error:', responseData);
            }
        } catch (error) {
            console.error('Network error details:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('Error type:', error instanceof Error ? error.constructor.name : 'Unknown');
            console.log('Error message:', errorMessage);
            alert(`Network error: ${errorMessage}. Make sure your backend server is running on http://localhost:8000`);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtpAndResetPassword = async () => {
        if (!otp) {
            alert('Please enter the verification code');
            return;
        }
        if (!newPassword || !confirmPassword) {
            alert('Please enter and confirm your new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    otp, 
                    new_password: newPassword 
                }),
            });

            if (response.ok) {
                alert('Password reset successfully! Please login with your new password.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset error:', error);
            alert('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderEmailStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFEB3B] rounded-full mb-6">
                    <span className="text-3xl">🔒</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Forgot Password
                </h1>
                <p className="text-lg text-white/80">Enter your email to receive a reset code</p>
            </div>
            
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                />
            </div>
            
            <button
                onClick={sendResetOtp}
                disabled={isLoading}
                className="w-full bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
            
            <div className="text-center pt-6 border-t border-white/20">
                <p className="text-sm text-white/80">
                    Remember your password?{' '}
                    <Link 
                        to="/login" 
                        className="text-[#FFEB3B] hover:text-yellow-300 font-medium transition-colors duration-200"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );

    const renderOtpAndPasswordStep = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFEB3B] rounded-full mb-6">
                    <span className="text-3xl">🔑</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Reset Password
                </h1>
                <p className="text-lg text-white/80">Enter the code and your new password</p>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-white text-center">
                    We've sent a verification code to <span className="font-bold text-[#FFEB3B]">{email}</span>
                </p>
            </div>
            
            <div>
                <label htmlFor="otp" className="block text-sm font-medium text-white mb-2">
                    Verification Code
                </label>
                <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200 text-center font-mono tracking-wider"
                />
            </div>
            
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
                    New Password
                </label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                />
            </div>
            
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                />
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Passwords do not match
                    </p>
                )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={sendResetOtp}
                    disabled={isLoading}
                    className="flex-1 text-white border border-white font-semibold py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
                >
                    Resend Code
                </button>
                <button
                    onClick={verifyOtpAndResetPassword}
                    disabled={isLoading}
                    className="flex-1 bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
            
            <div className="text-center pt-6 border-t border-white/20">
                <p className="text-sm text-white/80">
                    Remember your password?{' '}
                    <Link 
                        to="/login" 
                        className="text-[#FFEB3B] hover:text-yellow-300 font-medium transition-colors duration-200"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
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
                            Back to Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                        {step === 1 ? renderEmailStep() : renderOtpAndPasswordStep()}
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-[#FFEB3B]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-[#5C258D]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
    );
};

export default ForgotPassword;