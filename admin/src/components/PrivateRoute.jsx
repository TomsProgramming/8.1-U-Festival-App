import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../auth.js';

export default function PrivateRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}
