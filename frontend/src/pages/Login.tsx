import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ENDPOINTS } from '../utils/api';

const PRIMARY_GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";

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
                                onClick={() => navigate('/signup')}
                                variant="outline"
                                className="border-purple-600 text-purple-600 hover:bg-purple-50"
                            >
                                Create Account
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-md">
                    <Card className="bg-white shadow-lg border">
                        <CardHeader className="text-center border-b bg-slate-50">
                            <CardTitle className="text-2xl font-semibold text-slate-900">
                                Welcome Back
                            </CardTitle>
                            <p className="text-slate-600 mt-2">Sign in to your account</p>
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
                                    placeholder="Enter your email address"
                                    className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="h-11 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            
                            <Button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full h-11 text-white font-medium"
                                style={{ background: PRIMARY_GRADIENT }}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                            
                            <div className="text-center pt-4 border-t border-slate-200">
                                <p className="text-sm text-slate-600">
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/signup" 
                                        className="font-medium text-purple-600 hover:text-purple-800"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;