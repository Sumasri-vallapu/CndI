import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Protected = () => {
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/protected/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setMsg(res.data.message))
            .catch(() => {
                alert('Access denied or token expired');
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#5C258D] to-[#4389A2] text-white">
            {/* Navigation */}
            <nav className="border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl sm:text-2xl font-bold text-white">
                            clearmyfile.org
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded text-sm sm:text-base"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-2xl text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFEB3B] rounded-full mb-8">
                            <span className="text-4xl">🎉</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Welcome!
                        </h1>
                        <p className="text-xl text-white/80 mb-8">
                            You have successfully accessed the protected area.
                        </p>
                        {msg && (
                            <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                                <p className="text-white text-lg">{msg}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Protected;
