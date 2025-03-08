'use client'
import React, { useState } from 'react';
import { Menu, Home, Settings, User, Mail, Bell } from 'lucide-react';

function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: User, label: 'Profile' },
    { icon: Mail, label: 'Messages' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed h-screen bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isHovered ? 'w-64' : 'w-1'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 border-b">
          <Menu className="w-6 h-6 text-gray-600" />
        </div>

        {/* Menu Items */}
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
            >
              <item.icon className="w-6 h-6" />
              <span
                className={`ml-4 transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isHovered ? 'ml-64' : 'ml-16'} p-8 transition-all duration-300`}>
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Dashboard</h1>
          <p className="text-gray-600">
            Hover over the sidebar on the left to expand it. This is a responsive sidebar that
            smoothly transitions between collapsed and expanded states.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;