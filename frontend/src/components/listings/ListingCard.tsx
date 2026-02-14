import { Card, Tag, Avatar, Typography } from 'antd';
import { SwapOutlined, GiftOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, CONDITION_LABELS, type Listing } from '../../types';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const navigate = useNavigate();

  const typeColor = listing.type === 'TRADE' ? 'blue' : 'green';
  const typeIcon = listing.type === 'TRADE' ? <SwapOutlined /> : <GiftOutlined />;
  const typeLabel = listing.type === 'TRADE' ? 'Échange' : 'Don';

  return (
    <Card
      hoverable
      onClick={() => navigate(`/listings/${listing.id}`)}
      cover={
        listing.images.length > 0 ? (
          <img
            alt={listing.title}
            src={listing.images[0]}
            style={{ height: 180, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              height: 180,
              background: '#1f1f1f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: 40,
            }}
          >
            {typeIcon}
          </div>
        )
      }
      styles={{ body: { padding: 16 } }}
    >
      <Card.Meta
        title={
          <Typography.Text ellipsis style={{ maxWidth: '100%' }}>
            {listing.title}
          </Typography.Text>
        }
        description={
          <>
            <div style={{ marginBottom: 8 }}>
              <Tag color={typeColor} icon={typeIcon}>{typeLabel}</Tag>
              <Tag>{CATEGORY_LABELS[listing.category]}</Tag>
            </div>
            <Tag color="default">{CONDITION_LABELS[listing.condition]}</Tag>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Avatar size="small" src={listing.user?.avatar} icon={<UserOutlined />} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {listing.user?.nickname || 'Anonyme'}
              </Typography.Text>
            </div>
          </>
        }
      />
    </Card>
  );
}
