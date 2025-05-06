import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ENDPOINTS } from "@/utils/api";

interface Task {
  id: number;
  task_name: string;
  status: "Pending" | "Completed";
}

const FellowTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignedDate = "23-04-2024";
  const deadlineDate = "16-12-2025";
  // const fellowId = localStorage.getItem("fellow_id"); // assuming stored in localStorage

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(ENDPOINTS.GET_FELLOW_TASKS);
        const data = await res.json();
        if (data.status === "success") {
          const initializedTasks = data.data.map((task: any) => ({
            ...task,
            status: "Pending", // Default status
          }));
          setTasks(initializedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = (index: number, value: "Pending" | "Completed") => {
    const updated = [...tasks];
    updated[index].status = value;
    setTasks(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = tasks.map((task) => ({
        task_id: task.id,
        task_name: task.task_name,
        status: task.status,
      }));
      
      const res = await fetch(ENDPOINTS.SUBMIT_TASK_STATUS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: payload }),
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("Tasks updated successfully!");
      } else {
        alert("Failed to update tasks.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1E3] px-4 py-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center py-4">
        <button
          onClick={() => navigate("/main")}
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

      {/* Task Card */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/Images/organization_logo.png"
            alt="Yuva Chetana Logo"
            className="h-22 w-auto object-contain mb-2"
            loading="eager"
          />
          <h2 className="text-xl font-bold text-walnut">Fellow Tasks</h2>
        </div>

        {/* Table Header */}
        {tasks.length > 0 && (
          <div className="hidden sm:grid grid-cols-[1fr_4fr_2fr_2fr_2fr] bg-[#7A3D1A] text-white px-4 py-2 rounded-md text-sm font-semibold">
            <div>Sl No</div>
            <div>Task</div>
            <div>Assigned</div>
            <div>Deadline</div>
            <div>Status</div>
          </div>
        )}

        {/* Task Rows */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks assigned.</div>
        ) : (
          tasks.map((task, index) => {
            const isEnabled =
              index === 0 || tasks[index - 1].status === "Completed";
            const isCompleted = task.status === "Completed";

            return (
              <div
                key={task.id}
                className={`grid sm:grid-cols-[1fr_4fr_2fr_2fr_2fr] grid-cols-1 gap-y-2 gap-x-4 items-center p-4 border rounded-lg shadow-sm text-sm mb-3 ${
                  isCompleted ? "bg-green-100 border-green-400" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div>{index + 1}</div>
                <div>{task.task_name}</div>
                <div>{assignedDate}</div>
                <div>{deadlineDate}</div>
                <div>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(index, e.target.value as "Pending" | "Completed")
                    }
                    disabled={!isEnabled}
                    className={`w-full p-1 border rounded ${
                      isEnabled ? "bg-white" : "bg-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            );
          })
        )}

        {/* Submit Button */}
        {tasks.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-walnut text-white px-6 py-2 rounded-md hover:bg-earth disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Tasks"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FellowTasksPage;
