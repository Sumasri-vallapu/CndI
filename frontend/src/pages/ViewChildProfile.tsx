import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/utils/api";

interface ChildProfile {
  id: number;
  full_name: string;
  gender: string;
  child_class: string;
  status: string;
}

const ViewChildren = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fellow_mobile_number = localStorage.getItem("mobile_number") || "";

  useEffect(() => {
    let ignore = false;

    const fetchChildren = async () => {
      try {
        const res = await fetch(ENDPOINTS.GET_CHILDREN_LIST(fellow_mobile_number || ""));
        const data = await res.json();
        if (!ignore && data.status === "success") {
          setChildren(data.data);
        }
      } catch {
        if (!ignore) setError("Something went wrong");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (fellow_mobile_number) fetchChildren();

    return () => {
      ignore = true;
    };
  }, [fellow_mobile_number]);


  if (loading) return <div className="p-4">Loading children...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
      {/* Top Container: width & spacing same as AddChildProfile */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <h2 className="text-2xl font-bold text-walnut text-center">Children Profiles</h2>

        {children.length === 0 ? (
          <p className="text-center text-gray-600">No children added yet.</p>
        ) : (
          <div className="space-y-4">
            {children.map((child) => (
              <div
                key={child.id}
                className="border border-gray-300 rounded-md p-4 shadow-sm space-y-2"
              >
                {/* Full Name at top */}
                <div className="text-lg font-bold text-walnut">{child.full_name}</div>

                {/* All details in one line each */}
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Gender:</span> {child.gender}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Class:</span> {child.child_class}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Status:</span> {child.status}
                </p>

                {/* Buttons one below the other */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/children/edit/${child.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-walnut text-white hover:bg-earth"
                    onClick={() => navigate(`/children/view/${child.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );


};

export default ViewChildren;
