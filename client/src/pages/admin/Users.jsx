import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../config/api';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { user: currentUser } = useAppContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      console.log('Admin users data:', response.data);
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
      // Set mock data if API fails
      setUsers([
        {
          _id: '60d21b4667d0d8992e610c87',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          isActive: true,
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
          orderCount: 5,
          totalSpent: 2500
        },
        {
          _id: '60d21b4667d0d8992e610c88',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'user',
          isActive: true,
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 days ago
          orderCount: 3,
          totalSpent: 1200
        },
        {
          _id: '60d21b4667d0d8992e610c89',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date(Date.now() - 60 * 86400000).toISOString(), // 60 days ago
          orderCount: 0,
          totalSpent: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await adminAPI.updateUserRole(userId, role);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user role');
      console.error('Error updating user role:', error);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUserStatus(userId, isActive);
      toast.success(isActive ? 'User activated' : 'User deactivated');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user status');
      console.error('Error updating user status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or email"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
            <select
              id="roleFilter"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="bg-gray-100 rounded-md p-2 text-sm text-gray-700">
              Total Users: <span className="font-semibold">{users.length}</span> | 
              Showing: <span className="font-semibold">{filteredUsers.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      disabled={user.role === 'admin' || user._id === currentUser?.id} // Prevent changing admin roles or current user
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserStatus(user._id, !user.isActive)}
                      className={`${
                        user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      } mr-4`}
                      disabled={user.role === 'admin' || user._id === currentUser?.id} // Prevent deactivating admins or current user
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-green-600 hover:text-green-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? `No users match "${searchTerm}"` : 'No users available with the selected filters.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
      
      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Basic Information</h3>
                <p className="text-sm text-gray-600">
                  Name: {selectedUser.name}<br />
                  Email: {selectedUser.email}<br />
                  Role: {selectedUser.role}<br />
                  Status: {selectedUser.isActive ? 'Active' : 'Inactive'}<br />
                  Joined: {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Order Statistics</h3>
                <p className="text-sm text-gray-600">
                  Total Orders: {selectedUser.orderCount || 0}<br />
                  Total Spent: ₹{selectedUser.totalSpent?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
