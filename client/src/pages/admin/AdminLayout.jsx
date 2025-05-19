import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminLayout = () => {
  const { user } = useAppContext();
  const location = useLocation();

  // Protect admin routes
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navigation = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Orders', path: '/admin/orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-green-700">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-green-800">
            <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive
                      ? 'bg-green-800 text-white'
                      : 'text-green-100 hover:bg-green-600'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4">
            <Link
              to="/"
              className="flex items-center text-green-100 hover:text-white"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;