import { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Statistic, List, Tag, Spin } from 'antd';
import { ShopOutlined, HeartOutlined, BellOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMyListings } from '../api/listings';
import { getWishlists } from '../api/wishlists';
import { getNotifications } from '../api/notifications';
import { getConversations } from '../api/conversations';
import { useUser } from '../context/UserContext';
import type { Listing, Wishlist, Conversation } from '../types';

export default function DashboardPage() {
  const { dbUser } = useUser();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyListings().catch(() => []),
      getWishlists().catch(() => []),
      getNotifications().catch(() => ({ unreadCount: 0 })),
      getConversations().catch(() => []),
    ]).then(([l, w, n, c]) => {
      setListings(l);
      setWishlists(w);
      setUnreadNotifs(n.unreadCount);
      setConversations(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  return (
    <div>
      <Typography.Title level={3}>
        Bonjour, {dbUser?.nickname || dbUser?.email}
      </Typography.Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card hoverable onClick={() => navigate('/my-listings')}>
            <Statistic title="Mes annonces" value={listings.length} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable onClick={() => navigate('/wishlists')}>
            <Statistic title="Recherches" value={wishlists.length} prefix={<HeartOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Notifications" value={unreadNotifs} prefix={<BellOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable onClick={() => navigate('/chat')}>
            <Statistic title="Conversations" value={conversations.length} prefix={<MessageOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Dernières annonces publiées" size="small">
            <List
              dataSource={listings.slice(0, 5)}
              renderItem={(item) => (
                <List.Item onClick={() => navigate(`/listings/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    title={item.title}
                    description={<Tag color={item.status === 'ACTIVE' ? 'green' : 'orange'}>{item.status}</Tag>}
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Aucune annonce' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Dernières conversations" size="small">
            <List
              dataSource={conversations.slice(0, 5)}
              renderItem={(item) => (
                <List.Item onClick={() => navigate(`/chat?conversation=${item.id}`)} style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    title={item.listing?.title || 'Conversation'}
                    description={item.messages?.[0]?.content || 'Pas de messages'}
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Aucune conversation' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
