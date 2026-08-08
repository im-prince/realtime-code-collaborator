import { Navigate } from 'react-router-dom';
import { getToken } from '../lib/api.js';

export default function RequireAuth({ children }) {
  if (!getToken()) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}