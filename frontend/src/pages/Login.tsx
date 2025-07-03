import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ENDPOINTS } from '../utils/api';

const PROFESSIONAL_GRADIENT = "linear-gradient(135deg, #1e3a8a, #3b82f6, #60a5fa)";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="bg-white shadow-xl border-0">
                    <CardHeader className="text-center bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                        <CardTitle className="text-3xl font-semibold text-slate-800">Welcome Back</CardTitle>
                        <p className="text-slate-600 mt-2">Sign in to your account</p>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <Button
                            onClick={handleLogin}
                            disabled={isLoading}
                            style={{ background: PROFESSIONAL_GRADIENT }}
                            className="w-full h-11 text-white font-medium"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <div className="text-center pt-4 border-t border-slate-200">
                            <p className="text-sm text-slate-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
