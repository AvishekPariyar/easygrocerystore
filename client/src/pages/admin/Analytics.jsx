import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../config/api';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState({
    revenue: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0
    },
    orders: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0
    },
    users: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0
    },
    products: {
      total: 0,
      outOfStock: 0,
      lowStock: 0
    },
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getSalesAnalytics();
      console.log('Admin analytics data:', response.data);
      setStats(response.data);
    } catch (error) {
      toast.error('Error fetching analytics');
      console.error('Error fetching analytics:', error);
      
      // Set mock data if API fails
      setStats({
        revenue: {
          total: 125800,
          monthly: 32500,
          weekly: 8700,
          daily: 1250
        },
        orders: {
          total: 728,
          monthly: 186,
          weekly: 43,
          daily: 7
        },
        users: {
          total: 356,
          monthly: 42,
          weekly: 12,
          daily: 3
        },
        products: {
          total: 84,
          outOfStock: 5,
          lowStock: 12
        },
        topProducts: [
          {
            _id: '1',
            name: 'Fresh Apples',
            price: 180,
            image: 'https://example.com/apple.jpg',
            totalSold: 245,
            totalRevenue: 44100
          },
          {
            _id: '2',
            name: 'Organic Bananas',
            price: 60,
            image: 'https://example.com/banana.jpg',
            totalSold: 312,
            totalRevenue: 18720
          },
          {
            _id: '3',
            name: 'Brown Rice',
            price: 120,
            image: 'https://example.com/rice.jpg',
            totalSold: 178,
            totalRevenue: 21360
          },
          {
            _id: '4',
            name: 'Whole Wheat Bread',
            price: 45,
            image: 'https://example.com/bread.jpg',
            totalSold: 267,
            totalRevenue: 12015
          },
          {
            _id: '5',
            name: 'Organic Milk',
            price: 85,
            image: 'https://example.com/milk.jpg',
            totalSold: 203,
            totalRevenue: 17255
          }
        ],
        recentOrders: [
          {
            _id: '60d21b4667d0d8992e610c85',
            user: { name: 'John Doe' },
            total: 540,
            status: 'delivered'
          },
          {
            _id: '60d21b4667d0d8992e610c86',
            user: { name: 'Jane Smith' },
            total: 120,
            status: 'processing'
          },
          {
            _id: '60d21b4667d0d8992e610c87',
            user: { name: 'Bob Johnson' },
            total: 350,
            status: 'pending'
          },
          {
            _id: '60d21b4667d0d8992e610c88',
            user: { name: 'Alice Brown' },
            total: 780,
            status: 'delivered'
          },
          {
            _id: '60d21b4667d0d8992e610c89',
            user: { name: 'Charlie Wilson' },
            total: 230,
            status: 'shipped'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-semibold">{formatCurrency(stats.revenue.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly</span>
              <span className="text-green-600">{formatCurrency(stats.revenue.monthly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly</span>
              <span className="text-green-600">{formatCurrency(stats.revenue.weekly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today</span>
              <span className="text-green-600">{formatCurrency(stats.revenue.daily)}</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Orders</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-semibold">{formatNumber(stats.orders.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly</span>
              <span>{formatNumber(stats.orders.monthly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly</span>
              <span>{formatNumber(stats.orders.weekly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today</span>
              <span>{formatNumber(stats.orders.daily)}</span>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Users</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-semibold">{formatNumber(stats.users.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly</span>
              <span>{formatNumber(stats.users.monthly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weekly</span>
              <span>{formatNumber(stats.users.weekly)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today</span>
              <span>{formatNumber(stats.users.daily)}</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Products</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-xl font-semibold">{formatNumber(stats.products.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Out of Stock</span>
              <span className="text-red-600">{formatNumber(stats.products.outOfStock)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Low Stock</span>
              <span className="text-yellow-600">{formatNumber(stats.products.lowStock)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {stats.topProducts.map((product) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(product.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatNumber(product.totalSold)} sold</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(product.totalRevenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Order #{order._id.slice(-6)}</div>
                  <div className="text-sm text-gray-500">{order.user.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(order.total)}</div>
                  <div className="text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
