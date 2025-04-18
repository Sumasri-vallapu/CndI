import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/utils/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChildProfile {
  id: number;
  full_name: string;
  speaking_level: string;
  reading_level: string;
  status: string;
  child_class: string;
  child_photo_s3_url: string | null;
}

const ViewChildren = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [filtered, setFiltered] = useState<ChildProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();
  const toProperCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  useEffect(() => {
    const fetchData = async () => {
      const mobile = localStorage.getItem("mobile_number");
      if (!mobile) return;

      try {
        const res = await fetch(ENDPOINTS.GET_CHILDREN_LIST(mobile));
        const data = await res.json();
        if (data.status === "success") {
          const sorted = [...data.data].sort((a, b) => {
            if (a.child_class === b.child_class) {
              return a.full_name.localeCompare(b.full_name);
            }
            return a.child_class.localeCompare(b.child_class);
          });

          setChildren(sorted);
          setFiltered(sorted);
        }
      } catch (err) {
        console.error("Error fetching children:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const result = children.filter((child) =>
      child.full_name.toLowerCase().includes(q)
    );
    setFiltered(result);
    setPage(1);
  }, [searchQuery, children]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">

      {/* 🔙 Top Navigation */}
      <div className="w-full max-w-3xl flex justify-between py-4 no-print print:hidden">
        <button
          onClick={() => navigate("/children-profile")}
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

          <h2 className="text-xl font-bold text-walnut">Children Profiles</h2>
        </div>

        <Input
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-walnut/80 focus:border-walnut/60"
        />

        <p className="text-sm text-gray-600">Showing {filtered.length} students</p>

        <div className="space-y-4">

          {paginatedData.map((child) => (
            <div
              key={child.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              {/* Left side: Profile info */}
              <div className="flex items-center gap-4">
                <img
                  src={child.child_photo_s3_url || "https://via.placeholder.com/100?text=No+Photo"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <div className="text-base font-semibold text-gray-900">{child.full_name}</div>
                  <div className="text-sm text-gray-600">
                    Class: {child.child_class || "—"} | Speaking: {child.speaking_level || "—"} | Reading: {child.reading_level || "—"} | Status: {child.status || "—"}
                  </div>
                </div>
              </div>

              {/* Right side: View Button */}
              <div className="sm:self-end">
                <Button
                  className="bg-walnut text-white w-full sm:w-auto mt-2 sm:mt-0"
                  onClick={() => window.location.href = `/children/view/${child.id}`}
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}


        </div>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${page === i + 1
                ? "bg-walnut text-white"
                : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewChildren;
