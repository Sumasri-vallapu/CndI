import React from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, LogIn, Home } from 'lucide-react';

const AccountApproved: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get user role from URL params, location state, or localStorage
  const role = searchParams.get('role') || location.state?.role || localStorage.getItem('userRole') || 'host';
  const loginPath = role === 'speaker' ? '/speaker-login' : '/host-login';

  const handleGoToLogin = () => {
    // Clear any old tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate(loginPath);
  };

  const handleBackToHome = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#27465C] flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#27465C] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-white">
              C&I
            </Link>
            <button
              onClick={handleBackToHome}
              className="bg-white text-black font-medium hover:bg-gray-100 transition rounded px-4 py-1.5 text-sm flex items-center gap-2"
            >
              <Home size={16} />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 py-8 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {/* Success Icon with Animation */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 p-4 rounded-full border-2 border-green-500/30 animate-pulse">
                <CheckCircle size={48} className="text-green-400" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-white mb-3">
                🎉 Congratulations!
              </h1>
              <p className="text-xl text-green-400 font-bold mb-2">
                Your Account Has Been Approved!
              </p>
              <p className="text-base text-white/80 font-normal">
                Welcome to Connect & Inspire
              </p>
            </div>

            {/* Content */}
            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <div className="space-y-4 text-white/80">
                <p className="text-base leading-relaxed">
                  Great news! Your account has been reviewed and <span className="text-green-400 font-semibold">approved</span> by our admin team.
                </p>
                <p className="text-base leading-relaxed">
                  You now have full access to all features on the Connect & Inspire platform. You can log in and start {role === 'speaker' ? 'accepting speaking requests' : 'posting speaking requests'} right away!
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={20} />
                What's next?
              </h2>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">1.</span>
                  <span>Click the "Go to Login" button below</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">2.</span>
                  <span>Log in with your email and password</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">3.</span>
                  <span>Complete your profile and start connecting!</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full bg-green-600 text-white font-semibold hover:bg-green-700 transition rounded-lg px-6 py-3.5 text-base flex items-center justify-center gap-2 border border-green-500/50 shadow-lg shadow-green-900/20"
              >
                <LogIn size={20} />
                Go to Login
              </button>

              <div className="text-center">
                <p className="text-white/70 text-sm mb-3">
                  Have questions or need assistance?
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-white/20 text-white font-medium hover:bg-white/30 transition rounded-lg px-6 py-2.5 text-sm border border-white/30"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Email Confirmation Note */}
          <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 mt-4 border border-blue-500/20">
            <p className="text-white/80 text-sm text-center">
              📧 You should have received an approval confirmation email as well. Check your inbox!
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <button
              onClick={handleBackToHome}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Home size={16} />
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountApproved;
