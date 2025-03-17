import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ENDPOINTS } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowRight } from "lucide-react"; // ✅ Import the correct icon

interface LocationOption {
  id: string;
  name: string;
}

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Personal Information State
  const mobileNumber = location.state?.mobileNumber || "";
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [gender, setGender] = useState("");
  const [casteCategory, setCasteCategory] = useState("");

  // ✅ Location Information State
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Location Data
  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [mandals, setMandals] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]); 

  // ✅ Fetch Full Name using Mobile Number
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!mobileNumber) return;
      try {
        const response = await fetch(`${ENDPOINTS.GET_USER_DETAILS}?mobile_number=${mobileNumber}`);
        const data = await response.json();
        if (response.ok) {
          setFullName(data.full_name);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [mobileNumber]);

  // ✅ Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_STATES);
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!state) return;
    const fetchDistricts = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_DISTRICTS(state));
        const data = await response.json();
        setDistricts(data); 
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, [state]);

  useEffect(() => {
    if (!district) return;
    const fetchMandals = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_MANDALS(district));
        const data = await response.json();
        setMandals(data);
      } catch (error) {
        console.error("Error fetching mandals:", error);
      }
    };
    fetchMandals();
  }, [district]);

  useEffect(() => {
    if (!mandal) return;
    const fetchVillages = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_VILLAGES(mandal));
        const data = await response.json();
        setVillages(data);
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    };
    fetchVillages();
  }, [mandal]);

  // ✅ Logout Function
  const handleLogout = () => {
    // Clear stored session (adjust based on your auth system)
    localStorage.removeItem("user_token");
    sessionStorage.clear();
    
    // Redirect to login page
    navigate("/login");
  };

  // ✅ Handle Registration
  const handleRegister = async () => {
    if (!mobileNumber || !fullName || !dob || !gender || !casteCategory || !state || !district || !mandal || !village) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          full_name: fullName,
          date_of_birth: dob.toISOString().split("T")[0],
          gender,
          caste_category: casteCategory,
          state,
          district,
          mandal,
          village,
        }),
      });

      if (!response.ok) throw new Error("Registration failed");

      // Show success message without auto-navigation
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigate to Tasks page
  const proceedToTasks = () => {
    navigate("/tasks", { state: { mobileNumber } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F1E3] px-6 space-y-6">
      {/* ✅ Registration Form Container */}
      <div className="flex flex-col items-center bg-[#F6F3E6] min-h-screen min-w-screen shadow-lg rounded-lg">
        {/* ✅ Header Wrapper with Logout Button & Centered Logo */}
        <div className="relative w-full flex flex-col items-center">
          {/* Logout Button at the Top Right */}
          <div className="absolute right-4 top-2 md:top-4">
            <button 
              onClick={handleLogout} 
              className="bg-walnut text-white px-3 py-1 rounded-md text-xs md:text-sm hover:bg-white hover:text-walnut border border-walnut transition-all shadow-md"
            >
              Logout
            </button>
          </div>

          {/* Centered Logo with Extra Margin for Separation */}
          <div className="flex justify-center w-full mt-10">
            <img src="/Images/organization_logo.png" alt="Logo" 
              className="h-14 w-auto object-contain" loading="eager" />
          </div>
        </div> 

        <h2 className="text-2xl font-bold text-center text-walnut mt-2 mb-5">Fellow Registration</h2>

        <CardContent className="space-y-6">
          {/* ✅ Personal Information */}
          <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-walnut mb-3">Personal Information</h3>
            {[               
              { label: "Full Name", value: fullName, isReadOnly: true },
              { label: "Mobile", value: mobileNumber, isReadOnly: true }
            ].map(({ label, value, isReadOnly }) => (
              <div key={label} className="flex items-center">
                <Label className="w-1/3">{label}</Label>
                <Input type="text" value={value} readOnly={isReadOnly} />
              </div>
            ))}
            
          {/* ✅ Date of Birth */}
          <div className="flex items-center">
  <Label className="w-1/3">Date of Birth</Label>
  <div className="w-2/3">
    <DatePicker
      selected={dob}
      onChange={(date: Date | null) => setDob(date)}
      className="w-full select-trigger p-2 border border-gray-300 rounded-md"
      placeholderText="Select Date of Birth"
      dateFormat="yyyy-MM-dd"
      showYearDropdown
      scrollableYearDropdown
    />
  </div>
</div>

          {/* ✅ Gender */}
<div className="flex items-center mt-4">
  <Label className="w-1/3">Gender</Label>
  <Select value={gender} onValueChange={setGender}>
    <SelectTrigger className="select-trigger">
      <SelectValue placeholder="Select Gender" />
    </SelectTrigger>
    <SelectContent className="select-content">
      <SelectItem value="male">Male</SelectItem>
      <SelectItem value="female">Female</SelectItem>
      <SelectItem value="other">Other</SelectItem>
    </SelectContent>
  </Select>
</div>
            
            {/* Caste Category */}
            <div className="flex items-center gap-4 mt-2">
              <Label>Caste</Label>
              <Select value={casteCategory} onValueChange={setCasteCategory}>
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select Caste Category" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ✅ Location Information */}
          <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-walnut mb-3">Location Information</h3>
            {[{ label: "State", value: state, options: states, setter: setState },
              { label: "District", value: district, options: districts, setter: setDistrict },
              { label: "Mandal", value: mandal, options: mandals, setter: setMandal },
              { label: "Village", value: village, options: villages, setter: setVillage }]
              .map(({ label, value, options, setter }) => (
                <div key={label} className="flex items-center gap-4">
                  <Label className="w-1/3">{label}</Label>
                  <Select value={value} onValueChange={setter}>
                    <SelectTrigger className="select-trigger">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent className="select-content">
                      {options.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id} className="select-item">
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>

{/* ✅ Success Message with Proceed Button */}
{showSuccess && (
  <div className="w-full mb-4">
    {/* ✅ Bold Green Text */}
    <p className="text-green-600 font-bold text-center">
      Dear Youth Volunteer, you have successfully registered for the Bose Fellowship!
    </p>

    {/* ✅ Proceed Button with Right-Aligned Icon */}
    <Button 
      className="w-full bg-walnut text-white py-1 rounded-lg flex items-center justify-between px-4 hover:bg-walnut/90"
      onClick={proceedToTasks}
    >
      <span className="flex-1 text-center">Proceed to the next stage of your Application</span>
      <ArrowRight size={20} strokeWidth={2} /> {/* ✅ Proper forward icon */}
    </Button>
  </div>
)}


          {/* Registration Button (only shown if not yet successful) */}
          {!showSuccess && (
            <Button className="w-full bg-walnut text-white py-3 rounded-lg" onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Submit Details"}
            </Button>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default Register;  
