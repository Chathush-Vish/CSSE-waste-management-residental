import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Star,
  MessageSquare,
  Menu,
  X,
  Home,
  User,
  Trash2,
  Coins,
  DollarSign,
  Shield,
  LogOut,
  AlertTriangle
} from "lucide-react";

const Sidebar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const adminMenuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: DollarSign, label: "Payment Disputes", path: "/disputes" },
    { icon: MessageSquare, label: "Complaints", path: "/complaints" },
    { icon: Star, label: "Feedback", path: "/feedback" },
  ];

  const userMenuItems = [
    { icon: Coins, label: "Coin Packages", path: "/" },
    { icon: Trash2, label: "Garbage Collection", path: "/collection" },
    { icon: Star, label: "Feedback & Rating", path: "/feedback" },
    { icon: MessageSquare, label: "Complaints", path: "/complaints" },
    { icon: AlertTriangle, label: "Payment Disputes", path: "/disputes" },
  ];

  const menuItems = user?.type === 'admin' ? adminMenuItems : userMenuItems;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isOpen ? "w-64" : "w-16"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`flex items-center ${!isOpen && "justify-center"}`}>
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <span className="ml-3 text-xl font-semibold text-gray-800">
                WasteManager
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user.type === 'admin' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {user.type === 'admin' ? (
                  <Shield className={`w-6 h-6 ${user.type === 'admin' ? 'text-red-600' : 'text-blue-600'}`} />
                ) : (
                  <User className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user.type}</p>
                {user.type === 'user' && (
                  <div className="flex items-center mt-1">
                    <Coins className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600 font-medium">
                      {user.coinBalance || 0} coins
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-6 flex-1">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 ${
              !isOpen && "justify-center"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;
