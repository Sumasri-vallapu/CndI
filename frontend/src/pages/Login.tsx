import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                navigate('/protected');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
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
                            onClick={() => navigate('/signup')}
                            className="bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded text-sm sm:text-base"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-lg text-white/80">Sign in to your account</p>
                    </div>
                    
                    {/* Form */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                            
                            <div className="text-center pt-4 border-t border-white/20">
                                <p className="text-sm text-white/80">
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/signup" 
                                        className="text-[#FFEB3B] hover:text-yellow-300 font-medium transition-colors duration-200"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-[#FFEB3B] hover:text-yellow-300 font-medium transition-colors duration-200"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 bg-[#FFEB3B]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-[#5C258D]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
    );
};

export default Login;