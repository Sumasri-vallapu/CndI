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
    state: string;
    state_name: string | null;
    district: string;
    district_name: string | null;
    mandal: string;
    mandal_name: string | null;
    grampanchayat: string;
    grampanchayat_name: string | null;
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
    type_of_college: string;
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

interface LocationOption {
  id: string;
  name: string;
  state_name?: string;
  district_name?: string;
  mandal_name?: string;
  gram_panchayat_name?: string;
}

interface LocationData {
  states: LocationOption[];
  districts: LocationOption[];
  mandals: LocationOption[];
  grampanchayats: LocationOption[];
}

interface EducationData {
  universities: LocationOption[];
  colleges: LocationOption[];
  courses: LocationOption[];
}

type ProfileSection = {
  [key: string]: string | boolean;
};

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" }
];

const CASTE_OPTIONS = [
  { value: "ST", label: "ST" },
  { value: "SC", label: "SC" },
  { value: "BC", label: "BC" },
  { value: "OBC", label: "OBC" },
  { value: "OC", label: "OC" },
  { value: "MUSLIM", label: "Muslim" },
  { value: "CHRISTIAN", label: "Christian" },
  { value: "OTHER", label: "Other" }
];

const dropdownOptions = {
  gender: ["MALE", "FEMALE", "OTHER"],
  caste_category: ["OC", "BC", "SC", "ST", "OTHER"],
  type_of_college: ["Government", "Private"], 
  mode_of_study: ["College Hostel", "Private Hostel", "Day-Scholar", "Distance"],
  type_of_college: ["Government", "Private"],
  study_mode: ["Regular", "Distance", "Online"],
  semester: ["1", "2", "3", "4", "5", "6",  "other"],
  stream: ["Arts", "Science", "Commerce", "Engineering", "Other"],
};

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
    const fetchInitialLocations = async () => {
      try {
        // Always fetch states first
        const statesResponse = await fetch(ENDPOINTS.GET_STATES);
        if (!statesResponse.ok) throw new Error('Failed to fetch states');
        const states = await statesResponse.json();
        setLocationData(prev => ({ ...prev, states }));

        // By default, fetch districts for Telangana (state_id: 36)
        const defaultStateId = "36";
        const districtsResponse = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${defaultStateId}`);
        if (!districtsResponse.ok) throw new Error('Failed to fetch districts');
        const districts = await districtsResponse.json();
        setLocationData(prev => ({ ...prev, districts }));

        // If we have a district in profile, fetch its mandals
        if (profileData?.personal_details.district) {
          const mandalsResponse = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${profileData.personal_details.district}`);
          if (!mandalsResponse.ok) throw new Error('Failed to fetch mandals');
          const mandals = await mandalsResponse.json();
          setLocationData(prev => ({ ...prev, mandals }));

          // If we have a mandal in profile, fetch its grampanchayats
          if (profileData?.personal_details.mandal) {
            const grampanchayatsResponse = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${profileData.personal_details.mandal}`);
            if (!grampanchayatsResponse.ok) throw new Error('Failed to fetch grampanchayats');
            const grampanchayats = await grampanchayatsResponse.json();
            setLocationData(prev => ({ ...prev, grampanchayats }));
          }
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchInitialLocations();
  }, [profileData?.personal_details.district, profileData?.personal_details.mandal]);

  // Transform location data to match education data structure
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_STATES);
        const data = await response.json();
        // Transform the data to match education data structure
        const transformedData = data.map((state: any) => ({
          id: state.id,
          name: state.state_name  // Use state_name as name
        }));
        setLocationData(prev => ({ ...prev, states: transformedData }));
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

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
            type_of_college: profileData.education_details.type_of_college,
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

  const renderDropdown = (key: string, label: string, options: { value: string, label: string }[]) => (
    <Select 
      name={key} 
      value={getFieldValue('Education Details', key) || ''} 
      onValueChange={(value) => handleChange('Education Details', key, value)}
    >
      <SelectTrigger className="w-full signup-input">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderLocationDropdown = (key: string, label: string, options: LocationOption[], onChange: (value: string) => void) => (
    <Select 
      name={key} 
      value={getFieldValue('Personal Details', key)?.toString() || ''} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full signup-input">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
        {options.map((opt: LocationOption) => (
          <SelectItem 
            key={opt.id} 
            value={opt.id.toString()}
            className="cursor-pointer hover:bg-gray-100"
          >
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderEducationDropdown = (key: string, label: string, options: any[], onChange: (value: string) => void) => (
    <Select 
      name={key} 
      value={getFieldValue('Education Details', key)?.toString() || ''} 
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full signup-input">
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
        {options.map((option) => (
          <SelectItem 
            key={option.id} 
            value={option.id.toString()}
            className="cursor-pointer hover:bg-gray-100"
          >
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const renderSection = (title: string, fields: Array<{
    key: string, 
    label: string, 
    type?: string, 
    readonly?: boolean,
    render?: () => React.ReactNode,
    display?: string | null
  }>) => (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection(title)}>
        {title}
        <span>{activeSection === title ? "▼" : "►"}</span>
      </h3>
      {activeSection === title && (
        <div className="mt-3 space-y-4">
          {fields.map(({key, label, type, readonly, render, display}) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              {isEditing === title && !readonly ? (
                render ? render() :
                type === "date" ? (
                  <Input
                    type="date"
                    name={key}
                    value={getFieldValue(title, key)}
                    onChange={(e) => handleChange(title, key, e.target.value)}
                    className="signup-input"
                  />
                ) : (
                  <Input
                    type="text"
                    name={key}
                    value={getFieldValue(title, key)}
                    onChange={(e) => handleChange(title, key, e.target.value)}
                    placeholder={`Enter ${label}`}
                    className="signup-input"
                  />
                )
              ) : (
                <p className="bg-gray-100 p-3 rounded text-gray-700">
                  {display || getFieldValue(title, key) || "Please Provide"}
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
  const getFieldValue = (section: string, key: string): string => {
    if (!profileData) return "";
    
    const sectionData = profileData[section.toLowerCase().replace(' ', '_') as keyof typeof profileData] as ProfileSection;
    const value = sectionData[key];
    return typeof value === 'string' ? value : '';
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
      
      const response = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`);
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
      
      const response = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`);
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
      // Clear grampanchayat field
      handleChange('Personal Details', 'grampanchayat', '');
      
      const response = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
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
          { 
            key: "gender", 
            label: "Gender", 
            type: "dropdown",
            render: () => renderDropdown("gender", "Gender", GENDER_OPTIONS)
          },
          { 
            key: "caste_category", 
            label: "Caste Category", 
            type: "dropdown",
            render: () => renderDropdown("caste_category", "Caste Category", CASTE_OPTIONS)
          },
          { key: "date_of_birth", label: "Date of Birth", type: "date" },
          { 
            key: "state", 
            label: "State", 
            type: "location",
            render: () => renderLocationDropdown("state", "State", locationData.states, handleStateChange),
            display: profileData?.personal_details.state_name
          },
          { 
            key: "district", 
            label: "District", 
            type: "location",
            render: () => renderLocationDropdown("district", "District", locationData.districts, handleDistrictChange),
            display: profileData?.personal_details.district_name
          },
          { 
            key: "mandal", 
            label: "Mandal", 
            type: "location",
            render: () => renderLocationDropdown("mandal", "Mandal", locationData.mandals, handleMandalChange),
            display: profileData?.personal_details.mandal_name
          },
          { 
            key: "grampanchayat", 
            label: "Grampanchayat", 
            type: "location",
            render: () => renderLocationDropdown("grampanchayat", "Grampanchayat", locationData.grampanchayats, 
              (value) => handleChange('Personal Details', 'grampanchayat', value)),
            display: profileData?.personal_details.grampanchayat_name
          },
          { key: "mobile_number", label: "WhatsApp Number", type: "text", readonly: true },
          { key: "email", label: "Email" }
        ])}
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
            render: () => renderEducationDropdown("university", "University", educationData.universities, handleUniversityChange),
            display: profileData?.education_details.university_name
          },
          { 
            key: "college", 
            label: "College",
            type: "education",
            render: () => renderEducationDropdown("college", "College", educationData.colleges, handleCollegeChange),
            display: profileData?.education_details.college_name
          },
          { 
            key: "course", 
            label: "Course",
            type: "education",
            render: () => renderEducationDropdown("course", "Course", educationData.courses, 
              (value) => handleChange('Education Details', 'course', value)),
            display: profileData?.education_details.course_name
          },
          { 
            key: "type_of_college", 
            label: "Type of College", 
            render: () => renderDropdown("type_of_college", "Type of College", dropdownOptions.type_of_college.map(value => ({ value, label: value })))
          },
          { 
            key: "mode_of_study", 
            label: "Mode of Study", 
            render: () => renderDropdown("mode_of_study", "Mode of Study", dropdownOptions.mode_of_study.map(value => ({ value, label: value })))
          },
          { 
            key: "type_of_college", 
            label: "College Type", 
            render: () => renderDropdown("type_of_college", "College Type", dropdownOptions.type_of_college.map(value => ({ value, label: value })))
          },
          { 
            key: "semester", 
            label: "Semester", 
            render: () => renderDropdown("semester", "Semester", dropdownOptions.semester.map(value => ({ value, label: value })))
          },
          { 
            key: "stream", 
            label: "Stream", 
            render: () => renderDropdown("stream", "Stream", dropdownOptions.stream.map(value => ({ value, label: value })))
          },
        ], ["type_of_college", "study_mode", "stream", "semester"])}
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
