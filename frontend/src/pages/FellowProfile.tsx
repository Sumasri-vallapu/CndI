import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";
import { Menu, ArrowLeft } from "lucide-react";

interface ProfileData {
  personal_details: {
    full_name: string;
    mobile_number: string;
    email: string;
    gender: string;
    caste_category: string;
    date_of_birth: string;
    state_name: string;
    district_name: string;
    mandal_name: string;
    grampanchayat_name: string;
    fellow_id: string;
    team_leader: string;
    fellow_status: string;
    performance_score: string;
    batch: string;
    academic_year: string;
  };
  education_details: {
    university_name: string | null;
    college_name: string | null;
    course_name: string | null;
    semester: string;
    college_type: string;
    study_mode: string;
    stream: string;
    subjects: string;
  };
  family_details: {
    mother_name: string;
    mother_occupation: string;
    father_name: string;
    father_occupation: string;
    any_job_at_present: boolean;
    current_job: string;
  };
  skills: {
    hobbies: string;
    technical_skills: string;
    artistic_skills: string;
  };
}

interface Location {
  id: number;
  name: string;
}

interface LocationData {
  states: Location[];
  districts: Location[];
  mandals: Location[];
  grampanchayats: Location[];
}

interface EducationData {
  universities: Location[];
  colleges: Location[];
  courses: Location[];
}

const ProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [locationData, setLocationData] = useState<LocationData>({
    states: [],
    districts: [],
    mandals: [],
    grampanchayats: []
  });
  const [educationData, setEducationData] = useState<EducationData>({
    universities: [],
    colleges: [],
    courses: []
  });

  // Get mobile number from both location state and localStorage
  const mobileNumber = location.state?.mobileNumber || localStorage.getItem('mobile_number');

  useEffect(() => {
    if (!mobileNumber) {
      console.log("No mobile number found, redirecting to login");
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for:", mobileNumber);
        const response = await fetch(ENDPOINTS.GET_FELLOW_PROFILE(mobileNumber));
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }
        
        const responseData = await response.json();
        console.log("Profile data received:", responseData);
        
        if (responseData.status === "success") {
          setProfileData(responseData.data);
        } else {
          throw new Error(responseData.message || "Failed to fetch profile");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mobileNumber, navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Always fetch states
        const statesResponse = await fetch(ENDPOINTS.GET_STATES);
        if (!statesResponse.ok) throw new Error('Failed to fetch states');
        const statesData = await statesResponse.json();
        setLocationData(prev => ({ ...prev, states: statesData }));

        // Only fetch dependent data if we have the parent ID
        const state = profileData?.personal_details.state;
        if (state) {
          const districtsResponse = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state=${state}`);
          if (!districtsResponse.ok) throw new Error('Failed to fetch districts');
          const districtsData = await districtsResponse.json();
          setLocationData(prev => ({ ...prev, districts: districtsData }));

          const district = profileData?.personal_details.district;
          if (district) {
            const mandalsResponse = await fetch(`${ENDPOINTS.GET_MANDALS}?district=${district}`);
            if (!mandalsResponse.ok) throw new Error('Failed to fetch mandals');
            const mandalsData = await mandalsResponse.json();
            setLocationData(prev => ({ ...prev, mandals: mandalsData }));

            const mandal = profileData?.personal_details.mandal;
            if (mandal) {
              const grampanchayatsResponse = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal=${mandal}`);
              if (!grampanchayatsResponse.ok) throw new Error('Failed to fetch grampanchayats');
              const grampanchayatsData = await grampanchayatsResponse.json();
              setLocationData(prev => ({ ...prev, grampanchayats: grampanchayatsData }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [profileData?.personal_details.state, profileData?.personal_details.district, profileData?.personal_details.mandal]);

  const handleChange = (section: string, key: string, value: string) => {
    if (!profileData) return;

    setProfileData({
      ...profileData,
      [section.toLowerCase().replace(' ', '_')]: {
        ...profileData[section.toLowerCase().replace(' ', '_') as keyof typeof profileData],
        [key]: value
      }
    });
  };

  const handleSave = async (section: string) => {
    if (!mobileNumber) {
      alert("Please login again");
      return;
    }

    try {
      const sectionKey = section.toLowerCase().replace(' ', '_');
      const sectionData = profileData?.[sectionKey as keyof typeof profileData];
      
      const response = await fetch(ENDPOINTS.UPDATE_FELLOW_PROFILE(mobileNumber, sectionKey), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      alert(`${section} updated successfully`);
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating ${section}. Please try again.`);
    }
  };

  const getSectionData = (section: string) => {
    if (profileData) {
      switch (section) {
        case 'personal_details':
          return {
            gender: profileData.personal_details.gender,
            caste_category: profileData.personal_details.caste_category,
            date_of_birth: profileData.personal_details.date_of_birth,
            state: profileData.personal_details.state_name,
            district: profileData.personal_details.district_name,
            mandal: profileData.personal_details.mandal_name,
            village: profileData.personal_details.grampanchayat_name,
            whatsapp_number: profileData.personal_details.mobile_number,
            email: profileData.personal_details.email,
          };
        case 'family_details':
          return {
            mother_name: profileData.family_details.mother_name,
            mother_occupation: profileData.family_details.mother_occupation,
            father_name: profileData.family_details.father_name,
            father_occupation: profileData.family_details.father_occupation,
            current_job: profileData.family_details.current_job,
          };
        case 'education_details':
          return {
            current_job: profileData.family_details.current_job,
            hobbies: profileData.skills.hobbies,
            college_name: profileData.education_details.college_name,
            college_type: profileData.education_details.college_type,
            study_mode: profileData.education_details.study_mode,
            stream: profileData.education_details.stream,
            course: profileData.education_details.course_name,
            subjects: profileData.education_details.subjects,
            semester: profileData.education_details.semester,
            technical_skills: profileData.skills.technical_skills,
            artistic_skills: profileData.skills.artistic_skills,
          };
        default:
          return {};
      }
    }
    return {};
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const formatLabel = (label: string) => {
    return label.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  };

  const dropdownOptions = {
    gender: ["MALE", "FEMALE", "OTHER"],
    caste_category: ["OC", "BC", "SC", "ST", "OTHER"],
    college_type: ["Government", "Private"],
    study_mode: ["Regular", "Distance", "Online"],
    semester: ["1", "2", "3", "4", "5", "6", "7", "8"],
    stream: ["Arts", "Science", "Commerce", "Engineering", "Other"],
  };

  const renderSection = (title: string, fields: Array<{key: string, label: string, type?: string, readonly?: boolean}>, dropdowns: string[] = []) => (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection(title)}>
        {title}
        <span>{activeSection === title ? "▼" : "►"}</span>
      </h3>
      {activeSection === title && (
        <div className="mt-3 space-y-4">
          {fields.map(({key, label, type, readonly}) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              {isEditing === title && !readonly ? (
                type === "dropdown" ? (
                  <Select 
                    name={key} 
                    value={getFieldValue(title, key)} 
                    onValueChange={(value) => handleChange(title, key, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions[key as keyof typeof dropdownOptions]?.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : type === "date" ? (
                  <Input
                    type="date"
                    name={key}
                    value={getFieldValue(title, key)}
                    onChange={(e) => handleChange(title, key, e.target.value)}
                  />
                ) : (
                  <Input
                    type="text"
                    name={key}
                    value={getFieldValue(title, key)}
                    onChange={(e) => handleChange(title, key, e.target.value)}
                    placeholder={`Enter ${label}`}
                  />
                )
              ) : (
                <p className="bg-gray-100 p-3 rounded text-gray-700">
                  {getFieldValue(title, key) || "Please Provide"}
                </p>
              )}
            </div>
          ))}
          <Button onClick={() => setIsEditing(isEditing === title ? null : title)} className="w-full mt-3">
            {isEditing === title ? "Cancel" : "Edit"}
          </Button>
          {isEditing === title && (
            <Button onClick={() => handleSave(title)} className="w-full bg-green-500 mt-3">
              Save Changes
            </Button>
          )}
        </div>
      )}
    </div>
  );

  // Helper function to get field value from the correct section
  const getFieldValue = (section: string, key: string) => {
    if (!profileData) return "";
    
    switch (section) {
      case "Personal Details":
        return profileData.personal_details[key as keyof typeof profileData.personal_details] || "";
      case "Family Details":
        return profileData.family_details[key as keyof typeof profileData.family_details] || "";
      case "Education Details":
        return profileData.education_details[key as keyof typeof profileData.education_details] || "";
      default:
        return "";
    }
  };

  const toggleSidebar = (section: string) => {
    setActiveSidebar(activeSidebar === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.removeItem('mobile_number');
    localStorage.removeItem('profile_photo');
    navigate('/login');
  };

  const updateProfileSection = async (section: string, updatedData: any) => {
    try {
      const response = await fetch(ENDPOINTS.UPDATE_FELLOW_PROFILE(mobileNumber!, section), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Refresh profile data after update
      const updatedResponse = await fetch(ENDPOINTS.GET_FELLOW_PROFILE(mobileNumber!));
      const updatedData = await updatedResponse.json();
      if (updatedData.status === "success") {
        setProfileData(updatedData.data);
      }
      
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleStateChange = async (stateId: string) => {
    try {
      // Clear dependent fields first
      handleChange('Personal Details', 'district', '');
      handleChange('Personal Details', 'mandal', '');
      handleChange('Personal Details', 'grampanchayat', '');
      
      const response = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state=${stateId}`);
      if (!response.ok) throw new Error('Failed to fetch districts');
      const districts = await response.json();
      
      setLocationData(prev => ({
        ...prev,
        districts,
        mandals: [],
        grampanchayats: []
      }));
      handleChange('Personal Details', 'state', stateId);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleDistrictChange = async (districtId: string) => {
    try {
      // Clear dependent fields first
      handleChange('Personal Details', 'mandal', '');
      handleChange('Personal Details', 'grampanchayat', '');
      
      const response = await fetch(`${ENDPOINTS.GET_MANDALS}?district=${districtId}`);
      if (!response.ok) throw new Error('Failed to fetch mandals');
      const mandals = await response.json();
      
      setLocationData(prev => ({
        ...prev,
        mandals,
        grampanchayats: []
      }));
      handleChange('Personal Details', 'district', districtId);
    } catch (error) {
      console.error('Error fetching mandals:', error);
    }
  };

  const handleMandalChange = async (mandalId: string) => {
    try {
      // Clear dependent field first
      handleChange('Personal Details', 'grampanchayat', '');
      
      const response = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal=${mandalId}`);
      if (!response.ok) throw new Error('Failed to fetch grampanchayats');
      const grampanchayats = await response.json();
      
      setLocationData(prev => ({
        ...prev,
        grampanchayats
      }));
      handleChange('Personal Details', 'mandal', mandalId);
    } catch (error) {
      console.error('Error fetching grampanchayats:', error);
    }
  };

  const renderLocationDropdown = (key: string, label: string, options: Location[], onChange: (value: string) => void) => (
    <Select 
      name={key} 
      value={getFieldValue('Personal Details', key) || ''} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id.toString()}>
            {option[key === 'state' ? 'state_name' : 
                    key === 'district' ? 'district_name' : 
                    key === 'mandal' ? 'mandal_name' : 
                    'gram_panchayat_name']}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Add education-related handlers
  const handleUniversityChange = async (universityId: string) => {
    try {
      const response = await fetch(`${ENDPOINTS.GET_COLLEGES}?university=${universityId}`);
      const colleges = await response.json();
      setEducationData(prev => ({
        ...prev,
        colleges,
        courses: []
      }));
      handleChange('Education Details', 'university', universityId);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleCollegeChange = async (collegeId: string) => {
    try {
      const response = await fetch(`${ENDPOINTS.GET_COURSES}?college=${collegeId}`);
      const courses = await response.json();
      setEducationData(prev => ({
        ...prev,
        courses
      }));
      handleChange('Education Details', 'college', collegeId);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Add useEffect for fetching initial education data
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const universitiesResponse = await fetch(ENDPOINTS.GET_UNIVERSITIES);
        const universities = await universitiesResponse.json();
        setEducationData(prev => ({ ...prev, universities }));

        if (profileData?.education_details.university) {
          const collegesResponse = await fetch(
            `${ENDPOINTS.GET_COLLEGES}?university=${profileData.education_details.university}`
          );
          const colleges = await collegesResponse.json();
          setEducationData(prev => ({ ...prev, colleges }));

          if (profileData?.education_details.college) {
            const coursesResponse = await fetch(
              `${ENDPOINTS.GET_COURSES}?college=${profileData.education_details.college}`
            );
            const courses = await coursesResponse.json();
            setEducationData(prev => ({ ...prev, courses }));
          }
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    fetchEducationData();
  }, [profileData?.education_details.university, profileData?.education_details.college]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F1E3]">
        <div className="text-xl text-walnut">Loading profile data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F1E3]">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
      {/* Navigation Bar with Back and Logout - Matching Register.tsx */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <button 
          onClick={() => navigate('/main')} 
          className="text-walnut hover:text-earth flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="text-base font-medium">Back</span>
        </button>
        <button 
          onClick={handleLogout}
          className="bg-walnut text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      {/* Main Content Container - Following Register.tsx style */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="flex flex-col items-center mb-6">
          <ProfilePhoto 
            initialPhotoUrl={localStorage.getItem('profile_photo')}
            mobileNumber={mobileNumber || ''}
          />
          <h2 className="text-2xl font-bold text-walnut mt-4">{profileData?.personal_details.full_name}</h2>
        </div>

        {/* Hero Section - Always Visible */}
        <div className="w-full bg-white p-6 shadow-lg rounded-lg space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <p className="bg-gray-100 p-3 rounded text-gray-700">
              {profileData?.personal_details.full_name || "Please Provide"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Fellow ID</Label>
            <p className="bg-gray-100 p-3 rounded text-gray-700">
              {profileData?.personal_details.fellow_id || "Please Provide"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Team Leader</Label>
            <p className="bg-gray-100 p-3 rounded text-gray-700">
              {profileData?.personal_details.team_leader || "Please Provide"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Fellow Status</Label>
            <p className="bg-gray-100 p-3 rounded text-gray-700">
              {profileData?.personal_details.fellow_status || "Please Provide"}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Performance Score</Label>
            <p className="bg-gray-100 p-3 rounded text-gray-700">
              {profileData?.personal_details.performance_score || "Please Provide"}
            </p>
          </div>
        </div>

        {renderSection("Personal Details", [
          { key: "gender", label: "Gender", type: "dropdown" },
          { key: "caste_category", label: "Caste Category", type: "dropdown" },
          { key: "date_of_birth", label: "Date of Birth", type: "date" },
          { 
            key: "state", 
            label: "State", 
            type: "location",
            render: () => renderLocationDropdown("state", "State", locationData.states, handleStateChange)
          },
          { 
            key: "district", 
            label: "District", 
            type: "location",
            render: () => renderLocationDropdown("district", "District", locationData.districts, handleDistrictChange)
          },
          { 
            key: "mandal", 
            label: "Mandal", 
            type: "location",
            render: () => renderLocationDropdown("mandal", "Mandal", locationData.mandals, handleMandalChange)
          },
          { 
            key: "grampanchayat", 
            label: "Village", 
            type: "location",
            render: () => renderLocationDropdown("grampanchayat", "Village", locationData.grampanchayats, 
              (value) => handleChange('Personal Details', 'grampanchayat', value))
          },
          { key: "mobile_number", label: "WhatsApp Number", type: "text", readonly: true },
          { key: "email", label: "Email" }
        ], ["gender", "caste_category"])}
        {renderSection("Family Details", [
          { key: "mother_name", label: "Mother's Name" },
          { key: "mother_occupation", label: "Mother's Occupation" },
          { key: "father_name", label: "Father's Name" },
          { key: "father_occupation", label: "Father's Occupation" },
          { key: "current_job", label: "Current Job" }
        ])}
        {renderSection("Education Details", [
          { 
            key: "university", 
            label: "University",
            type: "education",
            render: () => renderLocationDropdown("university", "University", educationData.universities, handleUniversityChange)
          },
          { 
            key: "college", 
            label: "College",
            type: "education",
            render: () => renderLocationDropdown("college", "College", educationData.colleges, handleCollegeChange)
          },
          { 
            key: "course", 
            label: "Course",
            type: "education",
            render: () => renderLocationDropdown("course", "Course", educationData.courses, 
              (value) => handleChange('Education Details', 'course', value))
          },
          { key: "college_type", label: "College Type", type: "dropdown" },
          { key: "study_mode", label: "Study Mode", type: "dropdown" },
          { key: "stream", label: "Stream", type: "dropdown" },
          { key: "semester", label: "Semester", type: "dropdown" }
        ], ["college_type", "study_mode", "stream", "semester"])}
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
            title: "Navigation",
            subItems: ["Main Dashboard"]
          },
          { 
            title: "Profiles", 
            subItems: ["My Profile", "Children", "Learning Center (LC)"]
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
                {section.subItems.map((item) => (
                  <Link 
                    key={item} 
                    to={item === "Main Dashboard" ? "/main" : item === "My Profile" ? "/fellow-profile" : "#"}
                    className="block text-blue-700 hover:text-blue-900 py-2 px-3 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileForm;
