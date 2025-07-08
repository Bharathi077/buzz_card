import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Render a loading spinner while checking auth state
    return <div className="flex items-center justify-center h-screen w-screen bg-slate-100 text-brand-purple">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // By adding a key based on the user's unique ID, we ensure that React
  // unmounts the old component and mounts a new one whenever the user logs in
  // or changes. This is the most reliable way to reset the state of the dashboard.
  return <React.Fragment key={user.id}>{children}</React.Fragment>;
};

export default ProtectedRoute;