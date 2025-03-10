import { useState } from "react";
import { cn } from "@/lib/utils"; // Helper for conditional styling
import { Menu, X, ChevronDown } from "lucide-react"; // Icons from Lucide
import { motion } from "framer-motion"; // For animations

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        className="absolute top-4 left-4 z-50 p-2 rounded-md bg-onyx text-white"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-onyx text-white shadow-lg z-40"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Navigation Items */}
        <nav className="mt-12 space-y-4 px-4">
          {/* Profiles Section */}
          <div>
            <button
              className="flex justify-between w-full text-left p-2 hover:bg-walnut rounded"
              onClick={() => toggleSection("profiles")}
            >
              Profiles
              <ChevronDown className={cn("transition-transform", openSection === "profiles" && "rotate-180")} />
            </button>
            {openSection === "profiles" && (
              <div className="pl-4 space-y-2">
                <a href="#" className="block p-2 hover:bg-earth rounded">My Profile</a>
                <a href="#" className="block p-2 hover:bg-earth rounded">My LC Profile</a>
                <a href="#" className="block p-2 hover:bg-earth rounded">My Children's Profile</a>
              </div>
            )}
          </div>

          {/* Assessments Section */}
          <div>
            <button
              className="flex justify-between w-full text-left p-2 hover:bg-walnut rounded"
              onClick={() => toggleSection("assessments")}
            >
              Assessments
              <ChevronDown className={cn("transition-transform", openSection === "assessments" && "rotate-180")} />
            </button>
            {openSection === "assessments" && (
              <div className="pl-4 space-y-2">
                <a href="#" className="block p-2 hover:bg-earth rounded">Baseline</a>
                <a href="#" className="block p-2 hover:bg-earth rounded">Endline</a>
              </div>
            )}
          </div>

          {/* Surveys Section */}
          <div>
            <button
              className="flex justify-between w-full text-left p-2 hover:bg-walnut rounded"
              onClick={() => toggleSection("surveys")}
            >
              Surveys
              <ChevronDown className={cn("transition-transform", openSection === "surveys" && "rotate-180")} />
            </button>
            {openSection === "surveys" && (
              <div className="pl-4 space-y-2">
                <a href="#" className="block p-2 hover:bg-earth rounded">Monthly Reflections</a>
                <a href="#" className="block p-2 hover:bg-earth rounded">Quarterly Feedbacks</a>
                <a href="#" className="block p-2 hover:bg-earth rounded">Annual Testimonials</a>
              </div>
            )}
          </div>
        </nav>
      </motion.div>
    </>
  );
}
