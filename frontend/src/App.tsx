import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Add other routes as needed */}
              <Route 
                path="/login" 
                element={<Login />}
              /> 
              <Route 
                path="/signup" 
                element={<SignUp />}
              /> 
              <Route 
                path="/forgot-password" 
                element={<ForgotPassword />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}



