import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../config/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        try {
          // Try to fetch real data from our new adminAPI
          const response = await adminAPI.getDashboardStats();
          console.log('Dashboard data received:', response.data);
          
          // Set the stats from the API response
          setStats({
            totalProducts: response.data.totalProducts,
            totalUsers: response.data.totalUsers,
            totalOrders: response.data.totalOrders,
            totalRevenue: response.data.totalRevenue
          });
          
          // Set recent orders from the API response
          setRecentOrders(response.data.recentOrders.map(order => ({
            id: order._id,
            customer: order.user.name,
            date: new Date(order.createdAt).toLocaleDateString(),
            total: order.total,
            status: order.status,
            items: order.items
          })));
          
          // Set sales data for the chart
          setSalesData(response.data.salesData || [
            { month: 'Jan', sales: 4500 },
            { month: 'Feb', sales: 5250 },
            { month: 'Mar', sales: 6000 },
            { month: 'Apr', sales: 8100 },
            { month: 'May', sales: 9500 },
            { month: 'Jun', sales: 7800 },
          ]);
        } catch (apiError) {
          console.log('Using mock data due to API error:', apiError);
          // Use dummy data for demonstration
          setStats({
            totalProducts: 48,
            totalUsers: 156,
            totalOrders: 72,
            totalRevenue: 12580
          });
          setRecentOrders([
            { id: '1', customer: 'John Doe', date: '2023-06-15', total: 125.50, status: 'Delivered', items: 3 },
            { id: '2', customer: 'Jane Smith', date: '2023-06-14', total: 78.25, status: 'Processing', items: 2 },
            { id: '3', customer: 'Bob Johnson', date: '2023-06-13', total: 245.00, status: 'Shipped', items: 5 },
            { id: '4', customer: 'Alice Brown', date: '2023-06-12', total: 35.75, status: 'Delivered', items: 1 },
            { id: '5', customer: 'Charlie Wilson', date: '2023-06-11', total: 189.99, status: 'Processing', items: 4 },
          ]);
          // Mock sales data for chart
          setSalesData([
            { month: 'Jan', sales: 4500 },
            { month: 'Feb', sales: 5250 },
            { month: 'Mar', sales: 6000 },
            { month: 'Apr', sales: 8100 },
            { month: 'May', sales: 9500 },
            { month: 'Jun', sales: 7800 },
          ]);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-200 text-green-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Products</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
                  <Link to="/admin/products" className="text-xs text-green-600 hover:underline mt-1 inline-block">Manage products →</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-200 text-blue-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                  <Link to="/admin/users" className="text-xs text-blue-600 hover:underline mt-1 inline-block">View all users →</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-200 text-purple-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                  <Link to="/admin/orders" className="text-xs text-purple-600 hover:underline mt-1 inline-block">Manage orders →</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-200 text-yellow-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                  <p className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
                  <span className="text-xs text-green-600 mt-1 inline-block">+8.2% from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
            <div className="h-64 w-full">
              <div className="flex items-end h-48 w-full space-x-2">
                {salesData.map((item) => (
                  <div key={item.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-green-500 hover:bg-green-600 transition-all rounded-t" 
                      style={{ height: `${(item.sales / 10000) * 100}%` }}
                    ></div>
                    <div className="text-xs font-medium text-gray-500 mt-2">{item.month}</div>
                    <div className="text-xs text-gray-400">₹{item.sales}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-green-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                        <button className="text-gray-600 hover:text-gray-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;