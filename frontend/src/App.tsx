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
import AddChildProfile from '@/pages/AddChildProfile';
import ViewChildren from '@/pages/ViewChildren';
import ViewChildProfile from '@/pages/ViewChildProfile';
import LearningCenter from '@/pages/LearningCenter';

import FellowAttendance from '@/pages/FellowAttendance';
import FellowAttendanceHistory from '@/pages/FellowAttendanceHistory';
import MyAttendancePage from '@/pages/MyAttendancePage';
import AddChildrenAttendance from '@/pages/AddChildrenAttendance';
import ViewChildrenAttendance from '@/pages/ViewChildrenAttendance';
import ChildrenAttendance from '@/pages/ChildrenAttendance';
import Summary from '@/pages/Summary';
import Baseline from '@/pages/Baseline';
import Endline from '@/pages/Endline';
import FellowTasksPage from "@/pages/FellowTasksPage";
import AdminAssignTasks from "@/pages/AdminAssignTasks";
//import TaskAssignment from '@/pages/TaskAssignment';

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
              <Route path="/add-child-profile" element={<AddChildProfile />} />
              <Route path="/children/edit/:id" element={<AddChildProfile />} /> {/* ✅ Add this line */}
              <Route path="/view-children" element={<ViewChildren />} />
              <Route path="/children/view/:id" element={<ViewChildProfile />} />
              <Route path="/learning-center" element={<LearningCenter />} />
              <Route path="/fellow-attendance" element={<FellowAttendance />} />
              <Route path="/fellow-attendance-history" element={<FellowAttendanceHistory />} />
              <Route path="/my-attendance" element={<MyAttendancePage />} />
              <Route path="/add-children-attendance" element={<AddChildrenAttendance />} />
              <Route path="/view-children-attendance" element={<ViewChildrenAttendance />} />
              <Route path="/children-attendance" element={<ChildrenAttendance />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/baseline" element={<Baseline />} />
              <Route path="/endline" element={<Endline />} />
              <Route path="/fellow-tasks" element={<FellowTasksPage />} />
              <Route path="/assign-task" element={<AdminAssignTasks />} />
              
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}



