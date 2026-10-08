import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Only logged-in users
export function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.auth.currentUser);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

// Only logged-out users (login/register pages)
export function GuestRoute({ children }) {
  const user = useSelector((s) => s.auth.currentUser);
  const location = useLocation();
  if (user) return <Navigate to={location.state?.from?.pathname || '/events'} replace />;
  return children;
}