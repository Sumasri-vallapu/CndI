import { useState } from "react";
import { useNavigate } from "react-router-dom";

const taskOptions = [
  "Submit Baseline data",
  "Complete your LC profile",
  "Complete your children profile",
  "Attending weekly call",
  "Attending review meeting"
];

const districtsList = [
  "Adilabad", "Bhadradri", "Hyderabad", "Jagtial", "Kamareddy",
  "Karimnagar", "Khammam", "Mahabubnagar", "Medchal", "Warangal"
];

const AdminAssignTask = () => {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const handleDistrictChange = (district: string) => {
    if (district === "All") {
      setSelectedDistricts(
        selectedDistricts.includes("All") ? [] : ["All", ...districtsList]
      );
    } else {
      const updated = selectedDistricts.includes(district)
        ? selectedDistricts.filter(d => d !== district && d !== "All")
        : [...selectedDistricts.filter(d => d !== "All"), district];
      setSelectedDistricts(updated);
    }
  };

  const handleSubmit = () => {
    const payload = {
      task_name: taskName,
      deadline,
      districts: selectedDistricts.includes("All") ? "All" : selectedDistricts
    };
    console.log("Assigned Task:", payload);
    // Replace with POST API call
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center py-4">
        <button
          onClick={() => navigate("/main")}
          className="text-[#7A3D1A] hover:text-[#A25C38] flex items-center gap-2 text-sm font-medium"
        >
          ← Back
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-sm bg-[#7A3D1A] text-white px-4 py-2 rounded-md hover:bg-[#A25C38]"
        >
          Logout
        </button>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow space-y-6">
        {/* Logo & Title */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/Images/organization_logo.png"
            alt="Yuva Chetana Logo"
            className="h-22 w-auto object-contain mb-2"
            loading="eager"
          />
          <h2 className="text-xl font-bold text-[#7A3D1A]">Assign Task to Fellows</h2>
        </div>

        {/* Task Name Dropdown */}
        <div>
          <label className="block text-[#7A3D1A] font-medium mb-1">Task Name</label>
          <select
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            className="w-full p-2 border border-[#7A3D1A] rounded-md"
          >
            <option value="">Select a Task</option>
            {taskOptions.map(task => (
              <option key={task} value={task}>{task}</option>
            ))}
          </select>
        </div>

        {/* Deadline Date Picker */}
        <div>
          <label className="block text-[#7A3D1A] font-medium mb-1">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="w-full p-2 border border-[#7A3D1A] rounded-md"
          />
        </div>

        {/* District Checkboxes */}
        <div>
          <label className="block text-[#7A3D1A] font-medium mb-2">Assign to Districts</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label>
              <input
                type="checkbox"
                checked={selectedDistricts.includes("All")}
                onChange={() => handleDistrictChange("All")}
                className="mr-2"
              />
              All
            </label>
            {districtsList.map(d => (
              <label key={d}>
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(d)}
                  onChange={() => handleDistrictChange(d)}
                  className="mr-2"
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleSubmit}
            className="bg-[#7A3D1A] text-white px-6 py-2 rounded hover:bg-[#A25C38] transition"
          >
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignTask;
