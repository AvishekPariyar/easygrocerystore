import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  QuestionMarkCircleIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin' },
    { name: 'Products', icon: ShoppingBagIcon, path: '/admin/products' },
    { name: 'Queries', icon: QuestionMarkCircleIcon, path: '/admin/queries' },
    { name: 'Reports', icon: DocumentChartBarIcon, path: '/admin/reports' },
    { name: 'Statistics', icon: ChartBarIcon, path: '/admin/statistics' },
    { name: 'Profile', icon: UserIcon, path: '/admin/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-green-600">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                    isActive(item.path) ? 'bg-green-50 text-green-600' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {/* Add logout handler */}}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg
              className="h-5 w-5 mr-3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
