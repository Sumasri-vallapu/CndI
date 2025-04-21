import { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";
import { ENDPOINTS } from "@/utils/api";

const MainScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const mobileNumber = localStorage.getItem('mobile_number');
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleSidebar = (section: string) => {
    setActiveSidebar(activeSidebar === section ? null : section);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!mobileNumber) return;
      try {
        const response = await fetch(`${ENDPOINTS.GET_FELLOW_DETAILS}?mobile_number=${mobileNumber}`);
        const data = await response.json();
        setFullName(data.full_name);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [mobileNumber]);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
      {/* Top Navbar */}
      <div className="w-full max-w-3xl flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="text-walnut h-6 w-6" />
        </button>
        <button>
          <Bell className="text-walnut h-6 w-6" />
        </button>
      </div>

      {/* Main Content Container - Following Register.tsx style */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="flex flex-col items-center mb-6">
          <ProfilePhoto 
            initialPhotoUrl={localStorage.getItem('profile_photo')}
            mobileNumber={mobileNumber || ''}
          />
          <h2 className="text-2xl font-bold text-walnut mt-4">{fullName}</h2>
        </div>

        {/* Main Sections */}
        <div className="space-y-4">
          {[
            { title: "Learning Program", subItems: ["Monthly Module List", "My Progress"] },
            { title: "Attendance", subItems: ["My Attendance", "Children Attendance"] },
            { title: "My Tasks", subItems: ["My Task List", "My Task Status D/ND", "My Task Completion Rate (%)"] },
            { title: "My Performance", subItems: ["My Monthly Attendance %", "LC Monthly Attendance %", "My Task Completion %", "My TL Rating"] },
          ].map((section) => (
            <div key={section.title} className="w-full p-5 bg-white shadow-md rounded-lg">
              <h3
                className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                <span>{activeSection === section.title ? "▼" : "►"}</span>
              </h3>
              {activeSection === section.title && (
                <div className="mt-3 space-y-3">
                  {section.subItems.map((subItem) => (
                    <div key={subItem} className="py-2 border-b border-gray-100 last:border-b-0">
                      <p className="text-blue-700 hover:text-blue-900 cursor-pointer pl-3 text-sm"
                      onClick={() => {
                        if (subItem === "Children Attendance") {
                          navigate("/children-attendance");
                        }
                      }}
                      >{subItem}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#F4F1E3] p-5 shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform z-50`}
      >
        <button onClick={() => setIsSidebarOpen(false)} className="mb-5">
          <Menu className="h-6 w-6 text-walnut" />
        </button>
        {[
          { 
            title: "Profiles", 
            subItems: ["My Profile", "Children", "Learning Center (LC)"]
          },
          { title: "Assessments", subItems: ["Baseline", "Endline"] },
          { 
            title: "Reflections", 
            subItems: ["Monthly Reflections", "Quarterly Feedbacks", "Annual Testimonials"] 
          },
        ].map((section) => (
          <div key={section.title} className="w-full p-3 bg-white shadow-md rounded-lg mb-3">
            <h3
              className="text-base font-bold text-walnut cursor-pointer flex justify-between items-center"
              onClick={() => toggleSidebar(section.title)}
            >
              {section.title}
              <span>{activeSidebar === section.title ? "▼" : "►"}</span>
            </h3>
            {activeSidebar === section.title && (
              <div className="mt-2">
                {section.subItems.map((item) => (
                  <div 
                    key={item} 
                    onClick={() => {
                      if (item === "My Profile") {
                        navigate("/fellow-profile");
                      } else if (item === "Children") {
                        navigate("/children-profile");
                      } else if (item === "Annual Testimonials") {
                      } else if (item === "Learning Center (LC)") {
                        navigate("/learning-center");
                      }else if (item === "Annual Testimonials") {
                        navigate("/recorder-page");
                      }
                      setIsSidebarOpen(false); // Close sidebar after navigation
                    }}

                    className="block text-blue-700 hover:text-blue-900 py-2 px-3 text-sm border-b border-gray-100 last:border-b-0 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainScreen;
