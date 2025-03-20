import { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, Camera } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ENDPOINTS } from "@/utils/api";

const MainScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get mobile number from both location state and localStorage
  const mobileNumber = location.state?.mobileNumber || localStorage.getItem('mobile_number');

  // Redirect to login if no mobile number
  useEffect(() => {
    if (!mobileNumber) {
      navigate('/login');
    }
  }, [mobileNumber, navigate]);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleSidebar = (section: string) => {
    setActiveSidebar(activeSidebar === section ? null : section);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Get mobile number from localStorage
    const mobileNumber = localStorage.getItem('mobile_number');
    if (!mobileNumber) {
        alert("Please login again");
        return;
    }

    const formData = new FormData();
    formData.append('photo', file);  // Make sure this matches backend's expected field name
    formData.append('mobile_number', mobileNumber);

    try {
        const response = await fetch(ENDPOINTS.UPLOAD_PROFILE_PHOTO, {
            method: 'POST',
            // Add these headers
            headers: {
                'Accept': 'application/json',
                // Don't set Content-Type when using FormData
                // 'Content-Type': 'multipart/form-data' 
            },
            credentials: 'include', // Important for CORS
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        setProfilePhoto(data.photo_url);
    } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo. Please try again.');
    }
  };

  const handleProfileClick = () => {
    if (!mobileNumber) {
      navigate('/login');
      return;
    }
    navigate("/fellow-profile", { 
      state: { mobileNumber },
      replace: false  // Allow going back to main
    });
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
      {/* ✅ Top Navbar */}
      <div className="w-full max-w-3xl flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className="text-walnut h-6 w-6" />
        </button>
        <button>
          <Bell className="text-walnut h-6 w-6" />
        </button>
      </div>

      {/* Updated User Profile Section with onClick */}
      <div 
        className="w-full max-w-3xl flex items-center p-6 bg-white shadow-lg rounded-lg mt-6 cursor-pointer hover:bg-gray-50"
        onClick={handleProfileClick}
      >
        <div className="relative">
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-walnut" />
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent profile navigation when clicking upload
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 bg-walnut text-white rounded-full p-1"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <h2 className="text-lg font-semibold text-walnut ml-4">Hello! Bose Fellow - X</h2>
      </div>

      {/* ✅ Main Sections */}
      <div className="w-full max-w-3xl mt-6 space-y-4">
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
                    <p className="text-blue-700 hover:text-blue-900 cursor-pointer pl-3 text-sm">{subItem}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#F4F1E3] p-5 shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform z-50`}
      >
        <button onClick={() => setIsSidebarOpen(false)} className="mb-5">
          <Menu className="h-6 w-6 text-walnut" />
        </button>
        {[
          { 
            title: "Profiles", 
            subItems: [
              { 
                label: "My Profile", 
                onClick: handleProfileClick  // Add click handler here
              },
              "Children",
              "Learning Center (LC)"
            ] 
          },
          { title: "Assessments", subItems: ["Baseline", "Endline"] },
          { title: "Reflections", subItems: ["Monthly Reflections", "Quarterly Feedbacks", "Annual Testimonials"] },
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
                {section.subItems.map((subItem) => (
                  typeof subItem === 'string' ? (
                    <Link 
                      key={subItem} 
                      to="#" 
                      className="block text-blue-700 hover:text-blue-900 py-2 px-3 text-sm border-b border-gray-100 last:border-b-0"
                    >
                      {subItem}
                    </Link>
                  ) : (
                    <div
                      key={subItem.label}
                      onClick={subItem.onClick}
                      className="block text-blue-700 hover:text-blue-900 py-2 px-3 text-sm border-b border-gray-100 last:border-b-0 cursor-pointer"
                    >
                      {subItem.label}
                    </div>
                  )
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
