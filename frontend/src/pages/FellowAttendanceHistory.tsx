import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format, parseISO, startOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/utils/api";

interface AttendanceRecord {
  date: string;
  status: string;
}

const FellowAttendanceHistory = () => {
  const navigate = useNavigate();
  const mobile = localStorage.getItem("mobile_number") || "";

  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [startDate, setStartDate] = useState<Date>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date>(today);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setShowResults(false);
    try {
      const res = await fetch(
        ENDPOINTS.GET_FELLOW_ATTENDANCE_HISTORY(mobile, startDate, endDate)
      );
      const result = await res.json();
      if (result.status === "success") {
        setRecords(result.data);
        setShowResults(true);
      }
    } catch (err) {
      //console.error("❌ Failed to fetch attendance history:", err);
    } finally {
      setLoading(false);
    }
  };

  const total = records.length;
  const present = records.filter((r) => r.status === "Present").length;
  const absent = total - present;
  const percentage = total ? ((present / total) * 100).toFixed(1) : "0.0";
  const totalWorkingDays = present + absent;

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between max-w-3xl py-4">
        <Button
          variant="ghost"
          className="text-walnut hover:text-earth flex items-center gap-2"
          onClick={() => navigate("/my-attendance")}
        >
          <ArrowLeft size={20} /> <span className="text-base font-medium">Back</span>
        </Button>
        <Button
          className="bg-walnut text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => navigate("/")}
        >
          Logout
        </Button>
      </div>

      {/* Card */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-4">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/Images/organization_logo.png"
            alt="Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-bold text-[#7A3D1A] -mt-4">
          Attendance History
        </h2>

        {/* Date Range Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="text-sm mb-1 block">Start Date</label>
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full border rounded px-3 py-2 text-sm shadow-sm bg-gray-100"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm mb-1 block">End Date</label>
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="w-full border rounded px-3 py-2 text-sm shadow-sm bg-gray-100"
            />
          </div>
        </div>

        {/* Full-width Button */}
        <Button
          onClick={fetchHistory}
          className="bg-walnut hover:bg-walnut/90 text-white w-full py-2 rounded-lg mt-2"
        >
          View Attendance
        </Button>

        {/* Summary + Table */}
        {showResults && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
              <div className="bg-green-100 p-4 rounded shadow text-center">
                <div className="text-gray-700">Present</div>
                <div className="font-bold text-lg text-green-800">{present}</div>
              </div>
              <div className="bg-red-100 p-4 rounded shadow text-center">
                <div className="text-gray-700">Absent</div>
                <div className="font-bold text-lg text-red-800">{absent}</div>
              </div>
              <div className="bg-blue-100 p-4 rounded shadow text-center">
                <div className="text-gray-700">Attendance %</div>
                <div className="font-bold text-lg text-blue-800">{percentage}%</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded shadow text-center">
                <div className="text-gray-700">Working Days</div>
                <div className="font-bold text-lg text-yellow-700">{totalWorkingDays}</div>
                
              </div>
            </div>

            {/* History Table */}
            {loading ? (
              <div className="text-center text-gray-500 mt-4">Loading...</div>
            ) : (
              <div className="mt-6 space-y-2 text-sm">
                {records.map((record) => (
                  <div
                    key={record.date}
                    className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded p-3 shadow-sm"
                  >
                    <div className="font-medium text-gray-900">
                      {format(parseISO(record.date), "dd MMM yyyy (EEE)")}
                    </div>
                    <div className="font-medium">
                      {record.status === "Present" ? (
                        <span className="text-green-600">Present</span>
                      ) : (
                        <span className="text-red-600">Absent</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FellowAttendanceHistory;
