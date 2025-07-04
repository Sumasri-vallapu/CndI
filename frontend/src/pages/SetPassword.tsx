import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Progress } from '../components/ui/progress';

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    // Redirect if no verified email
    if (!location.state?.verified || !location.state?.email) {
      navigate('/email-verification');
      return;
    }
  }, [location.state, navigate]);

  const validatePassword = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength({ 
      score: (score / 5) * 100, 
      feedback: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong' 
    });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }
    if (!passwordMatch) {
      alert('Passwords do not match');
      return;
    }
    if (passwordStrength.score < 60) {
      alert('Please use a stronger password');
      return;
    }

    // Navigate to personal info collection with email and password
    navigate('/complete-profile', { 
      state: { 
        email, 
        password,
        step: 'personal' 
      } 
    });
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
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Set Your Password
            </h1>
            <p className="text-white/80 text-lg">
              Create a secure password for your account
            </p>
            <p className="text-white/60 text-sm mt-2">
              Email: <span className="text-[#FFEB3B]">{email}</span>
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-white/90">
                Step 1 of 4
              </span>
              <span className="text-sm text-white/70">
                Password Setup
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-[#FFEB3B] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: '25%' }}
              />
            </div>
          </div>
          
          {/* Form Content */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Password *</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => handlePasswordChange(e.target.value)} 
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                />
                {password && (
                  <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/80">Password Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.feedback === 'Weak' ? 'text-red-400' :
                        passwordStrength.feedback === 'Medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                    <Progress value={passwordStrength.score} className="h-2" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Confirm Password *</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => handleConfirmPasswordChange(e.target.value)} 
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#FFEB3B] focus:border-transparent transition-all duration-200"
                  placeholder="Re-enter your password"
                />
                {confirmPassword && !passwordMatch && 
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Passwords do not match
                  </p>
                }
              </div>

              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Password Requirements:</h4>
                <ul className="text-white/80 text-sm space-y-1">
                  <li className="flex items-center">
                    <span className={password.length >= 8 ? "text-green-400" : "text-white/60"}>
                      {password.length >= 8 ? "✓" : "○"}
                    </span>
                    <span className="ml-2">At least 8 characters</span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[A-Z]/.test(password) ? "text-green-400" : "text-white/60"}>
                      {/[A-Z]/.test(password) ? "✓" : "○"}
                    </span>
                    <span className="ml-2">One uppercase letter</span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[a-z]/.test(password) ? "text-green-400" : "text-white/60"}>
                      {/[a-z]/.test(password) ? "✓" : "○"}
                    </span>
                    <span className="ml-2">One lowercase letter</span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[0-9]/.test(password) ? "text-green-400" : "text-white/60"}>
                      {/[0-9]/.test(password) ? "✓" : "○"}
                    </span>
                    <span className="ml-2">One number</span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : "text-white/60"}>
                      {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}
                    </span>
                    <span className="ml-2">One special character</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={handleSubmit} 
                disabled={!password || !confirmPassword || !passwordMatch || passwordStrength.score < 60} 
                className="w-full bg-[#FFEB3B] hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Profile
              </button>
            </div>
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

export default SetPassword;