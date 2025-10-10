import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSubmitted(true);
        // Keep success message visible until user manually dismisses or navigates away
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send message. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#27465C] flex flex-col font-['Roboto']">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <div className="text-white text-3xl font-black">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/home')} className="text-white hover:opacity-80 font-medium text-sm">Home</button>
            <button onClick={() => navigate('/about')} className="text-white hover:opacity-80 font-medium text-sm">About Us</button>
            <button onClick={() => navigate('/contact')} className="text-white hover:opacity-80 font-medium border-b-2 border-white text-sm">Contact us</button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/host-login')}
                className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-100 transition-all font-medium text-sm"
              >
                Host Sign in
              </button>
              <button
                onClick={() => navigate('/speaker-login')}
                className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-100 transition-all font-medium text-sm"
              >
                Speaker Sign in
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => navigate('/host-login')}
              className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-100 transition-all font-medium text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-3">
              Contact Us
            </h1>
            <p className="text-base text-white font-normal max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Send us a message</h2>
              
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Message Sent Successfully!</h3>
                  <p className="text-white/90 mb-6 text-base">
                    Thank you for reaching out to us! We've received your message and our team will get back to you within 24-48 hours.
                  </p>

                  {/* Quick Links */}
                  <div className="bg-white/10 rounded-xl p-6 mb-6 border border-white/20">
                    <h4 className="text-lg font-black text-white mb-4">While you wait, explore more:</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate('/find-speaker')}
                        className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm flex items-center justify-between group"
                      >
                        <span>Browse Our Speakers</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate('/about')}
                        className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm flex items-center justify-between group"
                      >
                        <span>Learn About Us</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm flex items-center justify-between group"
                      >
                        <span>Back to Home</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 rounded-lg font-medium transition-colors px-6 py-3"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg p-4">
                      <p className="text-white text-sm font-medium">{error}</p>
                    </div>
                  )}
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="How can we help?"
                      className="w-full h-10 px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="w-full px-3 py-2 border-2 border-white/30 bg-white/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200 text-sm text-white placeholder:text-white/70 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 bg-white text-black font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#27465C] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-black text-white mb-6">Get in touch</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Email</h3>
                      <a href="mailto:cndihyderabad@gmail.com" className="text-white/80 hover:text-white transition-colors">
                        cndihyderabad@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Office</h3>
                      <p className="text-white/80">
                        25-29, Saivalmiki Nagar<br />
                        Bairagiguda, Hyderabad<br />
                        Telangana, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h2 className="text-xl font-black text-white mb-4">Quick Help</h2>
                <p className="text-white/80 mb-4">Looking for quick answers? Check out our frequently asked questions.</p>
                <button
                  onClick={() => navigate('/faq')}
                  className="bg-white/20 text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50 rounded-lg font-medium transition-colors duration-200 px-6 py-3"
                >
                  View FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}