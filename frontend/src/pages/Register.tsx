import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ENDPOINTS } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft } from "lucide-react"; // Remove ArrowRight

interface LocationOption {
  id: string;
  name: string;
} 

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Add state to track registration success
  const [showSuccess, setShowSuccess] = useState(false);

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
  const [villages, setVillages] = useState<LocationOption[]>([]);

  // ✅ Location Data
  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [mandals, setMandals] = useState<LocationOption[]>([]);

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
    localStorage.removeItem("user_token");
    sessionStorage.clear();
    navigate("/login");
  };

  // ✅ Handle Registration
  const handleRegister = async () => {
    if (!mobileNumber || !fullName || !dob || !gender || !casteCategory || !state || !district || !mandal || !village) {
      alert("All fields are required!");
      return;
    }

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
      
      // Show success message and button on successful registration
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error: " + (error as Error).message);
    }
  };

  // ✅ Handle proceeding to tasks
  const proceedToTasks = () => {
    navigate("/tasks", { state: { mobileNumber } });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F4F1E3] px-6 space-y-6">
      {/* Navigation Bar - stays outside */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <button onClick={() => navigate(-1)} className="text-walnut hover:text-earth">
          <ArrowLeft size={24} />
        </button>
        <button onClick={handleLogout} className="bg-walnut text-white px-3 py-1 rounded-md text-xs md:text-sm">
          Logout
        </button>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Logo and Title Section */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/Images/organization_logo.png" 
            alt="Logo" 
            className="h-16 w-auto object-contain mb-4" 
            loading="eager" 
          />
          <h2 className="text-2xl font-bold text-walnut">Fellow Registration</h2>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-walnut">Personal Information</h3>
          <div className="form-group space-y-2">
            <Label>Mobile</Label>
            <Input type="text" value={mobileNumber} readOnly className="signup-input" />
          </div>
          
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input type="text" value={fullName} readOnly className="signup-input" />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <DatePicker
              selected={dob}
              onChange={(date: Date | null) => setDob(date)} // ✅ Fixed type
              placeholderText="Select Date of Birth"
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              scrollableYearDropdown
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full signup-input">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Caste Category</Label>
            <Select value={casteCategory} onValueChange={setCasteCategory}>
              <SelectTrigger className="w-full signup-input">
                <SelectValue placeholder="Select Caste Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
                <SelectItem value="bc">BC</SelectItem>
                <SelectItem value="christian">Christian</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="muslim">Muslim</SelectItem>
                <SelectItem value="oc">OC</SelectItem>
                <SelectItem value="obc">OBC</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="sc">SC</SelectItem>
                <SelectItem value="st">ST</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-walnut">Location Information</h3>
          {[{ label: "State", value: state, setter: setState, options: states },
            { label: "District", value: district, setter: setDistrict, options: districts },
            { label: "Mandal", value: mandal, setter: setMandal, options: mandals },
            { label: "Village", value: village, setter: setVillage, options: villages }]
            .map(({ label, value, setter, options }) => (
              <div key={label} className="space-y-2">
                <Label>{label}</Label>
                <Select value={value} onValueChange={setter}>
                  <SelectTrigger className="w-full signup-input">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger> 
                  <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
                    {options.map((opt: LocationOption) => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
        </div>

        {/* Success Message with Proceed Button */}
        {showSuccess ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-600 font-medium text-center">
                Dear Youth Volunteer, you have successfully registered for the Bose Fellowship!
              </p>
            </div>
            
            <Button 
              className="btn-primary w-full py-3 text-sm whitespace-normal h-auto"
              onClick={proceedToTasks}
            >
              Click here to proceed to the next stage of your Application
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleRegister} 
            className="btn-primary w-full"
          >
            Register
          </Button>
        )}
      </div>
    </div>
  );
};

export default Register;
