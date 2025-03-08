
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { toast } from '../hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      });
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [isLoggedIn, allowedRoles, user]);

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role restriction exists and user doesn't have the required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
