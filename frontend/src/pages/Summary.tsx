import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    <div className="flex flex-col min-h-screen bg-[#F4F1E3] p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
        <Button className="bg-walnut text-white" onClick={() => navigate("/")}>Logout</Button>
      </div>

      {/* Logo */}
      <div className="flex justify-center">
        <img src="/Images/organization_logo.png" alt="Logo" className="h-20 w-20" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600">Avg. Learning Level of LC</h3>
          <p className="text-lg font-bold text-walnut">Proficient</p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600">Avg Fellow Attendance at LC</h3>
          <p className="text-lg font-bold text-walnut">87%</p>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600">Avg Student Attendance of LC</h3>
          <p className="text-lg font-bold text-walnut">92%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow">
        <Input
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        <Select value={assessmentType} onValueChange={(v) => setAssessmentType(v as "baseline" | "endline")}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Assessment Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="baseline">Baseline</SelectItem>
            <SelectItem value="endline">Endline</SelectItem>
          </SelectContent>
        </Select>
        <Select value={readingLevelFilter} onValueChange={(v) => setReadingLevelFilter(v)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Reading Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {READING_LEVELS[assessmentType].map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={speakingLevelFilter} onValueChange={(v) => setSpeakingLevelFilter(v)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Speaking Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {SPEAKING_LEVELS[assessmentType].map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
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
  );
};

export default Summary;
