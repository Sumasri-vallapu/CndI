import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = ({ email }: { email: string }) => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/verify_otp/', { email, otp });
            localStorage.setItem('token', res.data.access);
            alert('Login successful');
            navigate('/protected');
        } catch {
            alert('Invalid OTP');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#5C258D] to-[#4389A2] text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFEB3B] rounded-full mb-6">
                            <span className="text-3xl">🔢</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Enter OTP</h1>
                        <p className="text-white/80">Enter the verification code sent to your email</p>
                    </div>
                    
                    <div className="space-y-6">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200 text-center text-xl font-mono tracking-wider"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <button
                            onClick={handleVerify}
                            className="w-full bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                        >
                            Verify OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
