import { Layout, Menu, Button, Space, Avatar, Dropdown, Typography } from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  PlusOutlined,
  HeartOutlined,
  MessageOutlined,
  SettingOutlined,
  DashboardOutlined,
  SafetyOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../context/UserContext';
import NotificationBell from '../notifications/NotificationBell';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user: auth0User } = useAuth0();
  const { dbUser } = useUser();

  const isAdmin = dbUser?.role === 'ADMIN' || dbUser?.role === 'MODERATOR';

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Accueil' },
    { key: '/listings', icon: <ShopOutlined />, label: 'Annonces' },
    ...(isAuthenticated
      ? [
          { key: '/listings/new', icon: <PlusOutlined />, label: 'Publier' },
          { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tableau de bord' },
          { key: '/wishlists', icon: <HeartOutlined />, label: 'Recherches' },
          { key: '/chat', icon: <MessageOutlined />, label: 'Messages' },
          { key: '/settings', icon: <SettingOutlined />, label: 'Paramètres' },
        ]
      : []),
    ...(isAdmin
      ? [{ key: '/admin', icon: <SafetyOutlined />, label: 'Modération' }]
      : []),
  ];

  const userMenu = {
    items: [
      { key: 'profile', label: dbUser?.email || auth0User?.email, disabled: true },
      { key: 'dashboard', label: 'Tableau de bord', icon: <DashboardOutlined /> },
      { key: 'settings', label: 'Paramètres', icon: <SettingOutlined /> },
      { type: 'divider' as const },
      { key: 'logout', label: 'Déconnexion', icon: <LogoutOutlined />, danger: true },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') {
        logout({ logoutParams: { returnTo: globalThis.location.origin } });
      } else if (key === 'dashboard' || key === 'settings') {
        navigate(`/${key}`);
      }
    },
  };

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ background: '#141414' }}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Typography.Title level={5} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap' }}>
            Petite Maison
          </Typography.Title>
          <Typography.Text style={{ color: '#ff4d4f', fontSize: 11 }}>
            de l'Epouvante
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#141414' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#1f1f1f',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Space size="middle">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Dropdown menu={userMenu} placement="bottomRight">
                  <Avatar
                    src={dbUser?.avatar || auth0User?.picture}
                    icon={<UserOutlined />}
                    style={{ cursor: 'pointer', backgroundColor: '#ff4d4f' }}
                  />
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => loginWithRedirect()}
                >
                  Connexion
                </Button>
                <Button
                  icon={<UserAddOutlined />}
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: { screen_hint: 'signup' },
                    })
                  }
                >
                  Inscription
                </Button>
              </>
            )}
          </Space>
        </Header>
        <Content style={{ margin: '24px', minHeight: 360 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
