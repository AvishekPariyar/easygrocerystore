import { createBrowserRouter, Navigate, Link } from 'react-router-dom';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import Login from './pages/auth/Login';
import Register from "./pages/auth/Register";
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import { useAppContext } from './context/AppContext';
import PaymentVerification from './pages/PaymentVerification';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAppContext();
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If a specific role is required and user doesn't have it, redirect to unauthorized
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  // User is logged in and has the required role (or no specific role required)
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAppContext();
  
  // If user is logged in, redirect based on role
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }
  
  // User is not logged in, show the public route
  return children;
};

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600">
          Go back home
        </Link>
      </div>
    </div>
  );
};

const UnauthorizedPage = () => {
  const { user } = useAppContext();
  const homePath = user?.role === 'admin' ? '/admin' : '/';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link to={homePath} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600">
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
};

// Define routes array
// Create browser router configuration
const routes = [
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'product/:id', element: <ProductDetail /> },  // Support both URL patterns
      { path: 'cart', element: <Cart /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'checkout', element: <PrivateRoute><Checkout /></PrivateRoute> },
      { path: 'profile', element: <PrivateRoute><Profile /></PrivateRoute> },
      { path: 'order-confirmation', element: <OrderConfirmation /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
      { path: 'payment/verify', element: <PaymentVerification /> },
      {
        path: 'login',
        element: <PublicRoute><Login /></PublicRoute>,
      },
      {
        path: 'register',
        element: <PublicRoute><Register /></PublicRoute>,
      },
    ],
  },
  {
    path: '/admin',
    element: <PrivateRoute requiredRole="admin"><AdminLayout /></PrivateRoute>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <Orders /> },
      { path: 'users', element: <Users /> },
      { path: 'analytics', element: <Analytics /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

