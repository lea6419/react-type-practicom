import React from 'react';
import { Home, User, LogIn, LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md w-full flex items-center justify-between p-4">
      {/* Navigation Buttons Left Side */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-blue-600 transition-colors">
          <Home size={24} />
        </button>
        <button className="text-gray-700 hover:text-blue-600 transition-colors">
          <User size={24} />
        </button>
      </div>

      {/* Logo Center */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img 
          src="/api/placeholder/150/50" 
          alt="Logo" 
          className="h-10 object-contain"
        />
      </div>

      {/* Login/Logout Buttons Right Side */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center text-green-600 hover:text-green-800 transition-colors">
          <LogIn size={20} className="mr-2" />
          Login
        </button>
        <button className="flex items-center text-red-600 hover:text-red-800 transition-colors">
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;