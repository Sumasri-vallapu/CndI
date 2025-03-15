import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";
import { CheckCircle, Video } from "lucide-react";
import Dropzone from "react-dropzone";

interface LocationItem {
  id: string;
  name: string;
}

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;

  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [mandals, setMandals] = useState<LocationItem[]>([]);
  const [gramPanchayats, setGramPanchayats] = useState<LocationItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedMandal, setSelectedMandal] = useState<string>("");
  const [selectedGramPanchayat, setSelectedGramPanchayat] = useState<string>("");
  const [lcPhoto, setLcPhoto] = useState<File | null>(null);
  const [task2Photo, setTask2Photo] = useState<File | null>(null);
  const [task1Status, setTask1Status] = useState<string>("Not Sent for Evaluation");
  const [task2Status, setTask2Status] = useState<string>("Not Sent for Evaluation");
  const [state] = useState("36"); // Set Telangana state_id by default

  // Fetch Districts using state
  useEffect(() => {
    if (!state) return;
    const fetchDistricts = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_DISTRICTS(state));
        if (!response.ok) throw new Error("Failed to fetch districts");
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
        alert("Failed to load districts. Please try again.");
      }
    };
    fetchDistricts();
  }, [state]); // Depend on state value

  // ✅ Fetch Mandals with error handling
  useEffect(() => {
    if (!selectedDistrict) return;
    
    const fetchMandals = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_MANDALS(selectedDistrict));
        if (!response.ok) throw new Error("Failed to fetch mandals");
        const data = await response.json();
        setMandals(data);
        setSelectedMandal(""); // Reset mandal when district changes
      } catch (error) {
        console.error("Error fetching mandals:", error);
        alert("Failed to load mandals. Please try again.");
      }
    };
    fetchMandals();
  }, [selectedDistrict]);

  // ✅ Fetch Gram Panchayats with error handling
  useEffect(() => {
    if (!selectedMandal) return;
    
    const fetchGramPanchayats = async () => {
      try {
        const response = await fetch(ENDPOINTS.GET_VILLAGES(selectedMandal));
        if (!response.ok) throw new Error("Failed to fetch gram panchayats");
        const data = await response.json();
        setGramPanchayats(data);
        setSelectedGramPanchayat(""); // Reset GP when mandal changes
      } catch (error) {
        console.error("Error fetching gram panchayats:", error);
        alert("Failed to load gram panchayats. Please try again.");
      }
    };
    fetchGramPanchayats();
  }, [selectedMandal]);

  // ✅ Enhanced file upload handler with validation
  const handleFileUpload = (acceptedFiles: File[], setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File size should be less than 5MB");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG files are allowed");
      return;
    }
    
    setFile(file);
  };

  // ✅ Submit Task 1 with API integration
  const handleSubmitTask1 = async () => {
    if (!selectedDistrict || !selectedMandal || !selectedGramPanchayat || !lcPhoto || !mobileNumber) {
      alert("All fields and photo are required for Task 1!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("mobile_number", mobileNumber);
      formData.append("district_id", selectedDistrict);
      formData.append("mandal_id", selectedMandal);
      formData.append("grampanchayat_id", selectedGramPanchayat);
      formData.append("lc_photo", lcPhoto);

      const response = await fetch(ENDPOINTS.UPDATE_TASKS, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit task 1");
      setTask1Status("Sent for Evaluation");
    } catch (error) {
      console.error("Error submitting task 1:", error);
      alert("Failed to submit task 1. Please try again.");
    }
  };

  // ✅ Submit Task 2
  const handleSubmitTask2 = async () => {
    if (!task2Photo || !mobileNumber) {
      alert("Photo upload is required for Task 2!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("mobile_number", mobileNumber);
      formData.append("task2_photo", task2Photo);

      const response = await fetch(ENDPOINTS.UPDATE_TASKS, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit task 2");
      setTask2Status("Sent for Evaluation");
    } catch (error) {
      console.error("Error submitting task 2:", error);
      alert("Failed to submit task 2. Please try again.");
    }
  };

  // ✅ Navigate to Next Step
  const handleSubmitTasks = () => {
    if (task1Status !== "Sent for Evaluation" || task2Status !== "Sent for Evaluation") {
      alert("Please complete and submit both tasks first!");
      return;
    }
    navigate("/data-consent", { state: { mobileNumber } });
  };

  useEffect(() => {
    if (!mobileNumber) {
      navigate('/login');
    }
  }, [mobileNumber, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 space-y-6">
      {/* Header with Logo */}
      <div className="flex flex-col items-center w-full max-w-4xl">
        <img 
          src="/Images/organization_logo.png" 
          alt="Logo" 
          className="h-16 w-auto object-contain mb-4" 
          loading="eager" 
        />
        <h2 className="text-2xl font-bold text-center text-walnut mb-5">Fellow Tasks</h2>
      </div>

      {/* Task 1: Location Verification */}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-walnut mb-4">Task 1: Location Verification</h3>
          
          {/* Location Selection */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Label className="w-1/3">District</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-1/3">Mandal</Label>
              <Select value={selectedMandal} onValueChange={setSelectedMandal} disabled={!selectedDistrict}>
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select Mandal" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {mandals.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-1/3">Gram Panchayat</Label>
              <Select value={selectedGramPanchayat} onValueChange={setSelectedGramPanchayat} disabled={!selectedMandal}>
                <SelectTrigger className="w-2/3">
                  <SelectValue placeholder="Select Gram Panchayat" />
                </SelectTrigger>
                <SelectContent className="select-content">
                  {gramPanchayats.map((gp) => (
                    <SelectItem key={gp.id} value={gp.id}>{gp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ✅ Upload Photo */}
          <Label className="mt-4">Upload LC Photo</Label>
          <Dropzone onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles, setLcPhoto)}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer mt-2"
              >
                <input {...getInputProps()} />
                {lcPhoto ? <p className="text-green-600">{lcPhoto.name}</p> : "Drop or Click to Upload"}
              </div>
            )}
          </Dropzone>

          {/* ✅ Submit Task 1 */}
          <Button className="w-full mt-4 bg-walnut text-white" onClick={handleSubmitTask1}>
            Submit Task 1
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Task 2 */}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-walnut mb-4">Task 2: Training Completion</h3>

          <a href="https://youtube.com" target="_blank" className="text-sm text-blue-600 underline">
            Watch Training Video
          </a>

          {/* ✅ Upload Task 2 Photo */}
          <Label className="mt-4">Upload Photo</Label>
          <Dropzone onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles, setTask2Photo)}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer mt-2">
                <input {...getInputProps()} />
                {task2Photo ? <p className="text-green-600">{task2Photo.name}</p> : "Drop or Click to Upload"}
              </div>
            )}
          </Dropzone>

          <Button className="w-full mt-4 bg-walnut text-white" onClick={handleSubmitTask2}>
            Submit Task 2
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Final Submit Button */}
      <Button onClick={handleSubmitTasks} className="w-full max-w-4xl bg-earth text-white">
        Submit All Tasks
      </Button>
    </div>
  );
};

export default Tasks;
