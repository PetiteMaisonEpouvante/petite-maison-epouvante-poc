import { useEffect, useState } from 'react';
import { Typography, Row, Col, Button, Spin } from 'antd';
import { ShopOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { listListings } from '../api/listings';
import ListingCard from '../components/listings/ListingCard';
import type { Listing } from '../types';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    listListings({ limit: 8 })
      .then((data) => setListings(data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Typography.Title level={2}>
          La Petite Maison de l'Epouvante
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
          Espace communautaire de troc et d'echange entre passionnes d'horreur, fantastique et heroic fantasy.
        </Typography.Paragraph>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" size="large" icon={<ShopOutlined />} onClick={() => navigate('/listings')}>
            Parcourir les annonces
          </Button>
          {isAuthenticated && (
            <Button size="large" icon={<PlusOutlined />} onClick={() => navigate('/listings/new')} style={{ marginLeft: 12 }}>
              Publier une annonce
            </Button>
          )}
        </div>
      </div>

      <Typography.Title level={4}>Dernières annonces</Typography.Title>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
      ) : (
        <Row gutter={[16, 16]}>
          {listings.map((listing) => (
            <Col xs={24} sm={12} md={8} lg={6} key={listing.id}>
              <ListingCard listing={listing} />
            </Col>
          ))}
          {listings.length === 0 && (
            <Col span={24}>
              <Typography.Text type="secondary">Aucune annonce pour le moment.</Typography.Text>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
}
