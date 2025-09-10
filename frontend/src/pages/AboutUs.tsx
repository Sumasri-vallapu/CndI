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
              className="bg-white text-black px-6 py-2 rounded hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Our Goal</h3>
            <p className="text-white opacity-80 mt-2">Making expert knowledge accessible worldwide</p>
          </div>
        </div>
      </section>

      {/* Problem We Solve */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
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
              desc: "Access speakers from every industry and expertise level."
            },
            {
              title: "Seamless Discovery",
              desc: "Powerful search, filters, and recommendations to find the perfect match."
            },
            {
              title: "Networking Opportunities",
              desc: "More than booking—create lasting professional connections."
            },
          ].map((item, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-2xl p-8 text-center backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                {i === 0 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {i === 1 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {i === 2 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                )}
              </div>
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
            { name: "Alex Johnson", role: "CEO & Founder", image: "/img1.png" },
            { name: "Sarah Chen", role: "CTO", image: "/img2.png" },
            { name: "Mike Williams", role: "Head of Marketing", image: "/img3.png" },
            { name: "Emma Davis", role: "Community Manager", image: "/img4.png" }
          ].map((member, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-2xl p-6 text-center backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-white">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Find Speakers
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Join as Speaker
          </button>
        </div>
      </section>
    </div>
  );
}