import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Register from '@/pages/Register';
import Tasks from '@/pages/Tasks';
import DataConsent from '@/pages/DataConsent';
import ChildProtectionConsent from '@/pages/ChildProtectionConsent';
import FinalUI from '@/pages/FinalUI';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/data-consent" element={<DataConsent />} />
              <Route path="/child-protection-consent" element={<ChildProtectionConsent />} />
              <Route path="/final-ui" element={<FinalUI />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}



