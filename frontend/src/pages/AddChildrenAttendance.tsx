// Importing required packages
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";
import ToggleButton from "@/components/ui/ToggleButton";
import { Input } from "@/components/ui/input";
// Blueprint of the data
interface Child {
    id: string;
    full_name: string;
    child_class: string;
}


const AddChildrenAttendance = () => {
    const navigate = useNavigate();
    // State variables
    const [children, setChildren] = useState<Child[]>([]); // Stores the list of children fetched from the backend (added by the logged-in fellow)
    const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({}); // Stores the attendance status of each child
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]); // Stores the selected Attendance Date
    const [selectedWeek, setSelectedWeek] = useState("Week 1"); // Stores the selected Attendance Week
    const [searchQuery, setSearchQuery] = useState(""); // Search bar input
    const [filtered, setFiltered] = useState<Child[]>([]); // Filtered children list


    // Data Fetching from backend
    useEffect(() => {
        const fetchChildren = async () => {
            const mobile = localStorage.getItem("mobile_number");
            if (!mobile) return;

            try {
                const res = await fetch(ENDPOINTS.GET_CHILDREN_LIST(mobile));
                const data = await res.json();
                console.log("Fetched data:", data);

                if (data.status === "success") {
                    const sorted = [...data.data].sort((a, b) =>
                        a.full_name.localeCompare(b.full_name)
                    );
                    console.log("Sorted data:", sorted);

                    setChildren(sorted);                     // All children
                    setFiltered(sorted);                     // Filtered children for search
                    setAttendanceMap(                        // Attendance status: false by default
                        Object.fromEntries(sorted.map((c) => [c.id, false]))
                    );
                } else {
                    console.warn("Backend returned error:", data);
                }
            } catch (err) {
                console.error("❌ Error while fetching children:", err);
            }
        };

        fetchChildren();
    }, []);

    // Search filter logic
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const result = children.filter((child) =>
            child.full_name.toLowerCase().includes(q)
        );
        setFiltered(result);
    }, [searchQuery, children]);


    // Save attendance logic
    const handleSaveAttendance = async () => {
        const payload = {
            date: selectedDate,
            week: selectedWeek,
            attendance: filtered.map((child) => ({
                child_id: child.id,
                status: attendanceMap[child.id] ? "Present" : "Absent",
            })),
        };

        try {
            const res = await fetch(ENDPOINTS.POST_CHILDREN_ATTENDANCE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ Attendance saved successfully!");
            } else {
                alert(`❌ Failed to save attendance: ${data.message || data.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving attendance:", error);
            alert("❌ Something went wrong while saving attendance.");
        }
    };



    return (
        <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
            <div className="w-full max-w-3xl flex justify-between py-4 no-print print:hidden">
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

            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <img
                        src="/Images/organization_logo.png"
                        alt="Yuva Chetana Logo"
                        className="h-22 w-auto object-contain mb-2"
                        loading="eager"
                    />
                    <h2 className="text-xl font-bold text-walnut">Add Children Attendance</h2>
                </div>

                {/* Week + Date Filters */}
                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="px-4 pr-8 py-2 rounded-md bg-gray-100 text-sm border"
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


                {/* Search bar */}
                <div className="flex flex-col gap-1 mt-4">
                    <Input
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/80 focus:border-walnut/60"
                    />
                </div>



                {/* Header Row */}
                <div>
                    <p className="text-sm text-gray-600 px-1 py-0 mb-1">Total Students: {filtered.length}</p>
                    <div className="grid grid-cols-[1fr_1fr_auto] text-white font-semibold bg-walnut px-4 py-2 rounded-md shadow text-sm text-left ">
                        <div>Student name</div>
                        <div> Child Class</div>
                        <div className="text-center">Attendance</div>
                    </div>
                </div>
                {/* Children Rows */}
                {filtered.map((child) => {
                    const isPresent = attendanceMap[child.id];
                    return (
                        <div
                            key={child.id}
                            className={`grid grid-cols-[1fr_1fr_auto] items-center px-4 py-3 rounded-md transition-colors ${isPresent ? "bg-green-100 text-black" : "bg-gray-100 text-black"
                                } text-sm`}
                        >
                            <div className="font-medium">{child.full_name}</div>
                            <div className="text-left">{child.child_class}</div>
                            <div className="flex justify-center">
                                <ToggleButton
                                    checked={isPresent}
                                    onChange={() =>
                                        setAttendanceMap((prev) => ({
                                            ...prev,
                                            [child.id]: !prev[child.id],
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    );
                })}


                {/* Save Button */}
                <button
                    onClick={handleSaveAttendance}
                    className="bg-walnut text-white rounded-md py-2 mt-4 shadow-md w-full font-semibold"
                >
                    Save & Submit
                </button>
            </div>
        </div>
    );


};

export default AddChildrenAttendance;

