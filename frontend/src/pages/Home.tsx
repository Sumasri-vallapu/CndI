import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageCarousel from "@/components/ui/ImageCarousel";
import Testimonials from "@/components/ui/Testimonials";

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"aboutOrg" | "aboutFellowship" | null>(null);

  const toggleSection = (section: "aboutOrg" | "aboutFellowship") => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F4F1E3] px-4 py-6 space-y-6">
      {/* ✅ Main Introduction */}
      <div className="w-full max-w-3xl text-center shadow-lg p-6 rounded-lg bg-white">
        <img 
          src="/Images/organization_logo.png" 
          alt="Yuva Chetana Logo" 
          className="h-16 w-auto mx-auto mb-4 object-contain"
          loading="eager"
        />
        <h1 className="text-2xl font-bold text-walnut">Dear Young Citizen! Youth of India</h1>
        <h2 className="text-xl font-semibold text-earth mt-2">Welcome to Yuva Chetana!</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Yuva Chetana is a platform for young individuals like you who want to bring change.
          Together, we will work for the growth of our villages!
        </p>
      </div>

      {/* ✅ Moving Image Gallery */}
      <div className="w-full max-w-3xl overflow-hidden rounded-lg shadow-md p-6 bg-white">
        <h3 className="text-2xl font-bold text-walnut text-center mb-4">Our Gallery</h3>
        <ImageCarousel className="max-w-full" />
      </div>

      {/* ✅ About Organization */}
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h3 
          className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" 
          onClick={() => toggleSection("aboutOrg")}
        >
          About Bharat Dekho
          <span>{activeSection === "aboutOrg" ? "▼" : "►"}</span>
        </h3>
        {activeSection === "aboutOrg" && (
          <p className="text-gray-700 leading-relaxed mt-3">
            Bharat Dekho is a non-profit organization working towards youth empowerment in rural areas of Telangana.
            We aim to enable leadership and 21st-century skills in youth by providing them platforms to create change.
            We welcome you to join this community of youth leaders!
          </p>
        )}
      </div>

      {/* ✅ About Fellowship */}
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h3 
          className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" 
          onClick={() => toggleSection("aboutFellowship")}
        >
          About Bose Fellowship
          <span>{activeSection === "aboutFellowship" ? "▼" : "►"}</span>
        </h3>
        {activeSection === "aboutFellowship" && (
          <div className="text-gray-700 mt-3">
            <p className="mb-2">Bose Fellowship is an opportunity for rural youth to become a change leader for their community.</p>
            <p className="mb-2">It is a 1-year volunteering opportunity for local youth to set up Learning Centers and work for education and well-being of children in their village.</p>
            <p className="mb-2">147 Youth leaders have already set up more than 100 Learning Centers and are supporting 1700+ children across 5 districts in Telangana - Peddapalli, Adilabad, Asifabad, Vikarabad, and Narayanpet.</p>
          </div>
        )}
      </div>

      {/* ✅ Testimonials Section */}
      <Testimonials /> 

      {/* ✅ Login Button */}
      <div className="fixed bottom-8 w-full flex justify-center">
  <div className="w-full max-w-3xl px-6">
    <Button 
      onClick={() => navigate("/login")} 
      className="w-full bg-walnut text-white py-3 rounded-lg shadow-lg hover:opacity-90 hover:scale-105 transition-all"
    >
      Login/Sign Up
    </Button>
  </div>
</div>

    </div>
  );
};

export default Home;