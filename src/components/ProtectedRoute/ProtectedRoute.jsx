
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function ProtectedRoute({ children, allowedRoles = ['recruiter'] }) {
  const { accessToken, user } = useAuth();

  // Check whether the user is logged in.
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admins can access all protected routes.
  if (user.is_superuser) {
    return children;
  }

  // Check whether the user's role is authorized.
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
