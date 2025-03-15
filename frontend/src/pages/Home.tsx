import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageCarousel from "@/components/ui/ImageCarousel";
import Testimonials from "@/components/ui/Testimonials"; // ✅ Import Testimonials Component

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"aboutOrg" | "aboutFellowship" | null>(null);

  const toggleSection = (section: "aboutOrg" | "aboutFellowship") => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 py-6 space-y-6">
     
      {/* ✅ Main Introduction Card */}
      <Card className="w-full max-w-3xl text-center shadow-lg">
        <CardContent className="flex justify-center">
        <img 
        src="/Images/organization_logo.png" 
        alt="Yuva Chetana Logo" 
        className="h-16 w-auto object-contain" 
        loading="eager"
        />
        </CardContent>
        <CardContent className="px-6 py-6">
          <h1 className="text-2xl font-bold text-walnut">Dear Young Citizen! Youth of India</h1>
          <h2 className="text-xl font-semibold text-earth mt-2">Welcome to Yuva Chetana!</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Yuva Chetana is a platform for young individuals like you who want to bring change.
            Together, we will work for the growth of our villages!
          </p>
        </CardContent>
      </Card>

      {/* ✅ Moving Image Gallery */}
      <div className="w-full max-w-3xl overflow-hidden rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-walnut text-center mb-4">Our Gallery</h3>

        <ImageCarousel className="max-w-full" />
      </div>

      {/* ✅ About Organization */}
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="px-6 py-5">
          <h3 className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" 
              onClick={() => toggleSection("aboutOrg")}>
            About Organization
            <span>{activeSection === "aboutOrg" ? "▼" : "►"}</span>
          </h3>
          {activeSection === "aboutOrg" && (
            <p className="text-gray-700 leading-relaxed mt-3">
              Bharat Dekho is a non-profit organization working towards youth empowerment in rural areas of Telangana.
              We aim to enable leadership and 21st-century skills in youth by providing them platforms to create change.
              We welcome you to join this community of youth leaders!
            </p>
          )}
        </CardContent>
      </Card>

      {/* ✅ About Fellowship */}
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="px-6 py-5">
          <h3 className="text-lg font-bold text-walnut cursor-pointer flex justify-between items-center" 
              onClick={() => toggleSection("aboutFellowship")}>
            About Fellowship
            <span>{activeSection === "aboutFellowship" ? "▼" : "►"}</span>
          </h3>
          {activeSection === "aboutFellowship" && (
            <ul className="text-gray-700 list-disc list-inside mt-3">
              <li>Bharat: A 1-year long volunteering program for local youth to work on learning and wellbeing of children.</li>
              <li>Bose Fellowship: An opportunity for rural youth, and through them, a chance for children and the village.</li>
              <li>Volunteers from ______ villages, supporting ______ children.</li>
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ✅ Testimonials Section */}
      <Testimonials />

      {/* ✅ Login Button */}
      <div className="fixed bottom-8 text-white flex justify-center w-full hover:opacity-90 hover:scale-105 transition-all">
        <Button onClick={() => navigate("/login")} className="max-w-lg w-full">
          Login/Sign Up
        </Button>
      </div>
    </div>
  );
};

export default Home;