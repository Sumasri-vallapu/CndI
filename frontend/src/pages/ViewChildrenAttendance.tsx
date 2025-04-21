// Required Imports

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";


// Blueprint of the data
interface Child {
    id: string;
    full_name: string;
    child_class: string;
}

interface AttendanceRecord {
    child: string;
    date: string;
    status: "Present" | "Absent";
    week: string;
}

const ViewChildrenAttendance = () => {
    const navigate = useNavigate();

    const [children, setChildren] = useState<Child[]>([]); // Stores the list of children fetched from the backend (added by the logged-in fellow)
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]); // Stores the attendance records fetched from the backend
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]); // Stores the selected Attendance Date
    const [selectedWeek, setSelectedWeek] = useState("Week 1");     // Stores the selected Attendance Week

    const [presentCount, setPresentCount] = useState(0); // Stores the count of present children
    const [absentCount, setAbsentCount] = useState(0); // Stores the count of absent children
    const [loading, setLoading] = useState(false); // Stores the loading state
    const [attendancePercentage, setAttendancePercentage] = useState(0); // Stores the attendance percentage

    // Fetching the children list added by loggedin fellow

    useEffect(() => {
        const fetchChildren = async () => {
            const mobile = localStorage.getItem("mobile_number");
            if (!mobile) return;

            const res = await fetch(ENDPOINTS.GET_CHILDREN_LIST(mobile));
            const data = await res.json();

            if (data.status === "success") {
                const sorted = [...data.data].sort((a, b) => a.full_name.localeCompare(b.full_name));
                setChildren(sorted);
            }
        };

        fetchChildren();
    }, []);


    // Fetching the attendance records for the selected date and week
    const handleViewAttendance = async () => {
        const mobile = localStorage.getItem("mobile_number");
        if (!mobile || !selectedDate) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${ENDPOINTS.GET_ATTENDANCE_VIEW}?mobile=${mobile}&date=${selectedDate}&week=${selectedWeek}`
            );
            const data = await res.json();

            if (data.status === "success") {
                setAttendance(data.data);

                const total = data.data.length;
                const present = data.data.filter((r: AttendanceRecord) => r.status === "Present").length;
                const absent = total - present;
                const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;

                setPresentCount(present);
                setAbsentCount(absent);
                setAttendancePercentage(attendancePercentage); // 👈 useState hook required for this
            }
        } catch (err) {
            console.error("Error fetching attendance:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
            {/* Top bar */}
            <div className="w-full max-w-3xl flex justify-between py-4">
                <button
                    onClick={() => navigate("/children-attendance")}
                    className="text-walnut hover:text-earth flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    <span className="text-base font-medium">Back</span>
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="text-sm bg-walnut text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>

            {/* Main White Box */}
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow space-y-4">
                {/* Logo + Heading */}
                <div className="flex flex-col items-center justify-center space-y-2">
                    <img
                        src="/Images/organization_logo.png"
                        alt="Yuva Chetana Logo"
                        className="h-22 w-auto object-contain mb-2"
                        loading="eager"
                    />
                    <h2 className="text-xl font-bold text-walnut">View Children Attendance</h2>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="px-4 py-2 rounded-md bg-gray-100 text-sm border"
                    >
                        {[...Array(24)].map((_, i) => (
                            <option key={i} value={`Week ${i + 1}`}>{`Week ${i + 1}`}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-md bg-gray-100 text-sm border"
                    />
                </div>

                <button
                    onClick={handleViewAttendance}
                    className="bg-walnut text-white px-4 py-2 rounded-md w-full mt-2"
                >
                    View Attendance
                </button>

                {/* Summary Box */}
                {attendance.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
                            <p className="text-xs text-black mb-1">Total Students</p>
                            <p className="text-3xl font-bold text-black">{attendance.length}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
                            <p className="text-xs text-black mb-1">Present</p>
                            <p className="text-3xl font-bold text-green-600">{presentCount}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
                            <p className="text-xs text-black mb-1">Absent</p>
                            <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                        </div>

                        <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
                            <p className="text-xs text-black mb-1">Attendance %</p>
                            <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
                        </div>
                    </div>
                )}



                {/* Table Header */}
                {attendance.length > 0 && (
                    <div className="grid grid-cols-[1.5fr_1fr_auto] bg-[#7A3D1A] text-white px-4 py-2 rounded-md text-sm font-semibold">
                        <div>Student Name</div>
                        <div>Class</div>
                        <div>Status</div>
                    </div>
                )}

                {/* Attendance Rows */}
                {attendance.map((record) => {
                    const student = children.find((c) => c.id === record.child);
                    if (!student) return null;

                    return (
                        <div
                            key={record.child}
                            className={`grid grid-cols-[1.5fr_1fr_auto] items-center px-4 py-3 rounded-md transition-colors ${record.status === "Present" ? "bg-green-100" : "bg-red-100"
                                } text-sm`}
                        >
                            <div>{student.full_name}</div>
                            <div>{student.child_class}</div>
                            <div className="font-semibold text-center">{record.status}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

};

export default ViewChildrenAttendance;



