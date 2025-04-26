import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const Summary = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<ChildProfile[]>([]);
  const [baselineAssessments, setBaselineAssessments] = useState<Assessment[]>([]);
  const [endlineAssessments, setEndlineAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assessmentType, setAssessmentType] = useState<"baseline" | "endline">("baseline");
  const [readingLevelFilter, setReadingLevelFilter] = useState<string | "All">("All");
  const [speakingLevelFilter, setSpeakingLevelFilter] = useState<string | "All">("All");

  const mobile = localStorage.getItem("mobile_number");

  useEffect(() => {
    if (!mobile) return;

    const fetchData = async () => {
      try {
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
    const nameMatch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const readingLevelMatch = readingLevelFilter === "All" || student[`${assessmentType}Reading`] === readingLevelFilter;
    const speakingLevelMatch = speakingLevelFilter === "All" || student[`${assessmentType}Speaking`] === speakingLevelFilter;
    return nameMatch && readingLevelMatch && speakingLevelMatch;
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
            <p className="text-lg font-bold text-black">Proficient</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-md bg-gray-100 text-sm border"
          />
          <Select value={assessmentType} onValueChange={(v) => setAssessmentType(v as "baseline" | "endline")}>
            <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-md text-sm"><SelectValue placeholder="Assessment Type" /></SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
              <SelectItem value="baseline">Baseline</SelectItem>
              <SelectItem value="endline">Endline</SelectItem>
            </SelectContent>
          </Select>
          <Select value={readingLevelFilter} onValueChange={(v) => setReadingLevelFilter(v)}>
            <SelectTrigger className="bg-white border border-gray-300 shadow-md rounded-md"><SelectValue placeholder="Reading Level" /></SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
              <SelectItem value="All">All</SelectItem>
              {READING_LEVELS[assessmentType].map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={speakingLevelFilter} onValueChange={(v) => setSpeakingLevelFilter(v)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Speaking Level" /></SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-md rounded-md">
              <SelectItem value="All">All</SelectItem>
              {SPEAKING_LEVELS[assessmentType].map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-walnut text-white">
              <tr>
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Baseline Speaking</th>
                <th className="p-2 border">Baseline Reading</th>
                <th className="p-2 border">Endline Speaking</th>
                <th className="p-2 border">Endline Reading</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((student, index) => (
                <tr key={student.id}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{student.full_name}</td>
                  <td className="p-2 border">{student.child_class}</td>
                  <td className="p-2 border">{student.baselineSpeaking}</td>
                  <td className="p-2 border">{student.baselineReading}</td>
                  <td className="p-2 border">{student.endlineSpeaking}</td>
                  <td className="p-2 border">{student.endlineReading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Summary;
