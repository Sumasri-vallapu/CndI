import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";

interface Child {
  id: string;
  full_name: string;
  reading_level: string;
  speaking_level: string;
}

const readingOptions = ["Basic", "Intermediate", "Proficient"];
const speakingOptions = ["Emergent", "Letter", "Word", "Para", "Story"];

const Endline = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mobileNumber = localStorage.getItem("mobile_number");

  useEffect(() => {
    const fetchChildrenAndScores = async () => {
      if (!mobileNumber) return;

      try {
        setIsLoading(true);
        const resChildren = await fetch(ENDPOINTS.GET_CHILDREN_LIST(mobileNumber));
        const dataChildren = await resChildren.json();

        if (dataChildren.status === "success") {
          const sorted = [...dataChildren.data].sort((a, b) =>
            a.full_name.localeCompare(b.full_name)
          );
          const formattedChildren = sorted.map((child: any) => ({
            id: child.id,
            full_name: child.full_name,
            reading_level: "",
            speaking_level: "",
          }));
          setChildren(formattedChildren);

          const resScores = await fetch(
            `${ENDPOINTS.GET_ASSESSMENTS}?fellow_mobile_number=${mobileNumber}&assessment_type=endline`
          );
          const dataScores = await resScores.json();

          if (dataScores.status === "success") {
            const updatedChildren = formattedChildren.map((child) => {
              const existing = dataScores.data.find((a: any) => a.student_id === child.id);
              return existing
                ? { ...child, reading_level: existing.reading_level, speaking_level: existing.speaking_level }
                : child;
            });
            setChildren(updatedChildren);
          }
        }
      } catch (error) {
        console.error("Error fetching children or scores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildrenAndScores();
  }, [mobileNumber]);

  const handleReadingChange = (index: number, value: string) => {
    const updated = [...children];
    updated[index].reading_level = value;
    setChildren(updated);
  };

  const handleSpeakingChange = (index: number, value: string) => {
    const updated = [...children];
    updated[index].speaking_level = value;
    setChildren(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        fellow_mobile_number: mobileNumber,
        assessment_type: "endline",
        scores: children.map(({ id, reading_level, speaking_level }) => ({
          student_id: id,
          reading_level,
          speaking_level,
        })),
      };

      const response = await fetch(ENDPOINTS.SUBMIT_BASELINE_SCORES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Endline scores submitted successfully!");
        setTimeout(() => navigate("/main"), 2000);
      } else {
        alert("Failed to submit scores.");
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
      {/* Top bar */}
      <div className="w-full max-w-3xl flex justify-between items-center py-4">
        <button
          onClick={() => navigate("/children-assessment")}
          className="text-walnut hover:text-earth flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-sm bg-walnut text-white px-4 py-2 rounded-md hover:bg-earth"
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
          <h2 className="text-xl font-bold text-walnut">Update Endline Assessment Score</h2>
        </div>

        {/* Table Header */}
        {children.length > 0 && (
          <div className="hidden sm:grid grid-cols-[1fr_2fr_3fr_3fr] bg-[#7A3D1A] text-white px-4 py-2 rounded-md text-sm font-semibold mb-3">
            <div>Sl No</div>
            <div>Name</div>
            <div>Reading Level</div>
            <div>Speaking Level</div>
          </div>
        )}

        {/* Student Rows */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading students...</div>
        ) : children.length === 0 ? (
          <div className="text-center text-gray-500">No students found.</div>
        ) : (
          children.map((child, index) => (
            <div
              key={child.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_3fr_3fr] gap-2 sm:gap-4 items-center p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm mb-3"
            >
              <div className="sm:col-span-1 font-medium">{index + 1}</div>
              <div className="sm:col-span-1">{child.full_name}</div>

              <select
                value={child.reading_level}
                onChange={(e) => handleReadingChange(index, e.target.value)}
                className="p-1 border border-gray-300 rounded"
              >
                <option value="">Select</option>
                {readingOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={child.speaking_level}
                onChange={(e) => handleSpeakingChange(index, e.target.value)}
                className="p-1 border border-gray-300 rounded"
              >
                <option value="">Select</option>
                {speakingOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>

      {/* Submit Button */}
      {children.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-walnut text-white px-6 py-2 rounded-lg text-sm hover:bg-earth"
        >
          Submit Endline Scores
        </button>
      )}
    </div>
  );
};

export default Endline;
