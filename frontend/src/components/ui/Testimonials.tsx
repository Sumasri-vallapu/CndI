import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

// ✅ Testimonial Data
const testimonials = [
  {
    text: "My parents didn’t get a chance to get an education, they don’t have a signature, they give their thumbprints and that’s why they sent me to school and college...",
    author: "Narra Manga",
    college: "Gayathri Degree College",
    age: 20,
    location: "Perkapalli Village, Dharmaram Mandal, Peddapalli District, Telangana",
  },
  {
    text: "I feel great! My journey changed me a lot, my perspectives have broadened, I am thinking critically and sharing my opinions...",
    author: "Erugulara Harish",
    college: "Trinity Degree College",
    age: 21,
    location: "Julapalli Village, Kamanpur Mandal, Peddapalli District",
  },
];

// ✅ Testimonials Component
const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-walnut text-center mb-4">What Our Fellows Say</h3>
      <Card className="overflow-hidden w-full">
        <CardContent className="p-6 transition-opacity duration-700 ease-in-out">
          <p className="text-gray-800 text-lg italic">"{testimonials[currentIndex].text}"</p>
          <div className="mt-4 text-right">
            <p className="text-walnut font-bold">{testimonials[currentIndex].author}, {testimonials[currentIndex].age}</p>
            <p className="text-gray-600 text-sm">{testimonials[currentIndex].college}</p>
            <p className="text-gray-500 text-sm">{testimonials[currentIndex].location}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Testimonials;
