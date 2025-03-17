import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ENDPOINTS } from "@/utils/api";
import Dropzone from "react-dropzone";
import { PlayCircle } from "lucide-react"; // Video Icons

// ✅ Define TypeScript Interfaces
interface LocationItem {
  id: string;
  name: string;
}

interface VideoStatus {
  video1: boolean;
  video2: boolean;
}

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;

  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [mandals, setMandals] = useState<LocationItem[]>([]);
  const [villages, setVillages] = useState<LocationItem[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedMandal, setSelectedMandal] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [lcPhoto, setLcPhoto] = useState<File | null>(null);
  const [task2Photo, setTask2Photo] = useState<File | null>(null);
  const [task1Status, setTask1Status] = useState<string>("Not Started");
  const [task2Status, setTask2Status] = useState<string>("Not Started");
  const [videosWatched, setVideosWatched] = useState<VideoStatus>({
    video1: false,
    video2: false,
  });

  const [state] = useState("36"); // Telangana State ID

  // ✅ Fetch Districts
  useEffect(() => {
    if (!state) return;
    fetch(ENDPOINTS.GET_DISTRICTS(state))
      .then((res) => res.json())
      .then(setDistricts)
      .catch((err) => console.error("Error fetching districts:", err));
  }, [state]);

  // ✅ Fetch Mandals
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(ENDPOINTS.GET_MANDALS(selectedDistrict))
      .then((res) => res.json())
      .then(setMandals)
      .catch((err) => console.error("Error fetching mandals:", err));
  }, [selectedDistrict]);

  // ✅ Fetch Villages
  useEffect(() => {
    if (!selectedMandal) return;
    fetch(ENDPOINTS.GET_VILLAGES(selectedMandal))
      .then((res) => res.json())
      .then(setVillages)
      .catch((err) => console.error("Error fetching villages:", err));
  }, [selectedMandal]);

  // ✅ Fetch Task Status
  useEffect(() => {
    if (!mobileNumber) return;
    fetch(ENDPOINTS.GET_TASK_STATUS(mobileNumber))
      .then((res) => res.json())
      .then((data) => {
        setTask1Status(data.task1_status || "Not Started");
        setTask2Status(data.task2_status || "Not Started");
      })
      .catch((err) => console.error("Error fetching task status:", err));
  }, [mobileNumber]);

  // ✅ Mark video as watched
  const handleVideoWatched = (videoId: "video1" | "video2") => {
    fetch(ENDPOINTS.UPDATE_VIDEO_STATUS(videoId, mobileNumber!), { method: "POST" })
      .then(() => setVideosWatched((prev) => ({ ...prev, [videoId]: true })))
      .catch((err) => console.error("Error updating video status:", err));
  };

  // ✅ Submit Task 1 (Location + Photo)
  const handleSubmitTask1 = async () => {
    if (!selectedDistrict || !selectedMandal || !selectedVillage || !lcPhoto || !mobileNumber) {
      alert("All fields and photo are required for Task 1!");
      return;
    }

    const formData = new FormData();
    formData.append("mobile_number", mobileNumber);
    formData.append("district_id", selectedDistrict);
    formData.append("mandal_id", selectedMandal);
    formData.append("village_id", selectedVillage);
    formData.append("lc_photo", lcPhoto);

    fetch(ENDPOINTS.SUBMIT_TASK1, { method: "POST", body: formData })
      .then(() => setTask1Status("Submitted for Review"))
      .catch((err) => console.error("Error submitting Task 1:", err));
  };

  // ✅ Submit Task 2 (Upload Photo)
  const handleSubmitTask2 = async () => {
    if (!task2Photo || !mobileNumber) {
      alert("Photo upload is required for Task 2!");
      return;
    }

    const formData = new FormData();
    formData.append("mobile_number", mobileNumber);
    formData.append("task2_photo", task2Photo);

    fetch(ENDPOINTS.SUBMIT_TASK2, { method: "POST", body: formData })
      .then(() => setTask2Status("Submitted for Review"))
      .catch((err) => console.error("Error submitting Task 2:", err));
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-6 space-y-6">
      {/* ✅ Header */}
      <div className="relative w-full flex flex-col items-center">
        <button onClick={() => navigate("/login")} className="absolute right-4 top-2 md:top-4 bg-walnut text-white px-3 py-1 rounded-md">
          Logout
        </button>
        <img src="/Images/organization_logo.png" alt="Logo" className="h-14 w-auto mt-20" />
      </div>

      <h2 className="text-2xl font-bold text-walnut">Fellow Tasks</h2>
                
    {/* Welcome message */}
    <div className="w-full max-w-4xl text-center mb-3">
      <p className="text-earth font-medium">Dear Youth Volunteer,</p>
      <p className="text-gray-700">Welcome to the next stage of your Application!</p>
      <p className="text-gray-700">Watch these videos to know more!</p>
    </div>


      {/* ✅ Task Video Section */}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-walnut mb-4">Videos</h3>
          {(["video1", "video2"] as const).map((vid) => (
            <div key={vid} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow mb-2">
              <a href="https://youtube.com" target="_blank" className="flex items-center gap-2 text-blue-600 underline" onClick={() => handleVideoWatched(vid)}>
                <PlayCircle className="w-6 h-6 text-blue-600" /> Watch Video {vid === "video1" ? "1" : "2"}
              </a>
              <div className={`px-4 py-2 rounded-full text-white text-sm ${videosWatched[vid] ? "bg-green-500" : "bg-gray-500"}`}>
                {videosWatched[vid] ? "✅ Seen" : "⌛ Unseen"}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>


      {/* ✅ Task 1 */}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-walnut mb-4">Task 1: Location Verification</h3>

          {/* Location Selection */}
          <div className="space-y-4">
            {[{ label: "District", value: selectedDistrict, setter: setSelectedDistrict, options: districts },
              { label: "Mandal", value: selectedMandal, setter: setSelectedMandal, options: mandals },
              { label: "Village", value: selectedVillage, setter: setSelectedVillage, options: villages }]
              .map(({ label, value, setter, options }) => (
                <div key={label} className="flex items-center gap-4">
                  <Label className="w-1/3">{label}</Label>
                  <Select value={value} onValueChange={setter}>
                    <SelectTrigger className="w-2/3">
                      <SelectValue placeholder={`Select ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>

          {/* ✅ Status Indicator */}
          <div className={`mb-4 text-white px-3 py-2 rounded-lg text-sm ${task1Status === "Submitted for Review" ? "bg-yellow-500" : task1Status === "Approved" ? "bg-green-500" : task1Status === "Rejected" ? "bg-red-500" : "bg-gray-500"}`}>
            Status: {task1Status}
          </div>
          {/* ✅ Upload Photo */}
          <Label className="mt-4">Upload LC Photo</Label>
          <Dropzone onDrop={(acceptedFiles) => setLcPhoto(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer mt-2">
                <input {...getInputProps()} />
                {lcPhoto ? <p className="text-green-600">{lcPhoto.name}</p> : "Drop or Click to Upload"}
              </div>
            )}
          </Dropzone>

          <Button className="w-full mt-4 bg-walnut text-white" onClick={handleSubmitTask1}>
            Submit Task 1
          </Button>
        </CardContent>
      </Card>


      {/* ✅ Task 2 */}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-walnut mb-4">Task 2: Training Completion</h3>
          <Label className="mt-4">Upload Training Completion Photo</Label>
          <Dropzone onDrop={(acceptedFiles) => setTask2Photo(acceptedFiles[0])}>
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
    </div>
  );
};

export default Tasks;
