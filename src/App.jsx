import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/auth/Login";
import CoinPackages from "./pages/coins/CoinPackages";
import PaymentDisputes from "./pages/coins/PaymentDisputes";
import GarbageCollection from "./pages/collection/GarbageCollection";
import FeedbackRating from "./pages/feedback/FeedbackRating";
import ComplaintTracking from "./pages/complaints/ComplaintTracking";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Check if user is already logged in
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
         setUser(JSON.parse(savedUser));
      }
      setLoading(false);
   }, []);

   const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
   };

   const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('user');
   };

   const handleUpdateUser = (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="text-xl">Loading...</div>
         </div>
      );
   }

   if (!user) {
      return <Login onLogin={handleLogin} />;
   }

   return (
      <Router>
         <div className="flex h-screen bg-gray-100">
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="flex-1 p-6 overflow-auto">
               <Routes>
                  {user.type === 'admin' ? (
                     <>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/disputes" element={<PaymentDisputes user={user} />} />
                        <Route path="/complaints" element={<ComplaintTracking user={user} />} />
                        <Route path="/feedback" element={<FeedbackRating user={user} />} />
                     </>
                  ) : (
                     <>
                        <Route path="/" element={<CoinPackages user={user} onUpdateUser={handleUpdateUser} />} />
                        <Route path="/collection" element={<GarbageCollection user={user} onUpdateUser={handleUpdateUser} />} />
                        <Route path="/feedback" element={<FeedbackRating user={user} />} />
                        <Route path="/complaints" element={<ComplaintTracking user={user} />} />
                        <Route path="/disputes" element={<PaymentDisputes user={user} />} />
                     </>
                  )}
               </Routes>
            </main>
         </div>
      </Router>
   );
}

export default App;
