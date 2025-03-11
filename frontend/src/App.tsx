// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>  
//       </div>
//       <h1 className="text-emerald-500">Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App




// import CounterApp from "@/components/ui/CounterApp";

// export default function App() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-4">React Counter Example</h1>
//       <CounterApp />
//     </div>
//   );
// }




// import UsersList from "./components/ui/UsersList";

// export default function App() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-4">React API Fetch Example</h1>
//       <UsersList /> {/* ✅ Renders the UsersList component */}
//     </div>
//   );
// }


// // Import React and the Button component
// import { Button } from "./components/ui/button"; // Importing ShadCN Button

// function App() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       {/* Heading */}
//       <h1 className="text-2xl font-bold text-[#7A3D1A] mb-4">Welcome to My App</h1>
      
//       {/* Using the ShadCN Button */}
//       <Button variant="default">Click Me</Button>
      
//       {/* Outline Button */}
//       <Button variant="outline" className="mt-4">Outline Button</Button>

//       <Button variant="destructive" className="mt-4">Delete</Button>
//       </div>
//   );
// }

  // export default App;





// import AnnualTestimonial from "./components/ui/AnnanulTestimony";
// // import SideNav from "./components/ui/Test";

// export default function App() { 
//   return (
//     <div className="relative">
//       <AnnualTestimonial />
//       <main className="p-4">
//         <h1 className="text-xl font-bold">Main Screen</h1>
//       </main>
//     </div>
//   );
// }



// import { useState } from 'react';

// function MyButton() {
//   const [count, setCount] = useState(0);

//   function handleClick() {
//     setCount(count + 1);
//   }

//   return (
//     <button onClick={handleClick}>
//       Clicked {count} times
//     </button>
//   );
// }

// // Ensure App function is at the top level
// export default function App() {
//   return (
//     <div>
//       <MyButton />
//       <MyButton />
//     </div>
//   );
// }


// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import Home from "./pages/Home";
// import './App.css'
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router> 
//   );
// }

// export default App;


// import AnnualTestimonial from "./components/ui/AnnanulTestimony";

import UploadPhoto from "./components/ui/UploadPhoto";

// import Home from "./pages/Home";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <UploadPhoto />
    </div>
  );  
}

export default App;
