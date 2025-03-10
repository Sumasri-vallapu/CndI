import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-onyx">
      {/* Hero Section */}
      <section className="relative text-center py-16 px-6">
        <h1 className="text-2xl font-bold text-walnut md:text-5xl">

          Empower Change. Lead the Future.
        </h1>
        <h1 className="text-10xl font-bold text-red-500">Aravali Hotel in Mount Abut</h1>

        <p className="mt-3 text-lg text-gray-700 md:text-xl">
          Join Yuva Chetana and make an impact in your village today.
        </p>
        <div className="mt-6">
          <Button className="bg-walnut text-white px-6 py-3 rounded-xl hover:bg-earth transition">
            Join Now
          </Button>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-6 py-12">
        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-walnut">
          <h2 className="text-xl font-bold text-walnut">About Yuva Chetana</h2>
          <p className="text-gray-700 mt-2">
            Yuva Chetana empowers young individuals like you to lead change in rural India.
          </p>
        </div>
      </section>

      {/* Live Counter */}
      <section className="px-6 py-12 text-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-3xl font-bold text-walnut">500+</h3>
            <p className="text-sm text-gray-600">Active Volunteers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-walnut">100+</h3>
            <p className="text-sm text-gray-600">Villages Reached</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-walnut">10,000+</h3>
            <p className="text-sm text-gray-600">Children Benefited</p>
          </div>
        </div>
      </section>

      {/* Scrolling Testimonials */}
      <section className="px-6 py-12">
        <h2 className="text-xl font-bold text-walnut text-center">What People Say</h2>
        <motion.div
          className="mt-6 overflow-hidden"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <div className="flex space-x-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-700">"An amazing platform to drive change!"</p>
              <span className="text-sm text-walnut font-semibold">- Volunteer</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md">
              <p className="text-gray-700">"Helped my village kids grow!"</p>
              <span className="text-sm text-walnut font-semibold">- Parent</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
