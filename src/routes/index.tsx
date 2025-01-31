import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import CustomerDetails from '../pages/CustomerDetails';
import Deals from '../pages/Deals';
import DealDetails from '../pages/DealDetails';
import Activities from '../pages/Activities';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <Customers />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/customers/:id"
        element={
          <PrivateRoute>
            <CustomerDetails />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/deals"
        element={
          <PrivateRoute>
            <Deals />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/deals/:id"
        element={
          <PrivateRoute>
            <DealDetails />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/activities"
        element={
          <PrivateRoute>
            <Activities />
          </PrivateRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}