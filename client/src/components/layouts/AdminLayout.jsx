import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminLayout = () => {
  const { user, logout } = useAppContext();
  console.log('AdminLayout rendered with user:', user);

  // Redirect if user is not logged in or is not an admin
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    console.log('User is not admin, redirecting to unauthorized', user.role);
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('User is admin, rendering admin layout');

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || 
           (path.endsWith('/') && location.pathname.startsWith(path)) ? 
           'bg-green-700 text-white' : '';
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-sm hover:text-green-200 flex items-center">
                <span>View Store</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="font-medium">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 pt-2 border-t border-green-700">
              <Link to="/" className="block py-2 hover:bg-green-700 rounded px-2">View Store</Link>
              <div className="flex items-center space-x-2 py-2 px-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="font-medium">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Navigation Cards */}
          <div className="w-full md:w-1/4 px-4 mb-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Link
                to="/admin"
                className={`flex items-center px-4 py-3 hover:bg-green-600 hover:text-white ${isActive('/admin')}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Analytics</span>
              </Link>
              <Link
                to="/admin/products"
                className={`flex items-center px-4 py-3 hover:bg-green-600 hover:text-white ${isActive('/admin/products')}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Products</span>
              </Link>
              <Link
                to="/admin/orders"
                className={`flex items-center px-4 py-3 hover:bg-green-600 hover:text-white ${isActive('/admin/orders')}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Orders</span>
              </Link>
              <Link
                to="/admin/users"
                className={`flex items-center px-4 py-3 hover:bg-green-600 hover:text-white ${isActive('/admin/users')}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Users</span>
              </Link>
              <div className="border-t border-gray-200 mt-2">
                <button
                  onClick={logout}
                  className={`flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4 px-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
