import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const PROFESSIONAL_GRADIENT = "linear-gradient(135deg, #1e3a8a, #3b82f6, #60a5fa)";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl">
        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Our Platform
            </CardTitle>
            <p className="text-lg text-gray-600">
              Join thousands of users who trust our platform for their needs
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                Get Started Today
              </h2>
              <p className="text-gray-600 mb-6">
                Create your account and unlock access to all our features
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/signup')}
                style={{ background: PROFESSIONAL_GRADIENT }}
                className="text-white px-8 py-3 text-lg"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                Login
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
                <p className="text-gray-600">Lightning-fast performance with top-tier security</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Features</h3>
                <p className="text-gray-600">Intelligent tools designed to simplify your workflow</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Goal-Oriented</h3>
                <p className="text-gray-600">Achieve your objectives with our targeted solutions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
