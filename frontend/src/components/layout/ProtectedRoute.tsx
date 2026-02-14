import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
