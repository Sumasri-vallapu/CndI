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

  // ✅ Success Message State
  const [showSuccess, setShowSuccess] = useState(false);

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
      
      // Show success message
      setShowSuccess(true);
      
      // Navigate after 3 seconds
      setTimeout(() => {
        navigate("/tasks", { state: { mobileNumber } });
      }, 3000);

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 space-y-20">
      <div className="flex flex-col items-center bg-white px-6 py-8 w-96 shadow-lg rounded-lg">
        <img src="/Images/organization_logo.png" alt="Logo" className="h-16 w-auto object-contain mb-4" loading="eager" />
        <h2 className="text-2xl font-bold text-center text-walnut mt-2 mb-5">Fellow Registration</h2>

        {/* Success Message */}
        {showSuccess && (
          <div className="w-full mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-center font-medium">
              Successfully registered! Redirecting to tasks...
            </p>
          </div>
        )}

        <CardContent className="space-y-6">
                   {/* ✅ Personal Information */}
                   <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-walnut mb-3">Personal Information</h3>
            {[ 
              { label: "Mobile", value: mobileNumber, isReadOnly: true },
              { label: "Full Name", value: fullName, isReadOnly: true }
            ].map(({ label, value, isReadOnly }) => (
              <div key={label} className="flex items-center gap-4">
                <Label className="w-1/3">{label}</Label>
                <Input type="text" value={value} readOnly={isReadOnly} className="w-2/3 bg-gray-100" />
              </div>
            ))}

            {/* ✅ Date of Birth */}
            <div className="flex items-center gap-4">
              <Label className="w-1/3">DOB</Label>
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="dd-MM-yyyy"
                className="w-2/3 border-gray-300 px-4 py-2 rounded-lg"
                placeholderText="Select DOB"
              />
            </div>

            {/* ✅ Gender */}
            <div className="flex items-center gap-4">
              <Label className="w-1/3">Gender</Label>
              <div className="w-2/3">
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
            </div>

            {/* ✅ Caste Category */}
            <div className="flex items-center gap-4">
              <Label className="w-1/3">Caste</Label>
              <div className="w-2/3">
                <Select value={casteCategory} onValueChange={setCasteCategory}>
                  <SelectTrigger className="select-trigger">
                    <SelectValue placeholder="Select Caste" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

          <Button 
            className="w-full bg-walnut text-white py-3 rounded-lg" 
            onClick={handleRegister} 
            disabled={loading || showSuccess}
          >
            {loading ? "Registering..." : "Submit Details"}
          </Button>
        </CardContent>
      </div>
    </div>
  );
};

export default Register;



