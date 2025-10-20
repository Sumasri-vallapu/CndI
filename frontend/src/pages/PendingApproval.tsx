import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Mail, Home } from 'lucide-react';

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();

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
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-orange-500/20 p-4 rounded-full border-2 border-orange-500/30">
                <Clock size={48} className="text-orange-400" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-white mb-3">
                Account Pending Approval
              </h1>
              <p className="text-lg text-white/90 font-normal">
                Your account has been successfully created!
              </p>
            </div>

            {/* Content */}
            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <div className="space-y-4 text-white/80">
                <p className="text-base leading-relaxed">
                  Thank you for signing up with Connect & Inspire. Your account is currently under review by our admin team.
                </p>
                <p className="text-base leading-relaxed">
                  This process typically takes <span className="text-white font-semibold">24-48 hours</span>. Once your account is approved, you'll receive an email notification and will be able to log in and access all features.
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={20} />
                What happens next?
              </h2>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">1.</span>
                  <span>Our admin team will review your account details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">2.</span>
                  <span>You'll receive an email notification once the review is complete</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">3.</span>
                  <span>If approved, you can log in and start using the platform immediately</span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
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

export default PendingApproval;
