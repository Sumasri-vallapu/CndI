import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Add other routes as needed */}
              <Route 
                path="/login" 
                element={
                  <div className="container flex items-center justify-center min-h-screen">
                    Login Page
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}



