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
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)'
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Enter OTP</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    className="border border-gray-300 p-2 mb-4 w-full rounded"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button
                    onClick={handleVerify}
                    className="bg-[#3a1c71] hover:bg-[#5b2d91] text-white px-4 py-2 rounded w-full"
                >
                    Verify OTP
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp;
