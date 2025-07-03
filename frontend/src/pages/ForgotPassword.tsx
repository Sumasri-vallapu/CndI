import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ENDPOINTS } from '../utils/api';

const PRIMARY_GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";
const SUCCESS_GRADIENT = "linear-gradient(135deg, #059669 0%, #10b981 100%)";

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
            console.log('Error type:', error.constructor.name);
            console.log('Error message:', error.message);
            alert(`Network error: ${error.message}. Make sure your backend server is running on http://localhost:8000`);
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
        <Card className="bg-white shadow-lg border">
            <CardHeader className="text-center border-b bg-slate-50">
                <CardTitle className="text-2xl font-semibold text-slate-900">
                    Forgot Password
                </CardTitle>
                <p className="text-slate-600 mt-2">Enter your email to receive a reset code</p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email address"
                        className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                </div>
                
                <Button
                    onClick={sendResetOtp}
                    disabled={isLoading}
                    className="w-full h-11 text-white font-medium"
                    style={{ background: PRIMARY_GRADIENT }}
                >
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                </Button>
                
                <div className="text-center pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Remember your password?{' '}
                        <Link 
                            to="/login" 
                            className="font-medium text-purple-600 hover:text-purple-800"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    const renderOtpAndPasswordStep = () => (
        <Card className="bg-white shadow-lg border">
            <CardHeader className="text-center border-b bg-slate-50">
                <CardTitle className="text-2xl font-semibold text-slate-900">
                    Reset Password
                </CardTitle>
                <p className="text-slate-600 mt-2">Enter the code and your new password</p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-slate-700 text-center">
                        We've sent a verification code to <strong className="text-blue-600">{email}</strong>
                    </p>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium text-slate-700">
                        Verification Code
                    </Label>
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500 text-center font-mono tracking-wider"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                        New Password
                    </Label>
                    <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                        Confirm New Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-red-600 text-sm">Passwords do not match</p>
                    )}
                </div>
                
                <div className="flex gap-4">
                    <Button
                        onClick={sendResetOtp}
                        disabled={isLoading}
                        variant="outline"
                        className="flex-1 h-11 border-slate-300 text-slate-600 hover:bg-slate-50"
                    >
                        Resend Code
                    </Button>
                    <Button
                        onClick={verifyOtpAndResetPassword}
                        disabled={isLoading}
                        className="flex-1 h-11 text-white font-medium"
                        style={{ background: SUCCESS_GRADIENT }}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </div>
                
                <div className="text-center pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                        Remember your password?{' '}
                        <Link 
                            to="/login" 
                            className="font-medium text-purple-600 hover:text-purple-800"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
                            clearmyfile.org
                        </Link>
                        <div className="flex gap-4">
                            <Button 
                                onClick={() => navigate('/login')}
                                variant="outline"
                                className="border-purple-600 text-purple-600 hover:bg-purple-50"
                            >
                                Back to Login
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md">
                    {step === 1 ? renderEmailStep() : renderOtpAndPasswordStep()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;