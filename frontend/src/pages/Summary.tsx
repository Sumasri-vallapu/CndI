import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "@/utils/api";
//import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

interface ChildProfile {
  id: number;
  full_name: string;
  child_class: string;
}

interface Assessment {
  student_id: number;
  reading_level: string;
  speaking_level: string;
  assessment_type: "baseline" | "endline";
}

const READING_LEVELS: { [key in "baseline" | "endline"]: string[] } = {
  baseline: ["Basic", "Intermediate", "Proficient"],
  endline: ["Basic", "Intermediate", "Proficient"],
};

const SPEAKING_LEVELS: { [key in "baseline" | "endline"]: string[] } = {
  baseline: ["Emergent", "Letter", "Word", "Para", "Story"],
  endline: ["Emergent", "Letter", "Word", "Para", "Story"],
};

const CLASS_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Out of School"];

const Summary = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<ChildProfile[]>([]);
  const [baselineAssessments, setBaselineAssessments] = useState<Assessment[]>([]);
  const [endlineAssessments, setEndlineAssessments] = useState<Assessment[]>([]);
  //const [searchTerm, setSearchTerm] = useState("");
  const [assessmentType, setAssessmentType] = useState<"baseline" | "endline">("baseline");
  const [readingLevelFilter, setReadingLevelFilter] = useState<string | "All">("All");
  const [speakingLevelFilter, setSpeakingLevelFilter] = useState<string | "All">("All");
  const [classFilter, setClassFilter] = useState<string | "All">("All");
  const [isLoading, setIsLoading] = useState(true);


  const mobile = localStorage.getItem("mobile_number");

  useEffect(() => {
    if (!mobile) return;

    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading

        const childrenRes = await fetch(ENDPOINTS.GET_CHILDREN_LIST(mobile));
        const childrenResult = await childrenRes.json();
        setStudents(childrenResult.data || []);

        const baselineRes = await fetch(`${ENDPOINTS.GET_ASSESSMENTS}?fellow_mobile_number=${mobile}&assessment_type=baseline`);
        const baselineData = await baselineRes.json();
        setBaselineAssessments(baselineData.data || []);

        const endlineRes = await fetch(`${ENDPOINTS.GET_ASSESSMENTS}?fellow_mobile_number=${mobile}&assessment_type=endline`);
        const endlineData = await endlineRes.json();
        setEndlineAssessments(endlineData.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData();
  }, [mobile]);


  const combinedData = students.map((student) => {
    const baseline = baselineAssessments.find((a) => a.student_id === student.id);
    const endline = endlineAssessments.find((a) => a.student_id === student.id);

    return {
      ...student,
      baselineSpeaking: baseline?.speaking_level || "",
      baselineReading: baseline?.reading_level || "",
      endlineSpeaking: endline?.speaking_level || "",
      endlineReading: endline?.reading_level || "",
    };
  });

  const filteredData = combinedData.filter((student) => {
    const readingKey = `${assessmentType}Reading` as keyof typeof student;
    const speakingKey = `${assessmentType}Speaking` as keyof typeof student;

    //const nameMatch = (student.full_name ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const readingLevelMatch = readingLevelFilter === "All" || (student[readingKey] ?? "") === readingLevelFilter;
    const speakingLevelMatch = speakingLevelFilter === "All" || (student[speakingKey] ?? "") === speakingLevelFilter;
    const classMatch = classFilter === "All" || (student.child_class ?? "") === classFilter;

    return readingLevelMatch && speakingLevelMatch && classMatch;
  });

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
      {/* Top bar */}
      <div className="w-full max-w-3xl flex justify-between py-4">
        <button
          onClick={() => navigate(-1)}
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
          <h2 className="text-xl font-bold text-walnut">Performance Summary</h2>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
            <p className="text-xs text-black mb-1">Avg. Learning Level of LC</p>
            <p className="text-lg font-bold text-black">85%</p>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
            <p className="text-xs text-black mb-1">Avg Fellow Attendance at LC</p>
            <p className="text-lg font-bold text-black">87%</p>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center border border-gray-300">
            <p className="text-xs text-black mb-1">Avg Student Attendance of LC</p>
            <p className="text-lg font-bold text-black">92%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Assessment Type */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Assessment Type</label>
            <Select value={assessmentType} onValueChange={(v) => setAssessmentType(v as "baseline" | "endline")}>
              <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-md text-sm">
                <SelectValue placeholder="Assessment Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
                <SelectItem value="baseline">Baseline</SelectItem>
                <SelectItem value="endline">Endline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Class Filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Class</label>
            <Select value={classFilter} onValueChange={(v) => setClassFilter(v)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 shadow-md rounded-md text-sm">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
                <SelectItem value="All">All</SelectItem>
                {CLASS_OPTIONS.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reading Level */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Reading Level</label>
            <Select value={readingLevelFilter} onValueChange={(v) => setReadingLevelFilter(v)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 shadow-md rounded-md text-sm">
                <SelectValue placeholder="Reading Level" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
                <SelectItem value="All">All</SelectItem>
                {READING_LEVELS[assessmentType].map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speaking Level */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Speaking Level</label>
            <Select value={speakingLevelFilter} onValueChange={(v) => setSpeakingLevelFilter(v)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 shadow-md rounded-md text-sm">
                <SelectValue placeholder="Speaking Level" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
                <SelectItem value="All">All</SelectItem>
                {SPEAKING_LEVELS[assessmentType].map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>


        {/* Table */}
        {isLoading ? (
          <div className="w-full py-10 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-walnut border-gray-200"></div>
          </div>
        ) : (
          <>
            {/* Number of Records */}
            <div className="text-sm text-gray-700 font-medium mb-2">
              Showing {filteredData.filter((s) => s.full_name && s.child_class).length} children
            </div>
            <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-walnut text-white">
                  <tr>
                    <th className="p-2 border">S.No</th>
                    <th className="p-2 border">Child Name</th>
                    <th className="p-2 border">Class</th>
                    <th className="p-2 border">Baseline Speaking</th>
                    <th className="p-2 border">Baseline Reading</th>
                    <th className="p-2 border">Endline Speaking</th>
                    <th className="p-2 border">Endline Reading</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.filter((s) => s.full_name && s.child_class).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-4 text-gray-500">
                        No child found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData
                      .filter((s) => s.full_name && s.child_class)
                      .map((student, index) => (
                        <tr key={student.id}>
                          <td className="p-2 border">{index + 1}</td>
                          <td className="p-2 border">{student.full_name}</td>
                          <td className="p-2 border">{student.child_class}</td>
                          <td className="p-2 border">{student.baselineSpeaking}</td>
                          <td className="p-2 border">{student.baselineReading}</td>
                          <td className="p-2 border">{student.endlineSpeaking}</td>
                          <td className="p-2 border">{student.endlineReading}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Summary;
