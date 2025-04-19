// Full Updated LearningCenter.tsx - Final Order + All Fields
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
  //const [photo, setPhoto] = useState<File | null>(null);

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
      colonyName: "",
      doorNumber: "",
      landmark: "",
    },
  });

  const [locationData, setLocationData] = useState<{
    states: LocationOption[];
    districts: LocationOption[];
    mandals: LocationOption[];
    villages: LocationOption[];
    districtLeads: LocationOption[];
    teamLeads: LocationOption[];

  }>({
    states: [],
    districts: [],
    mandals: [],
    villages: [],
    districtLeads: [],
    teamLeads: [],
  });
  const [previewPhoto, setPreviewPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);


  useEffect(() => {
    const mobile = localStorage.getItem("mobile_number");
    if (!mobile) return;

    const fetchFullName = async () => {
      const mobile = localStorage.getItem("mobile_number");
      if (!mobile) return;

      try {
        const res = await fetch(ENDPOINTS.GET_FELLOW_PROFILE(mobile));
        const result = await res.json();

        if (result?.status === "success") {
          setCenterData((prev) => ({
            ...prev,
            fullName: result.data?.personal_details?.full_name || "",
          }));
        } else {
          console.warn("⚠️ Full name fetch returned no success:", result);
        }
      } catch (err) {
        console.error("❌ Failed to fetch full name:", err);
      }
    };



    const fetchData = async () => {
      try {
        const stateRes = await fetch(ENDPOINTS.GET_STATES);
        const states = await stateRes.json();
        setLocationData((prev) => ({ ...prev, states }));

        const res = await fetch(ENDPOINTS.GET_LEARNING_CENTER(mobile));
        const data = await res.json();

        const convertedData = {
          ...data,
          address: {
            ...data.address,
            mandal: data.address?.mandal ? String(data.address.mandal) : "",
            district: data.address?.district ? String(data.address.district) : "",
            state: data.address?.state ? String(data.address.state) : "",
            village: data.address?.village ? String(data.address.village) : "",
          },
        };

        console.log("🧪 Loaded Mandal ID:", convertedData.address.mandal, typeof convertedData.address.mandal);

        setCenterData((prev) => ({
          ...prev,
          ...convertedData,
          address: {
            ...prev.address,
            ...convertedData.address,
          },
        }));


        if (data.lc_photo_url) {
          setPhotoUrl(data.lc_photo_url);  // <- This updates the UI with uploaded photo
        }

        const { state, district, mandal } = data.address;
        if (state) {
          const districtRes = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${state}`);
          const districts = await districtRes.json();
          setLocationData((prev) => ({ ...prev, districts }));
        }

        if (district && district !== "None" && district.trim() !== "") {
          console.log("✅ Fetching mandals for district:", district);  // Debugging
          try {
            const mandalRes = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${district}`);
            const mandals = await mandalRes.json();

            const districtLeadRes = await fetch(ENDPOINTS.GET_DISTRICT_LEADS(district));
            const districtLeads = await districtLeadRes.json();
            console.log("✅ District Leads fetched:", districtLeads);

            setLocationData((prev) => ({ ...prev, mandals, districtLeads }));
          } catch (err) {
            console.error("❌ Failed to fetch mandals or district leads:", err);
          }
        } else {
          console.warn("⚠️ Skipped mandal fetch - invalid district:", district);
        }


        if (data.districtLeadName) {
          const teamLeadRes = await fetch(ENDPOINTS.GET_TEAM_LEADS(data.districtLeadName));
          const teamLeads = await teamLeadRes.json();

          setLocationData((prev) => ({
            ...prev,
            teamLeads, // ✅ update
          }));
        }


        if (mandal && mandal !== "None" && mandal.trim() !== "") {
          try {
            const villageRes = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandal}`);
            const villages = await villageRes.json();
            setLocationData((prev) => ({ ...prev, villages }));
          } catch (err) {
            console.error("❌ Failed to fetch villages:", err);
          }
        } else {
          console.warn("⚠️ Skipped village fetch - invalid mandal:", mandal);
        }

      } catch (err) {
        console.error("Failed to load center data:", err);
      }
    };

    fetchFullName();
    fetchData();
  }, []);

  const handleInputChange = (section: string, fieldKey: string, value: string) => {
    if (section === "address") {
      setCenterData((prev) => ({
        ...prev,
        address: { ...prev.address, [fieldKey]: value },
      }));
    } else {
      setCenterData((prev) => ({ ...prev, [fieldKey]: value }));
    }
  };

  //Save Learning Center Data
  const handleSave = async (section: string) => {
    const mobile = localStorage.getItem("mobile_number");
    if (!mobile) return;

    const cleanCenterData = JSON.parse(JSON.stringify(centerData), (_, value) => {
      if (value === "None") return null;
      return value;
    });

    if ("fullAddress" in cleanCenterData.address) {
      delete cleanCenterData.address.fullAddress;
    }


    const payload = {
      mobile_number: mobile,
      center_data: cleanCenterData,
    };

    try {
      // Save LC data
      const res = await fetch(ENDPOINTS.SAVE_LEARNING_CENTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "success") {
        alert("✅ Data saved successfully");
      } else {
        alert("❌ Save failed: " + (data.message || data.error || "Unknown error"));
      }

      // 🔥 Upload photo if present
      if (section === "top" && previewPhoto) {
        const formData = new FormData();
        formData.append("mobile_number", mobile);
        formData.append("photo", previewPhoto);

        const photoRes = await fetch(ENDPOINTS.UPLOAD_LC_PHOTO, {
          method: "POST",
          body: formData,
        });

        const photoData = await photoRes.json();
        if (photoData.status === "success") {
          alert("✅ Photo uploaded successfully");
        } else {
          alert("❌ Photo upload failed: " + (photoData.message || photoData.error || "Unknown error"));
        }
      }
    } catch (err) {
      alert("❌ Error saving data or uploading photo");
      console.error("Error:", err);
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
    console.log("📦 Selected District ID:", districtId);

    // 🟡 Update form state to clear mandal & village
    setCenterData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        district: districtId,
        mandal: "",
        village: "",
      },
      districtLeadName: "",
      teamLeadName: "",
    }));

    try {
      // 🟢 Fetch mandals and district leads
      const [mandalRes, districtLeadRes] = await Promise.all([
        fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`),
        fetch(`${ENDPOINTS.GET_DISTRICT_LEADS(districtId)}`),
      ]);

      const mandals = await mandalRes.json();
      const districtLeads = await districtLeadRes.json();

      console.log("✅ Mandals fetched:", mandals);

      setLocationData((prev) => ({
        ...prev,
        mandals,
        villages: [],
        districtLeads,
        teamLeads: [],
      }));
    } catch (err) {
      console.error("❌ Failed to fetch mandals or district leads:", err);
    }
  };



  const handleMandalChange = async (mandalId: string) => {
    console.log("📍 Selected Mandal ID:", mandalId);

    // 🟡 Update form data
    setCenterData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        mandal: mandalId,
        village: "",
      },
    }));

    try {
      // 🟢 Fetch villages
      const res = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
      const villages = await res.json();
      console.log("✅ Villages fetched:", villages);
      setLocationData((prev) => ({ ...prev, villages }));
    } catch (err) {
      console.error("❌ Failed to fetch villages:", err);
    }
  };


  const handleDistrictLeadChange = async (dlId: string) => {
    setCenterData((prev) => ({
      ...prev,
      districtLeadName: dlId,
      teamLeadName: "",  // Reset team lead
    }));

    console.log("📤 Calling team leads API for dlId:", dlId);
    console.log("➡️ URL:", ENDPOINTS.GET_TEAM_LEADS(dlId));

    const res = await fetch(ENDPOINTS.GET_TEAM_LEADS(dlId));
    const teamLeads = await res.json();

    console.log("✅ Team leads API response:", teamLeads);

    setLocationData((prev) => ({
      ...prev,
      teamLeads,
    }));
  };


  const renderField = ({ section, fieldKey, label, value, placeholder, readOnly = false }: { section: string; fieldKey: string; label: string; value: string; placeholder?: string; readOnly?: boolean }) => (
    <div className="space-y-2" key={fieldKey}>
      <Label>{label}</Label>
      {readOnly ? (
        <p className="bg-gray-100 p-3 rounded text-gray-700">{value || "Loading..."}</p>
      ) : isEditing === section ? (
        <Input value={value} onChange={(e) => handleInputChange(section, fieldKey, e.target.value)} placeholder={placeholder || `Enter ${label}`} className="signup-input" />
      ) : (
        <p className="bg-gray-100 p-3 rounded text-gray-700">{value || "Please Provide"}</p>
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
              <SelectItem
                key={String(opt.id)}
                value={String(opt.id)}  // ✅ Convert to string always
                className="cursor-pointer hover:bg-gray-100"
              >
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="bg-gray-100 p-3 rounded text-gray-700">
          {options.find((s) => String(s.id) === String(value))?.name || "Please Provide"}
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
        <Button variant="ghost" className="text-walnut hover:text-earth flex items-center gap-2" onClick={() => navigate("/main")}> <ArrowLeft size={20} /> <span className="text-base font-medium">Back</span> </Button>
        <Button className="bg-walnut text-white px-4 py-2 rounded-lg text-sm" onClick={() => navigate("/")}> Logout </Button>
      </div>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="flex justify-center mb-6"> <img src="/Images/organization_logo.png" alt="Organization Logo" className="h-20 w-auto object-contain" /> </div>

        {renderField({ section: "info", fieldKey: "fullName", label: "Full Name", value: centerData.fullName, readOnly: true })}

        <div className="w-full p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" onClick={() => toggleSection("address")}> Learning Center Address <span>{activeSection === "address" ? "▼" : "►"}</span> </h3>
          {activeSection === "address" && (
            <div className="mt-3 space-y-4">
              {renderSelect("address", "State", centerData.address.state, locationData.states, handleStateChange)}
              {renderSelect("address", "District", centerData.address.district, locationData.districts, handleDistrictChange)}
              {renderSelect("address", "Mandal", centerData.address.mandal, locationData.mandals, handleMandalChange)}
              {renderSelect("address", "Village", centerData.address.village, locationData.villages, (v) => handleInputChange("address", "village", v))}
              {renderField({ section: "address", fieldKey: "pincode", label: "Pincode", value: centerData.address.pincode })}
              {renderField({ section: "address", fieldKey: "colonyName", label: "Colony Name", value: centerData.address.colonyName })}
              {renderField({ section: "address", fieldKey: "doorNumber", label: "Door No / H.No / Street No", value: centerData.address.doorNumber })}
              {renderField({ section: "address", fieldKey: "landmark", label: "Landmark", value: centerData.address.landmark })}

              {isEditing === "address" ? (
                <>
                  <Button onClick={() => handleSave("address")} className="w-full bg-green-600 text-white">Save Changes</Button>
                  <Button onClick={() => setIsEditing(null)} className="w-full">Cancel</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing("address")} className="w-full bg-walnut text-white">Edit</Button>
              )}
            </div>
          )}
        </div>

        <div className="w-full p-6 bg-white shadow-lg border border-gray-200 rounded-lg space-y-4">
          {renderSelect("top", "District Lead", centerData.districtLeadName, locationData.districtLeads, handleDistrictLeadChange)}
          {renderSelect("top", "Team Lead", centerData.teamLeadName, locationData.teamLeads, (v) => handleInputChange("top", "teamLeadName", v))}

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
              <p className="bg-gray-100 p-3 rounded text-gray-700">{centerData.status || "Please Provide"}</p>
            )}
          </div>

          {/* Upload LC Photo */}
          <div className="space-y-2">
            <Label>Upload Photo of LC</Label>

            {isEditing === "top" ? (
              <>
                {/* Dropzone or Preview */}
                {!previewPhoto ? (
                  <Dropzone onDrop={(acceptedFiles) => setPreviewPhoto(acceptedFiles[0])}>
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer bg-white flex flex-col items-center justify-center"
                      >
                        <input {...getInputProps()} />
                        <ImageUp className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">Click or drop to select a photo</p>
                      </div>
                    )}
                  </Dropzone>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4 border rounded-md shadow bg-gray-50">
                    <img
                      src={URL.createObjectURL(previewPhoto)}
                      alt="Preview"
                      className="max-h-40 object-contain rounded"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 text-white"
                        onClick={async () => {
                          const formData = new FormData();
                          formData.append("mobile_number", localStorage.getItem("mobile_number") || "");
                          formData.append("photo", previewPhoto);

                          try {
                            const res = await fetch(ENDPOINTS.UPLOAD_LC_PHOTO, {
                              method: "POST",
                              body: formData,
                            });
                            const result = await res.json();
                            if (result.status === "success") {
                              setPhotoUrl(result.photo_url);  // ✅ Save uploaded URL
                              setPreviewPhoto(null);          // ✅ Clear preview
                              alert("✅ Photo uploaded successfully");
                            } else {
                              alert("❌ Upload failed");
                            }
                          } catch {
                            alert("❌ Upload failed");
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setPreviewPhoto(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Uploaded file display */}
                {photoUrl && !previewPhoto && (
                  <div className="flex justify-between items-center mt-3 px-4 py-2 bg-gray-100 border rounded-md">
                    <p className="text-sm text-gray-700 truncate">{photoUrl.split("/").pop()}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={async () => {
                        try {
                          const res = await fetch(ENDPOINTS.DELETE_LC_PHOTO, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              mobile_number: localStorage.getItem("mobile_number"),
                            }),
                          });
                          const result = await res.json();
                          if (result.status === "success") {
                            setPhotoUrl(null);
                            alert("🗑️ Photo deleted successfully");
                          } else {
                            alert("❌ Deletion failed: " + (result.message || result.error));
                          }
                        } catch (err) {
                          alert("❌ Error deleting photo");
                        }
                      }}
                    >
                      🗑
                    </Button>
                  </div>
                )}

              </>
            ) : (
              <p className="bg-gray-100 p-3 rounded text-gray-700">
                {photoUrl ? photoUrl.split("/").pop() : "Upload LC Photo"}
              </p>
            )}
          </div>



          {isEditing === "top" ? (
            <>
              <Button onClick={() => handleSave("top")} className="w-full bg-green-600 text-white">Save Changes</Button>
              <Button onClick={() => setIsEditing(null)} className="w-full">Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing("top")} className="w-full bg-walnut text-white">Edit</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningCenter;
