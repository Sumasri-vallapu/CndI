import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png';

const Login = ({ onOtpSent }: { onOtpSent: (email: string) => void }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/send_otp/', { email, name });
            alert('OTP sent to your email');
            onOtpSent(email);
            navigate('/verify');
        } catch {
            alert('Failed to send OTP');
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: '#f5f5f5',  // Replaced gradient with light grey background
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    width: '100%',
                    maxWidth: '320px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <img
                        src={logo}
                        alt="ClearMyFiles.org"
                        style={{ width: '40px', height: '40px', marginRight: '0.5rem' }}
                    />
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#3a1c71' }}>
                            ClearMyFiles.org
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#3a1c71' }}>
                            Make Your Voice Count
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3a1c71', marginBottom: '0.75rem', textAlign: 'center' }}>
                    Login to proceed
                </h3>
                <p style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Login With Gmail
                </p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ccc',
                        marginBottom: '0.75rem',
                    }}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ccc',
                        marginBottom: '1rem',
                    }}
                />
                <button
                    onClick={handleSendOtp}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#3a1c71',
                        color: '#fff',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Send OTP
                </button>
            </div>
        </div>
    );
};

export default Login;
