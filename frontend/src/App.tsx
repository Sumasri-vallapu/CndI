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
import RecScreen1 from '@/pages/RecScreen1';
import RecScreen2 from '@/pages/RecScreen2';
import ChildrenProfile from '@/pages/ChildrenProfile';
import AddChild from '@/pages/AddChild';
import ChildPersonalDetails from '@/pages/ChildPersonalDetails';
import ChildLearningDetails from '@/pages/ChildLearningDetails';
import ChildParentDetails from '@/pages/ChildParentDetails';
import ChildEduDetails from '@/pages/ChildEduDetails';
import ViewChildProfile from '@/pages/ViewChildProfile';
import ChildProfile from '@/pages/ChildProfile';

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
              <Route path="/child-protection" element={<ChildProtectionConsent />} />
              <Route path="/data-protection-consent" element={<DataConsent />} />
              <Route path="/test" element={<Test />} />
              <Route path="/main" element={<Main />} />
              <Route path="/fellow-profile" element={<FellowProfile />} />
              <Route path="/recorder-page" element={<RecScreen1 />} />
              <Route path="/recorder-page/record" element={<RecScreen2 />} />
              <Route path="/children-profile" element={<ChildrenProfile />} />
              <Route path="/add-child" element={<AddChild />} />
              <Route path="/child-personal-details" element={<ChildPersonalDetails />} />
              <Route path="/child-learning-details" element={<ChildLearningDetails />} />
              <Route path="/child-parent-details" element={<ChildParentDetails />} />
              <Route path="/child-educational-details" element={<ChildEduDetails />} />
              <Route path="/view-child-profile" element={<ViewChildProfile />} />
              <Route path="/child-profile" element={<ChildProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}



