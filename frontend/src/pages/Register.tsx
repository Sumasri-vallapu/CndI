import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"; // Required for date formatting

const Register = () => {
  const navigate = useNavigate(); 
  const mobileNumber = "8431848403"; // Hardcoded value
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [casteCategory, setCasteCategory] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !gender || !casteCategory || !dob || !state || !district || !mandal || !village) {
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
          gender,
          caste_category: casteCategory,
          date_of_birth: format(dob, "yyyy-MM-dd"), // Ensure correct format
          state,
          district,
          mandal,
          village,
        }),
      });

      if (!response.ok) throw new Error("Registration failed");
      navigate("/home");
    } catch (err) {
      // Fix the TypeScript error by type checking
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="flex flex-col items-center bg-white px-6 py-8 w-96 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-walnut mb-4">Fellow Registration</h2>

        <Input type="text" value={mobileNumber} readOnly className="bg-gray-200 border w-full px-4 py-2 rounded-lg mb-3" />
        <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border w-full px-4 py-2 rounded-lg mb-3" />
        
        {/* ✅ Correct ShadCN Select for Gender */}
        <Select onValueChange={setGender}>
          <SelectTrigger className="border w-full px-4 py-2 rounded-lg mb-3">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        {/* ✅ Correct ShadCN Select for Caste */}
        <Select onValueChange={setCasteCategory}>
          <SelectTrigger className="border w-full px-4 py-2 rounded-lg mb-3">
            <SelectValue placeholder="Select Caste Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sc">SC</SelectItem>
            <SelectItem value="st">ST</SelectItem>
            <SelectItem value="obc">OBC</SelectItem>
            <SelectItem value="gen">General</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Correct Date Picker */}
        <DatePicker 
          selected={dob} 
          onChange={(date) => setDob(date)} 
          dateFormat="yyyy-MM-dd"
          className="border w-full px-4 py-2 rounded-lg mb-3"
        />
        
        {/* ✅ Correct ShadCN Select for State */}
        <Select onValueChange={setState}>
          <SelectTrigger className="border w-full px-4 py-2 rounded-lg mb-3">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="state1">State 1</SelectItem>
            <SelectItem value="state2">State 2</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Correct ShadCN Select for District */}
        <Select onValueChange={setDistrict}>
          <SelectTrigger className="border w-full px-4 py-2 rounded-lg mb-3">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="district1">District 1</SelectItem>
            <SelectItem value="district2">District 2</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Correct ShadCN Select for Mandal */}
        <Select onValueChange={setMandal}>
          <SelectTrigger className="border w-full px-4 py-2 rounded-lg mb-3">
            <SelectValue placeholder="Select Mandal" />
          </SelectTrigger>
          <SelectContent> 
            <SelectItem value="mandal1">Mandal 1</SelectItem>
            <SelectItem value="mandal2">Mandal 2</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Correct ShadCN Select for Village */}
        <Select onValueChange={setVillage}>
          <SelectTrigger className="border w-full px-4 py-2 rounded-lg mb-3">
            <SelectValue placeholder="Select Village" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="village1">Village 1</SelectItem>
            <SelectItem value="village2">Village 2</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full bg-walnut text-white py-3 rounded-lg mt-3" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Submit Details"}
        </Button>
      </div>
    </div>
  );
};

export default Register;
