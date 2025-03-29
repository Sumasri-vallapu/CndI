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
  const [grampanchayat, setGrampanchayat] = useState("");
  const [grampanchayats, setGrampanchayats] = useState<LocationOption[]>([]);

  // ✅ Location Data
  const [locations, setLocations] = useState({
    states: [],
    districts: [],
    mandals: [],
    grampanchayats: []
  });

  // ✅ Fetch Full Name using Mobile Number
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!mobileNumber) return;
      try {
        const response = await fetch(ENDPOINTS.GET_FELLOW_DETAILS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: mobileNumber }),
        });
        const data = await response.json();
        console.log('data', data)
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
        setLocations({ ...locations, states: data });
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
        const response = await fetch(ENDPOINTS.GET_DISTRICTS + `?state_id=${state}`);
        const data = await response.json();
        setLocations({ ...locations, districts: data });
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
        const response = await fetch(ENDPOINTS.GET_MANDALS + `?district_id=${district}`);
        const data = await response.json();
        setLocations({ ...locations, mandals: data });
      } catch (error) {
        console.error("Error fetching mandals:", error);
      }
    };
    fetchMandals();
  }, [district]);

  useEffect(() => {
    if (!mandal) return;
    const fetchGrampanchayats = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_GRAMPANCHAYATS + `?mandal_id=${mandal}`);
        const data = await response.json();
        setGrampanchayats(data);
      } catch (error) {
        console.error("Error fetching grampanchayats:", error);
      }
    };
    fetchGrampanchayats();
  }, [mandal]);

  // Add this check at the start of the component
  useEffect(() => {
    const checkSignup = async () => {
      if (!mobileNumber) return;
      try {
        const response = await fetch(ENDPOINTS.GET_FELLOW_DETAILS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile_number: mobileNumber }),
        });
        if (!response.ok) {
          // If not signed up, redirect to signup
          navigate('/signup', { state: { mobileNumber } });
        }
      } catch (error) {
        console.error("Error checking signup:", error);
        navigate('/signup', { state: { mobileNumber } });
      }
    };
    checkSignup();
  }, [mobileNumber, navigate]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("user_token");
    sessionStorage.clear();
    navigate("/login");
  };

  // ✅ Handle Registration
  const handleRegister = async () => {
    if (!mobileNumber || !fullName || !dob || !gender || !casteCategory || 
        !state || !district || !mandal || !grampanchayat) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.FELLOW_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          date_of_birth: dob.toISOString().split("T")[0],
          gender,
          caste_category: casteCategory,
          state,
          district,
          mandal,
          grampanchayat
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
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
          <h2 className="text-2xl font-bold text-walnut">Fellowship Registration</h2>
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
              minDate={new Date("2000-01-01")}
              maxDate={new Date()}
              yearDropdownItemNumber={new Date().getFullYear() - 2000 + 1} // 👈 Key fix
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full signup-input">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black">
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
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
                <SelectItem value="ST">ST</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="BC">BC</SelectItem>
                <SelectItem value="OBC">OBC</SelectItem>
                <SelectItem value="OC">OC</SelectItem>
                <SelectItem value="MUSLIM">Muslim</SelectItem>
                <SelectItem value="CHRISTIAN">Christian</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-walnut">Location Information</h3>
          {[{ label: "State", value: state, setter: setState, options: locations.states },
            { label: "District", value: district, setter: setDistrict, options: locations.districts },
            { label: "Mandal", value: mandal, setter: setMandal, options: locations.mandals },
            { label: "Grampanchayat", value: grampanchayat, setter: setGrampanchayat, options: grampanchayats }]
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
