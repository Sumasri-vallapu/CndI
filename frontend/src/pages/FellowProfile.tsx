import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";

const ProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get mobile number from both location state and localStorage
  const mobileNumber = location.state?.mobileNumber || localStorage.getItem('mobile_number');

  const [formData, setFormData] = useState({
    // Hero Section
    fullName: "",
    fellowId: "",
    teamLeader: "",
    fellowStatus: "Active",
    performanceScore: "",

    // Personal Details
    gender: "",
    casteCategory: "",
    dateOfBirth: "",
    state: "",
    district: "",
    mandal: "",
    village: "",
    whatsappNumber: "",
    email: "",

    // Family Details
    motherName: "",
    motherOccupation: "",
    fatherName: "",
    fatherOccupation: "",

    // Education Details
    currentJob: "",
    hobbies: "",
    collegeName: "",
    collegeType: "",
    studyMode: "",
    stream: "",
    course: "",
    subjects: "",
    semester: "",
    technicalSkills: "",
    artisticSkills: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    if (!mobileNumber) {
      console.log("No mobile number found, redirecting to login");
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for:", mobileNumber); // Debug log
        const response = await fetch(ENDPOINTS.GET_FELLOW_PROFILE(mobileNumber));
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }
        
        const data = await response.json();
        console.log("Profile data received:", data); // Debug log
        
        // Map API response to form data
        setFormData({
          // Hero Section
          fullName: data.hero_section.full_name || "",
          fellowId: data.hero_section.fellow_id || "",
          teamLeader: data.hero_section.team_leader || "",
          fellowStatus: data.hero_section.fellow_status || "Active",
          performanceScore: data.hero_section.performance_score || "",

          // Personal Details
          gender: data.personal_details.gender || "",
          casteCategory: data.personal_details.caste_category || "",
          dateOfBirth: data.personal_details.date_of_birth || "",
          state: data.personal_details.state || "",
          district: data.personal_details.district || "",
          mandal: data.personal_details.mandal || "",
          village: data.personal_details.village || "",
          whatsappNumber: data.personal_details.whatsapp_number || "",
          email: data.personal_details.email || "",

          // Family Details
          motherName: data.family_details.mother_name || "",
          motherOccupation: data.family_details.mother_occupation || "",
          fatherName: data.family_details.father_name || "",
          fatherOccupation: data.family_details.father_occupation || "",

          // Education Details
          currentJob: data.education_details.current_job || "",
          hobbies: data.education_details.hobbies || "",
          collegeName: data.education_details.college_name || "",
          collegeType: data.education_details.college_type || "",
          studyMode: data.education_details.study_mode || "",
          stream: data.education_details.stream || "",
          course: data.education_details.course || "",
          subjects: data.education_details.subjects || "",
          semester: data.education_details.semester || "",
          technicalSkills: data.education_details.technical_skills || "",
          artisticSkills: data.education_details.artistic_skills || "",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [mobileNumber, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (section: string) => {
    if (!mobileNumber) {
      alert("Please login again");
      return;
    }

    try {
      const sectionData = getSectionData(section);
      
      const response = await fetch(ENDPOINTS.UPDATE_FELLOW_PROFILE(mobileNumber, section), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      alert(`${section} updated successfully`);
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating ${section}. Please try again.`);
    }
  };

  const getSectionData = (section: string) => {
    switch (section) {
      case 'personal_details':
        return {
          gender: formData.gender,
          caste_category: formData.casteCategory,
          date_of_birth: formData.dateOfBirth,
          state: formData.state,
          district: formData.district,
          mandal: formData.mandal,
          village: formData.village,
          whatsapp_number: formData.whatsappNumber,
          email: formData.email,
        };
      case 'family_details':
        return {
          mother_name: formData.motherName,
          mother_occupation: formData.motherOccupation,
          father_name: formData.fatherName,
          father_occupation: formData.fatherOccupation,
        };
      case 'education_details':
        return {
          current_job: formData.currentJob,
          hobbies: formData.hobbies,
          college_name: formData.collegeName,
          college_type: formData.collegeType,
          study_mode: formData.studyMode,
          stream: formData.stream,
          course: formData.course,
          subjects: formData.subjects,
          semester: formData.semester,
          technical_skills: formData.technicalSkills,
          artistic_skills: formData.artisticSkills,
        };
      default:
        return {};
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const formatLabel = (label: string) => {
    return label.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
  };

  const dropdownOptions = {
    semester: ["1", "2", "3", "4", "5", "6"],
    course: ["BA", "BSC", "BBA", "BCom", "Other"],
    technicalSkills: [
      "MS Word", "MS PowerPoint", "MS Excel", "G-Mail", "Google Drive", "Google Docs", 
      "Google Sheets", "Google Forms", "Google Meet", "Zoom", "Canva", "Coding", "Other"
    ],
    artisticSkills: [
      "Singing", "Dancing", "Poem/Song Writing", "Prose Writing", "Theatre/Drama", "Drawing/Painting", 
      "Music Instrument", "Photography", "Media Management", "Other"
    ]
  };

  const renderSection = (title: string, fields: string[], dropdowns: string[] = []) => (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <h3
        className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center"
        onClick={() => toggleSection(title)}
      >
        {title}
        <span>{activeSection === title ? "▼" : "►"}</span>
      </h3>
      {activeSection === title && (
        <div className="mt-3 space-y-4">
          {fields.map((field) => (
            <div key={field} className="space-y-2">
              <Label>{formatLabel(field)}</Label>
              {isEditing === title ? (
                dropdowns.includes(field) ? (
                  <Select name={field} value={formData[field as keyof typeof formData]} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${formatLabel(field)}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions[field as keyof typeof dropdownOptions].map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={`Enter ${formatLabel(field)}`}
                  />
                )
              ) : (
                <p className="bg-gray-100 p-3 rounded text-gray-700">{formData[field as keyof typeof formData] || "Please Provide"}</p>
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F4F1E3] px-6 space-y-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-walnut text-center">My Profile</h2>
        {/* Hero Section - Always Visible */}
        <div className="w-full bg-white p-6 shadow-lg rounded-lg space-y-4">
          {["fullName", "fellowId", "teamLeader", "fellowStatus", "performanceScore"].map((field) => (
            <div key={field} className="space-y-2">
              <Label>{formatLabel(field)}</Label>
              <p className="bg-gray-100 p-3 rounded text-gray-700">{formData[field as keyof typeof formData] || "Please Provide"}</p>
            </div>
          ))}
        </div>

        {renderSection("Personal Details", ["gender", "casteCategory", "dateOfBirth", "state", "district", "mandal", "village", "whatsappNumber", "email"])}
        {renderSection("Family Details", ["motherName", "motherOccupation", "fatherName", "fatherOccupation"])}
        {renderSection("Education Details", ["currentJob", "hobbies", "collegeName", "collegeType", "studyMode", "stream", "course", "subjects", "semester", "technicalSkills", "artisticSkills"], ["semester", "course", "technicalSkills", "artisticSkills"])}
      </div>
    </div>
  );
};

export default ProfileForm;
