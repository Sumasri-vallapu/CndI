import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ENDPOINTS } from "@/utils/api";

const FellowAttendance = () => {
  const navigate = useNavigate();
  const [isPresent, setIsPresent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const [fellowName, setFellowName] = useState("Loading...");

  useEffect(() => {
    const mobile = localStorage.getItem("mobile_number");
    if (!mobile) return;

    const fetchName = async () => {
      try {
        const res = await fetch(ENDPOINTS.GET_FELLOW_PROFILE(mobile));
        const result = await res.json();

        if (result.status === "success") {

          setFellowName(result.data.personal_details.full_name || "Unnamed");
        } else {
          setFellowName("Unknown Fellow");
        }
      } catch (err) {
        //console.error("❌ Failed to load fellow name:", err);
        setFellowName("Error loading name");
      }
    };

    fetchName();
  }, []);

  const handleToggle = () => {
    setIsPresent((prev) => !prev);
  };

  const handleSubmit = async () => {
    const mobile = localStorage.getItem("mobile_number");
    if (!mobile) {
      alert("Mobile number not found.");
      return;
    }

    const payload = {
      mobile_number: mobile,
      week: selectedWeek,
      date: format(selectedDate, "yyyy-MM-dd"),
      status: isPresent ? "Present" : "Absent",
    };

    try {
      const res = await fetch(ENDPOINTS.SAVE_FELLOW_ATTENDANCE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("✅ Attendance saved successfully");
        setIsPresent(false); // ✅ Reset toggle to "Absent"
      } else {
        alert(`❌ Failed to save: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("❌ Network error while saving attendance");
    }
  };


  const weekOptions = Array.from({ length: 24 }, (_, i) => `Week ${i + 1}`);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <Button variant="ghost" className="text-walnut hover:text-earth flex items-center gap-2" onClick={() => navigate("/my-attendance")}> <ArrowLeft size={20} /> <span className="text-base font-medium">Back</span> </Button>
        <Button className="bg-walnut text-white px-4 py-2 rounded-lg text-sm" onClick={() => navigate("/")}>Logout</Button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-auto object-contain" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-lg font-semibold text-gray-900">Mark My Attendance</h2>

        {/* Week & Date Row */}
        <div className="flex justify-between gap-4 items-center">
          <div className="relative w-1/2">
            <button
              onClick={() => setShowWeekDropdown((prev) => !prev)}
              className="w-full px-4 py-2 bg-gray-100 rounded-full shadow-sm text-sm flex justify-between items-center border border-gray-300"
            >
              {selectedWeek} <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {showWeekDropdown && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md">
                {weekOptions.map((week) => (
                  <div
                    key={week}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedWeek(week);
                      setShowWeekDropdown(false);
                    }}
                  >
                    {week}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-1/2">
            <div className="relative">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                max={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-walnut text-sm"
              />
              <CalendarDays className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-2 text-sm font-semibold text-white bg-walnut px-4 py-2 rounded-md shadow">
          <div>Fellow name</div>
          <div className="text-right">Attendance</div>
        </div>

        {/* Fellow Row */}
        <div className="grid grid-cols-2 items-center bg-gray-100 px-4 py-3 rounded-md shadow-inner">
          <div className="text-sm font-medium text-gray-800">{fellowName}</div>
          <div className="flex justify-end">
            <div
              className={`w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${isPresent ? "bg-green-500" : "bg-gray-400"
                }`}
              onClick={handleToggle}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPresent ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-walnut hover:bg-walnut/90 text-white font-medium rounded-md py-2 shadow-md"
        >
          Save & Submit
        </Button>
      </div>
    </div>
  );
};

export default FellowAttendance;
