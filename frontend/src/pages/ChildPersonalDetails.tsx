import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ENDPOINTS } from "@/utils/api";

interface LocationOption {
  id: string;
  name: string;
}

export default function ChildPersonalDetails() {
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [caste, setCaste] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [fullName, setFullName] = useState("");

  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [mandals, setMandals] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const isMobileValid = /^([6-9]\d{9})$/.test(mobileNumber);

  useEffect(() => {
    fetch(ENDPOINTS.GET_STATES)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error("Failed to fetch states", err));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${selectedState}`)
        .then((res) => res.json())
        .then((data) => setDistricts(data))
        .catch((err) => console.error("Failed to fetch districts", err));
    } else {
      setDistricts([]);
      setMandals([]);
      setVillages([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${selectedDistrict}`)
        .then((res) => res.json())
        .then((data) => setMandals(data))
        .catch((err) => console.error("Failed to fetch mandals", err));
    } else {
      setMandals([]);
      setVillages([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedMandal) {
      fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${selectedMandal}`)
        .then((res) => res.json())
        .then((data) => setVillages(data))
        .catch((err) => console.error("Failed to fetch grampanchayats", err));
    } else {
      setVillages([]);
    }
  }, [selectedMandal]);

  return (
    <div className="min-h-screen bg-[#F4F1E3] flex flex-col items-center px-4 py-6">
      <div className="w-full flex items-center justify-between max-w-3xl mb-4">
        <button
          onClick={() => navigate("/children-profile")}
          className="text-walnut hover:text-earth flex items-center gap-2 text-base font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("mobile_number");
            navigate("/login");
          }}
          className="bg-walnut text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      <StepIndicator
        currentStep={1}
        steps={["Personal Details", "Learning Details", "Parent or Guardian Details", "Educational Details"]}
      />

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="w-full flex justify-center mb-2">
          <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        <h2 className="text-xl font-bold text-walnut text-center">Child Personal Information</h2>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Child name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut"
          />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:border-walnut">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Caste Category</Label>
          <Select value={caste} onValueChange={setCaste}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:border-walnut">
              <SelectValue placeholder="Select Caste" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
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

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-walnut"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile_number">Parent Mobile Number</Label>
          <Input
            id="mobile_number"
            type="text"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className={`signup-input ${!isMobileValid && mobileNumber ? "border-red-500" : ""}`}
          />
          {!isMobileValid && mobileNumber && (
            <p className="text-red-500 text-sm">Enter valid 10-digit number</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>State</Label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:border-walnut">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>{state.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>District</Label>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:border-walnut">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Mandal</Label>
          <Select value={selectedMandal} onValueChange={setSelectedMandal}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:border-walnut">
              <SelectValue placeholder="Select Mandal" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {mandals.map((m) => (
                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Village</Label>
          <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:border-walnut">
              <SelectValue placeholder="Select Village" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {villages.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex justify-end pt-4">
          <button
            onClick={() => navigate("/child-learning-details")}
            className="bg-walnut text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-earth"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
