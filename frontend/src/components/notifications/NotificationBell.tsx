import { useState, useEffect, useCallback } from 'react';
import { Badge, Dropdown, List, Typography, Button, Empty } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useSocket } from '../../context/SocketContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types';
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../context/UserContext';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const {authReady} = useUser();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && authReady) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, authReady, fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handler = () => {
      fetchNotifications();
    };

    socket.on('notification:new', handler);
    return () => {
      socket.off('notification:new', handler);
    };
  }, [socket, fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const handleClick = (notif: Notification) => {
    if (!notif.read) handleMarkRead(notif.id);
    if (notif.link) navigate(notif.link);
    setOpen(false);
  };

  const dropdownContent = (
    <div style={{ width: 360, maxHeight: 400, overflow: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000' }}>
        <Typography.Text strong style={{ color: '#000' }}>Notifications</Typography.Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" icon={<CheckOutlined />} onClick={handleMarkAllRead}>
            Tout lire
          </Button>
        )}
      </div>
      {notifications.length === 0 ? (
        <Empty description="Aucune notification" style={{ padding: 24 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          dataSource={notifications.slice(0, 10)}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleClick(item)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: item.read ? 'transparent' : '#f6ffed',
              }}
            >
              <List.Item.Meta
                title={<Typography.Text strong={!item.read} style={{ color: '#000' }}>{item.title}</Typography.Text>}
                description={<Typography.Text type="secondary" style={{ fontSize: 12, color: '#000' }}>{item.body}</Typography.Text>}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer', color: '#fff' }} />
      </Badge>
    </Dropdown>
  );
}
