import { useNavigate } from 'react-router-dom';

const speakerImages = [
  "/img1.png", // These should be replaced with actual speaker images
  "/img2.png",
  "/img3.png",
  "/img4.png",
  "/img5.png",
  "/img6.png",
  "/img7.png"
];

export default function Home() {
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
            <a href="#" className="text-white hover:opacity-80">Home</a>
            <a href="#" className="text-white hover:opacity-80">About Us</a>
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

      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-8">
        {/* Speaker Images Grid */}
        <div className="flex justify-center items-end gap-4 mb-12">
          {speakerImages.map((src, idx) => (
            <div
              key={idx}
              className="rounded-lg overflow-hidden shadow-lg"
              style={{
                width: idx === 3 ? '60px' : idx === 0 || idx === 1 || idx === 5 || idx === 6 ? '120px' : '90px',
                height: idx === 3 ? '80px' : idx === 0 || idx === 1 || idx === 5 || idx === 6 ? '160px' : '120px',
                marginTop: idx === 3 ? '40px' : idx === 2 ? '20px' : '0',
              }}
            >
              <img 
                src={src} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <p className="text-white text-lg mb-8">
            Access 10,000+ expert speakers across every industry.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/find-speaker')}
              className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Find your next speaker
            </button>
            <button className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition-colors">
              Get discovered as a speaker
            </button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 text-white max-w-4xl">
          <div>
            <p className="italic mb-2">"Easiest way to find inspiring speakers for our annual summit!"</p>
            <p className="font-semibold">— Event Host, 2025</p>
          </div>
          <div>
            <p className="italic mb-2">"I connected with amazing events and grew my network."</p>
            <p className="font-semibold">— Guest Speaker</p>
          </div>
        </div>
      </main>
    </div>
  );
}