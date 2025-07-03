import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const PRIMARY_GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";
const SECONDARY_GRADIENT = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold" style={{ color: '#7c3aed' }}>
              clearmyfile.org
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                style={{ background: PRIMARY_GRADIENT }}
                className="text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              clearmyfile.org
            </span>
          </h1>
          <p className="text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            make your voice count
          </p>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mb-20">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg font-semibold text-white"
              style={{ background: PRIMARY_GRADIENT }}
            >
              Create Account
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Professional Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools designed to enhance productivity and streamline operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-blue-100 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Secure & Fast</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enterprise-grade security with optimized performance for reliable operations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-purple-100 flex items-center justify-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Professional Tools</h3>
                <p className="text-slate-600 leading-relaxed">
                  Comprehensive suite of tools designed for modern business requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-green-100 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-600 rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Data Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced analytics and reporting capabilities for informed decision making.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Trusted by Organizations Worldwide
          </h3>
          <p className="text-slate-300 mb-8">
            Join thousands of professionals who rely on our platform for their business operations.
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-center">
            <div>
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-slate-400">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-slate-400">Support</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}