import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/utils/api";
import { ArrowLeft } from "lucide-react";

interface ChildProfile {
  id: number;
  full_name: string;
  gender: string;
  caste_category: string;
  date_of_birth: string;
  parent_mobile_number: string;
  state_name: string;
  district_name: string;
  mandal_name: string;
  grampanchayat_name: string;
  school_name: string;
  type_of_school: string;
  child_class: string;
  mother_name: string;
  mother_occupation: string;
  father_name: string;
  father_occupation: string;
  reading_level: string;
  speaking_level: string;
  status: string;
  child_photo_s3_url: string;
}

interface LabelValue {
  label: string;
  value: string;
}

const ViewChildProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Child ID not found in URL.");
      return;
    }

    const fetchChild = async () => {
      try {
        const res = await fetch(ENDPOINTS.GET_CHILD_PROFILE(id));
        const data = await res.json();
        if (data.status === "success") {
          setChild(data.data);
        } else {
          setError("Failed to fetch child profile.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong.");
      }
    };

    fetchChild();
  }, [id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!child) return <div className="p-4">Loading child profile...</div>;

  const personalDetails: LabelValue[] = [
    { label: "Full Name", value: child.full_name },
    { label: "Gender", value: child.gender },
    { label: "Caste", value: child.caste_category },
    { label: "Date of Birth", value: child.date_of_birth },
    { label: "Parent Mobile", value: child.parent_mobile_number },
    { label: "State", value: child.state_name },
    { label: "District", value: child.district_name },
    { label: "Mandal", value: child.mandal_name },
    { label: "Grampanchayat", value: child.grampanchayat_name },
  ];

  const educationDetails: LabelValue[] = [
    { label: "School Name", value: child.school_name },
    { label: "Type of School", value: child.type_of_school },
    { label: "Class", value: child.child_class },
  ];

  const parentDetails: LabelValue[] = [
    { label: "Mother Name", value: child.mother_name },
    { label: "Mother Occupation", value: child.mother_occupation },
    { label: "Father Name", value: child.father_name },
    { label: "Father Occupation", value: child.father_occupation },
  ];

  const learningDetails: LabelValue[] = [
    { label: "Speaking Level", value: child.speaking_level },
    { label: "Reading Level", value: child.reading_level },
    { label: "Status", value: child.status },
  ];

  const renderFlexList = (items: LabelValue[]) => (
    <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
      {items.map(({ label, value }) => (
        <div key={label} className="flex">
          <span className="w-36 font-medium text-gray-700"><strong>{label}</strong></span>
          <span className="text-gray-900">:&nbsp;&nbsp;&nbsp;{value || "—"}</span>
        </div>
      ))}
    </div>
  );


  const handleDelete = async (childId: number | undefined) => {
    if (!childId) {
      alert("Invalid child ID");
      return;
    }
  
    const confirmed = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmed) return;
  
    try {
      const res = await fetch(ENDPOINTS.DELETE_CHILD_PROFILE(childId.toString()), {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Failed to delete profile");
  
      alert("Profile deleted successfully.");
      navigate("/view-children");
    } catch (error) {
      console.error("❌ Delete error:", error);
      alert("Failed to delete child profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
      {/* 🔙 Top Navigation */}
      <div className="w-full max-w-3xl flex justify-between py-4 no-print print:hidden">
        <button
          onClick={() => navigate("/view-children")}
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

      {/* 🧒 Profile Card */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md space-y-6 mt-6">
        {/* 📸 Photo and Name */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src={
              child.child_photo_s3_url ||
              "https://via.placeholder.com/100?text=No+Photo"
            }
            alt={`Profile of ${child.full_name}`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="text-xl font-bold text-walnut">{child.full_name}</h2>
        </div>

        {/* Section: Personal Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-lg border border-gray-200 space-y-2">
          <h3 className="text-lg font-semibold text-walnut mb-2">Personal Details</h3>
          {renderFlexList(personalDetails)}
        </div>

        {/* Section: Educational Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-lg border border-gray-200 space-y-2">
          <h3 className="text-lg font-semibold text-walnut mb-2">Educational Details</h3>
          {renderFlexList(educationDetails)}
        </div>

        {/* Section: Parent / Guardian Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-lg border border-gray-200 space-y-2">
          <h3 className="text-lg font-semibold text-walnut mb-2">Parent / Guardian Details</h3>
          {renderFlexList(parentDetails)}
        </div>

        {/* Section: Learning Details */}
        <div className="bg-gray-50 p-4 rounded-md shadow-lg border border-gray-200 space-y-2">
          <h3 className="text-lg font-semibold text-walnut mb-2">Learning Details</h3>
          {renderFlexList(learningDetails)}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 no-print print:hidden mt-4">
          <button
            onClick={() => navigate(`/children/edit/${child.id}`)}
            className="bg-walnut text-white px-6 py-2 rounded-md hover:bg-walnut/90"
          >
            Edit Profile
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white text-walnut border border-walnut px-6 py-2 rounded-md hover:bg-walnut hover:text-white transition"
          >
            Download / Print
          </button>
        </div>
      </div>

      {/* 🗑️ Delete Button - Outside the white card */}
      <div className="mt-4 flex justify-center no-print print:hidden">
        <button
          onClick={() => handleDelete(child?.id)}
          className="flex items-center gap-2 text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50"
        >
          <span>Delete Profile</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


    </div>
  );
};

export default ViewChildProfile;
