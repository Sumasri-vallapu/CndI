import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { XCircle, Mail, Home, AlertTriangle } from 'lucide-react';

const AccountRejected: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rejectionReason = location.state?.rejectionReason || 'Your application did not meet our requirements at this time.';

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
              <div className="bg-red-500/20 p-4 rounded-full border-2 border-red-500/30">
                <XCircle size={48} className="text-red-400" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-white mb-3">
                Application Not Approved
              </h1>
              <p className="text-lg text-white/90 font-normal">
                We appreciate your interest in Connect & Inspire
              </p>
            </div>

            {/* Rejection Reason */}
            <div className="bg-red-500/10 rounded-xl p-6 mb-6 border border-red-500/20">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                <h2 className="text-lg font-bold text-white">
                  Reason for Rejection
                </h2>
              </div>
              <p className="text-white/90 text-base leading-relaxed pl-8">
                {rejectionReason}
              </p>
            </div>

            {/* What You Can Do */}
            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">
                What can you do?
              </h2>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Review the rejection reason and address any concerns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Contact our support team for more information or clarification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>You may be eligible to reapply in the future after addressing the issues</span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Mail size={20} className="text-blue-400 mt-0.5" />
                <h2 className="text-lg font-bold text-white">
                  Need Help?
                </h2>
              </div>
              <p className="text-white/80 text-sm mb-4">
                If you believe this decision was made in error or if you have questions about the rejection, please don't hesitate to reach out to our support team.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-white/20 text-white font-medium hover:bg-white/30 transition rounded-lg px-6 py-2.5 text-sm border border-white/30"
              >
                Contact Support
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBackToHome}
                className="flex-1 bg-white text-black font-medium hover:bg-gray-100 transition rounded-lg px-6 py-3 text-sm flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Return to Homepage
              </button>
              <Link
                to="/contact"
                className="flex-1 bg-white/20 text-white font-medium hover:bg-white/30 transition rounded-lg px-6 py-3 text-sm border border-white/30 flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRejected;
