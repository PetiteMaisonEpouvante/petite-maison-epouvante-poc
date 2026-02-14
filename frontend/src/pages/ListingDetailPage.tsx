import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Tag, Button, Space, Spin, Descriptions, Image, Avatar, message } from 'antd';
import { SwapOutlined, GiftOutlined, MessageOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import { getListingById } from '../api/listings';
import { createConversation } from '../api/conversations';
import { useUser } from '../context/UserContext';
import ReportButton from '../components/moderation/ReportButton';
import { CATEGORY_LABELS, CONDITION_LABELS } from '../types';
import type { Listing } from '../types';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { dbUser } = useUser();

  useEffect(() => {
    if (!id) return;
    getListingById(id)
      .then(setListing)
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleContact = async () => {
    if (!listing) return;
    try {
      const conv = await createConversation(listing.id);
      navigate(`/chat?conversation=${conv.id}`);
    } catch {
      message.error('Impossible de démarrer la conversation');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  if (!listing) return null;

  const isOwner = dbUser?.id === listing.userId;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} type="text" style={{ marginBottom: 16 }}>
        Retour
      </Button>

      {listing.images.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Image.PreviewGroup>
            <Space wrap>
              {listing.images.map((img, i) => (
                <Image key={i} src={img} width={200} height={200} style={{ objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </Space>
          </Image.PreviewGroup>
        </div>
      )}

      <Typography.Title level={3}>{listing.title}</Typography.Title>

      <Space style={{ marginBottom: 16 }}>
        <Tag color={listing.type === 'TRADE' ? 'blue' : 'green'} icon={listing.type === 'TRADE' ? <SwapOutlined /> : <GiftOutlined />}>
          {listing.type === 'TRADE' ? 'Échange' : 'Don'}
        </Tag>
        <Tag>{CATEGORY_LABELS[listing.category]}</Tag>
        <Tag>{CONDITION_LABELS[listing.condition]}</Tag>
      </Space>

      <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Description">
          <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {listing.description}
          </Typography.Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Publié par">
          <Space>
            <Avatar size="small" src={listing.user?.avatar} icon={<UserOutlined />} />
            {listing.user?.nickname || 'Anonyme'}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
        </Descriptions.Item>
      </Descriptions>

      <Space>
        {isAuthenticated && !isOwner && (
          <Button type="primary" icon={<MessageOutlined />} onClick={handleContact}>
            Contacter
          </Button>
        )}
        {isOwner && (
          <Button onClick={() => navigate(`/listings/${listing.id}/edit`)}>
            Modifier
          </Button>
        )}
        {isAuthenticated && !isOwner && (
          <ReportButton targetType="LISTING" listingId={listing.id} />
        )}
      </Space>
    </div>
  );
}
