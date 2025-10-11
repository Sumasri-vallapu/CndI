import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-gray-50 to-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-900"
        >
          About Connect & Inspire
        </motion.h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          We are on a mission to connect expert speakers with event organizers, creating meaningful opportunities and unforgettable experiences.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg">
              At Connect & Inspire, our mission is simple: to bring together event hosts and speakers from across industries, making knowledge-sharing and inspiration accessible to all. We believe every event deserves the perfect voice to inspire its audience.
            </p>
          </div>
          <img
            src="/images/mission-placeholder.jpg"
            alt="Mission"
            className="rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img
            src="/images/problem-placeholder.jpg"
            alt="Problem"
            className="rounded-2xl shadow-md"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">The Problem We Solve</h2>
            <p className="text-gray-600 text-lg">
              Finding the right speaker for an event is often challenging, time-consuming, and limited to personal networks. Event organizers struggle with discovery and booking, while talented speakers miss out on opportunities to share their expertise. We solve this by creating a seamless marketplace for discovery, booking, and connection.
            </p>
          </div>
        </div>
      </section>

      {/* Unique Value */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          What Makes Us Unique
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "10,000+ Experts",
              desc: "Access speakers from every industry and expertise level.",
            },
            {
              title: "Seamless Discovery",
              desc: "Powerful search, filters, and recommendations to find the perfect match.",
            },
            {
              title: "Networking Opportunities",
              desc: "More than booking—create lasting professional connections.",
            },
          ].map((item, i) => (
            <Card key={i} className="rounded-2xl shadow-md">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          Meet Our Team
        </h2>
        <div className="mt-12 grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((member) => (
            <Card key={member} className="rounded-2xl shadow-sm border">
              <CardContent className="p-6 text-center">
                <img
                  src={`/images/team-placeholder-${member}.jpg`}
                  alt={`Team Member ${member}`}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  Team Member {member}
                </h3>
                <p className="text-gray-600">Role Placeholder</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
