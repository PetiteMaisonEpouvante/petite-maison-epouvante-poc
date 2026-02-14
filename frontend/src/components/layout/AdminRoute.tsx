import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useUser } from '../../context/UserContext';

export default function AdminRoute() {
  const { dbUser, loading } = useUser();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!dbUser || !['ADMIN', 'MODERATOR'].includes(dbUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
