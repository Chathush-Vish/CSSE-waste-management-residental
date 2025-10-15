import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Packages from "./pages/Packages";
import Reviews from "./pages/Reviews";
import Complaints from "./pages/Complaints";

function App() {
   return (
      <Router>
         <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
               <Routes>
                  <Route path="/" element={<Packages />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/complaints" element={<Complaints />} />
               </Routes>
            </main>
         </div>
      </Router>
   );
}

export default App;
