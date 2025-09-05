import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#27465C] flex flex-col">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-white text-3xl font-bold">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/home')} className="text-white hover:opacity-80">Home</button>
            <button onClick={() => navigate('/about')} className="text-white hover:opacity-80">About Us</button>
            <a href="#" className="text-white hover:opacity-80">Contact us</a>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          About Connect & Inspire
        </h1>
        <p className="text-lg md:text-xl text-white opacity-90 max-w-3xl mx-auto">
          We are on a mission to connect expert speakers with event organizers, creating meaningful opportunities and unforgettable experiences.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-white mb-6">Our Mission</h2>
            <p className="text-white opacity-90 text-lg leading-relaxed">
              At Connect & Inspire, our mission is simple: to bring together event hosts and speakers from across industries, making knowledge-sharing and inspiration accessible to all. We believe every event deserves the perfect voice to inspire its audience.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white">Our Goal</h3>
            <p className="text-white opacity-80 mt-2">Making expert knowledge accessible worldwide</p>
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white">The Challenge</h3>
            <p className="text-white opacity-80 mt-2">Finding the right speaker shouldn't be difficult</p>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-6">The Problem We Solve</h2>
            <p className="text-white opacity-90 text-lg leading-relaxed">
              Finding the right speaker for an event is often challenging, time-consuming, and limited to personal networks. Event organizers struggle with discovery and booking, while talented speakers miss out on opportunities to share their expertise. We solve this by creating a seamless marketplace for discovery, booking, and connection.
            </p>
          </div>
        </div>
      </section>

      {/* Unique Value */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-black text-center text-white mb-16">
          What Makes Us Unique
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "10,000+ Experts",
              desc: "Access speakers from every industry and expertise level.",
              icon: "👥"
            },
            {
              title: "Seamless Discovery",
              desc: "Powerful search, filters, and recommendations to find the perfect match.",
              icon: "🔎"
            },
            {
              title: "Networking Opportunities",
              desc: "More than booking—create lasting professional connections.",
              icon: "🤝"
            },
          ].map((item, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-white opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-black text-center text-white mb-16">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Alex Johnson", role: "CEO & Founder", avatar: "👨‍💼" },
            { name: "Sarah Chen", role: "CTO", avatar: "👩‍💻" },
            { name: "Mike Williams", role: "Head of Marketing", avatar: "👨‍🎨" },
            { name: "Emma Davis", role: "Community Manager", avatar: "👩‍🤝‍👩" }
          ].map((member, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="text-lg font-bold text-white mb-2">
                {member.name}
              </h3>
              <p className="text-white opacity-80">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-black text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-white opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of event organizers and speakers who are already connecting and inspiring through our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/find-speaker')}
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
          >
            Find Speakers
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
          >
            Join as Speaker
          </button>
        </div>
      </section>
    </div>
  );
}