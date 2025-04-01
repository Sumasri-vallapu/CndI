import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp'; 
import ForgotPassword from '@/pages/ForgotPassword';
import Register from '@/pages/Register';
import Tasks from '@/pages/Tasks';
import DataConsent from '@/pages/DataConsent';
import ChildProtectionConsent from '@/pages/ChildProtectionConsent';
import Test from '@/pages/Test';
import Main from '@/pages/Main';
import FellowProfile from '@/pages/FellowProfile';
import RecordUserTestimonial from '@/pages/RecordUserTestimonial';
import Recording from '@/pages/Recording';
import TestimonialRecord from '@/pages/TestimonialRecord';
import RecScreen1 from '@/pages/RecScreen1';
import RecScreen2 from '@/pages/RecScreen2';
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/child-protection-consent" element={<ChildProtectionConsent />} />
              <Route path="/data-protection-consent" element={<DataConsent />} />
              <Route path="/test" element={<Test />} />
              <Route path="/main" element={<Main />} />
              <Route path="/fellow-profile" element={<FellowProfile />} />
              <Route path="/record-user-testimonial" element={<RecordUserTestimonial />} />
              <Route path="/record-user-testimonial/record" element={<Recording />} />
              <Route path="/testimonial-record" element={<TestimonialRecord />} />
              <Route path="/recorder-page" element={<RecScreen1 />} />
              <Route path="/recorder-page/record" element={<RecScreen2 />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}



