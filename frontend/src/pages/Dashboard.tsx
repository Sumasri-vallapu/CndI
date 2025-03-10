import { FaBookOpen, FaClipboardCheck, FaTasks, FaChartBar } from "react-icons/fa";

const Dashboard = () => {
  const sections = [
    {
      title: "Learning Program",
      icon: <FaBookOpen className="text-white text-3xl" />,
      bg: "bg-gradient-to-br from-walnut via-earth to-[#C4A484]", // Softer transition
      items: ["Monthly Module List", "My Progress"],
    },
    {
      title: "Attendance",
      icon: <FaClipboardCheck className="text-white text-3xl" />,
      bg: "bg-gradient-to-br from-[#A86543] via-walnut to-[#7A3D1A]", // Depth effect
      items: ["My Attendance", "Children Attendance"],
    },
    {
      title: "My Tasks",
      icon: <FaTasks className="text-white text-3xl" />,
      bg: "bg-gradient-to-br from-onyx via-[#5A2D0C] to-walnut", // Dark but warm
      items: ["My Task List", "My Task Status D/ND", "My Task Completion Rate (%)"],
    },
    {
      title: "My Performance",
      icon: <FaChartBar className="text-white text-3xl" />,
      bg: "bg-gradient-to-br from-[#7A3D1A] via-earth to-[#C4A484]", // Brighter and smooth
      items: ["My Monthly Attendance %", "LC Monthly Att% (Avg of Student Att)", "My Task Completion %", "My TL Rating"],
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-2xl font-bold text-onyx text-center">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`${section.bg} rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center space-x-3">
              {section.icon}
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            </div>
            <ul className="mt-2 text-white text-sm">
              {section.items.map((item, idx) => (
                <li key={idx} className="mt-1">- {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
