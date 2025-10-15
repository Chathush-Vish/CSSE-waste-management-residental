import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
   Package,
   MessageSquare,
   CreditCard,
   Star,
   Menu,
   X,
} from "lucide-react";

function Sidebar() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const [activeLink, setActiveLink] = useState("packages");

   const navLinks = [
      { id: "packages", name: "Packages", icon: Package, link: "/" },
      {
         id: "complaints",
         name: "Complaints",
         icon: MessageSquare,
         link: "/complaints",
      },
      { id: "payments", name: "Payments", icon: CreditCard, link: "/payments" },
      { id: "reviews", name: "Reviews", icon: Star, link: "/reviews" },
   ];

   return (
      <aside
         className={`${
            isSidebarOpen ? "w-64" : "w-0"
         } bg-green-700 text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
         <div className="p-6 border-b border-green-600">
            <h1 className="text-2xl font-bold whitespace-nowrap">
               WasteManage
            </h1>
            <p className="text-sm text-green-100 mt-1 whitespace-nowrap">
               Dashboard
            </p>
         </div>

         <nav className="flex-1 p-4">
            <ul className="space-y-2">
               {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                     <Link to={link.link} key={link.id} className="block">
                        <li>
                           <button
                              onClick={() => setActiveLink(link.id)}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                                 activeLink === link.id
                                    ? "bg-green-600 text-white"
                                    : "text-green-100 hover:bg-green-600 hover:text-white"
                              }`}
                           >
                              <Icon size={20} />
                              <span className="font-medium">{link.name}</span>
                           </button>
                        </li>
                     </Link>
                  );
               })}
            </ul>
         </nav>

         <div className="p-4 border-t border-green-600">
            <div className="flex items-center space-x-3 px-4 py-2">
               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">U</span>
               </div>
               <div className="whitespace-nowrap">
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-green-200">Admin</p>
               </div>
            </div>
         </div>
      </aside>
   );
}

export default Sidebar;
