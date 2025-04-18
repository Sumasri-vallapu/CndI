// Full Updated LearningCenter.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Dropzone from "react-dropzone";
import { ImageUp, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";

interface LocationOption {
  id: string;
  name: string;
}

const LearningCenter = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const [centerData, setCenterData] = useState({
    fullName: "",
    teamLeadName: "",
    districtLeadName: "",
    status: "",
    address: {
      state: "",
      district: "",
      mandal: "",
      village: "",
      pincode: "",
      fullAddress: "",
    },
  });

  const [locationData, setLocationData] = useState<{
    states: LocationOption[];
    districts: LocationOption[];
    mandals: LocationOption[];
    villages: LocationOption[];
  }>({
    states: [],
    districts: [],
    mandals: [],
    villages: [],
  });

  useEffect(() => {
    const mobile = localStorage.getItem("mobile_number");
    if (!mobile) return;

    const fetchFullName = async () => {
      try {
        const res = await fetch(ENDPOINTS.GET_FELLOW_PROFILE(mobile));
        const result = await res.json();
        if (result?.status === "success") {
          setCenterData((prev) => ({
            ...prev,
            fullName: result.data?.personal_details?.full_name || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch full name:", err);
      }
    };

    const fetchData = async () => {
      try {
        const stateRes = await fetch(ENDPOINTS.GET_STATES);
        const states = await stateRes.json();
        setLocationData((prev) => ({ ...prev, states }));

        const res = await fetch(ENDPOINTS.GET_LEARNING_CENTER(mobile));
        const data = await res.json();
        setCenterData((prev) => ({ ...prev, ...data }));

        const { state, district, mandal } = data.address;
        if (state) {
          const districtRes = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${state}`);
          const districts = await districtRes.json();
          setLocationData((prev) => ({ ...prev, districts }));
        }

        if (district) {
          const mandalRes = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${district}`);
          const mandals = await mandalRes.json();
          setLocationData((prev) => ({ ...prev, mandals }));
        }

        if (mandal) {
          const villageRes = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandal}`);
          const villages = await villageRes.json();
          setLocationData((prev) => ({ ...prev, villages }));
        }
      } catch (err) {
        console.error("Failed to load center data:", err);
      }
    };

    fetchFullName();
    fetchData();
  }, []);

  const handleInputChange = (section: string, key: string, value: string) => {
    if (section === "address") {
      setCenterData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setCenterData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    const mobile = localStorage.getItem("mobile_number");
    if (!mobile) return;

    const payload = {
      mobile_number: mobile,
      center_data: centerData,
    };

    try {
      const res = await fetch(ENDPOINTS.SAVE_LEARNING_CENTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "success") alert("✅ Saved successfully");
      else alert("❌ Save failed: " + (data.message || data.error || "Unknown error"));
    } catch (err) {
      alert("❌ Error saving data");
    }

    setIsEditing(null);
  };

  const handleStateChange = async (stateId: string) => {
    setCenterData((prev) => ({
      ...prev,
      address: { ...prev.address, state: stateId, district: "", mandal: "", village: "" },
    }));
    const res = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`);
    const data = await res.json();
    setLocationData((prev) => ({ ...prev, districts: data, mandals: [], villages: [] }));
  };

  const handleDistrictChange = async (districtId: string) => {
    setCenterData((prev) => ({
      ...prev,
      address: { ...prev.address, district: districtId, mandal: "", village: "" },
    }));
    const res = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`);
    const data = await res.json();
    setLocationData((prev) => ({ ...prev, mandals: data, villages: [] }));
  };

  const handleMandalChange = async (mandalId: string) => {
    setCenterData((prev) => ({
      ...prev,
      address: { ...prev.address, mandal: mandalId, village: "" },
    }));
    const res = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
    const data = await res.json();
    setLocationData((prev) => ({ ...prev, villages: data }));
  };

  const renderField = ({
    section,
    label,
    value,
    placeholder,
    readOnly = false,
  }: {
    section: string;
    label: string;
    value: string;
    placeholder?: string;
    readOnly?: boolean;
  }) => (
    <div className="space-y-2" key={label}>
      <Label>{label}</Label>
      {readOnly ? (
        <p className="bg-gray-100 p-3 rounded text-gray-700">
          {value || "Loading..."}
        </p>
      ) : isEditing === section ? (
        <Input
          value={value}
          onChange={(e) => handleInputChange(section, label, e.target.value)}
          placeholder={placeholder || `Enter ${label}`}
          className="signup-input"
        />
      ) : (
        <p className="bg-gray-100 p-3 rounded text-gray-700">
          {value || "Please Provide"}
        </p>
      )}
    </div>
  );

  const renderSelect = (
    section: string,
    label: string,
    value: string,
    options: LocationOption[],
    onChange: (value: string) => void
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {isEditing === section ? (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger className="w-full signup-input">
            <SelectValue placeholder={`Select ${label}`} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md text-black max-h-64 overflow-auto">
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id.toString()} className="cursor-pointer hover:bg-gray-100">
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="bg-gray-100 p-3 rounded text-gray-700">
          {options.find((s) => s.id.toString() === value)?.name || "Please Provide"}
        </p>
      )}
    </div>
  );

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <Button variant="ghost" className="text-walnut hover:text-earth flex items-center gap-2" onClick={() => navigate("/main")}>
          <ArrowLeft size={20} />
          <span className="text-base font-medium">Back</span>
        </Button>
        <Button className="bg-walnut text-white px-4 py-2 rounded-lg text-sm" onClick={() => navigate("/")}>
          Logout
        </Button>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Images/organization_logo.png" alt="Organization Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Full name */}
        {renderField({ section: "info", label: "Full Name", value: centerData.fullName, readOnly: true })}

        {/* TeamLead/DistrictLead/Status/Photo Container */}
        <div className="w-full p-6 bg-white shadow-lg border border-gray-200 rounded-lg space-y-4">
          {renderField({ section: "top", label: "Team Lead Name", value: centerData.teamLeadName })}
          {renderField({ section: "top", label: "District Lead Name", value: centerData.districtLeadName })}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            {isEditing === "top" ? (
              <Select value={centerData.status} onValueChange={(v) => handleInputChange("top", "status", v)}>
                <SelectTrigger className="w-full signup-input">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="bg-gray-100 p-3 rounded text-gray-700">
                {centerData.status || "Please Provide"}
              </p>
            )}
          </div>

          {/* Upload LC Photo */}
          <div className="space-y-2">
            <Label>Upload Photo of LC</Label>
            {isEditing === "top" ? (
              <Dropzone onDrop={(acceptedFiles) => setPhoto(acceptedFiles[0])}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-white flex flex-col items-center justify-center">
                    <input {...getInputProps()} />
                    <ImageUp className="w-8 h-8 text-gray-400 mb-2" />
                    {photo ? <p className="text-green-600">{photo.name}</p> : <p className="text-gray-500">Drop or Click to Upload</p>}
                  </div>
                )}
              </Dropzone>
            ) : (
              <p className="bg-gray-100 p-3 rounded text-gray-700">Upload LC Photo</p>
            )}
          </div>

          {/* Buttons */}
          {isEditing === "top" ? (
            <>
              <Button onClick={handleSave} className="w-full bg-green-600 text-white">Save Changes</Button>
              <Button onClick={() => setIsEditing(null)} className="w-full">Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing("top")} className="w-full bg-walnut text-white">Edit</Button>
          )}
        </div>

        {/* Collapsible Address Section */}
        <div className="w-full p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" onClick={() => toggleSection("address")}>
            Learning Center Address
            <span>{activeSection === "address" ? "▼" : "►"}</span>
          </h3>
          {activeSection === "address" && (
            <div className="mt-3 space-y-4">
              {renderSelect("address", "State", centerData.address.state, locationData.states, handleStateChange)}
              {renderSelect("address", "District", centerData.address.district, locationData.districts, handleDistrictChange)}
              {renderSelect("address", "Mandal", centerData.address.mandal, locationData.mandals, handleMandalChange)}
              {renderSelect("address", "Village", centerData.address.village, locationData.villages, (v) => handleInputChange("address", "village", v))}
              {renderField({ section: "address", label: "Pincode", value: centerData.address.pincode })}
              {renderField({ section: "address", label: "Full Address", value: centerData.address.fullAddress })}

              {isEditing === "address" ? (
                <>
                  <Button onClick={handleSave} className="w-full bg-green-600 text-white">Save Changes</Button>
                  <Button onClick={() => setIsEditing(null)} className="w-full">Cancel</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing("address")} className="w-full bg-walnut text-white">Edit</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
