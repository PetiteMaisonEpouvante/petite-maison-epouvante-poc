import { useEffect, useState, useCallback } from 'react';
import { Typography, Row, Col, Pagination, Spin } from 'antd';
import { listListings } from '../api/listings';
import ListingCard from '../components/listings/ListingCard';
import ListingFilters from '../components/listings/ListingFilters';
import type { Listing, ListingCategory, ListingType } from '../types';

export default function ListingBrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ListingCategory | undefined>();
  const [type, setType] = useState<ListingType | undefined>();
  const [search, setSearch] = useState('');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listListings({ category, type, search: search || undefined, page, limit: 12 });
      setListings(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [category, type, search, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    setPage(1);
  }, [category, type, search]);

  return (
    <div>
      <Typography.Title level={3}>Annonces</Typography.Title>

      <ListingFilters
        category={category}
        type={type}
        search={search}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {listings.map((listing) => (
              <Col xs={24} sm={12} md={8} lg={6} key={listing.id}>
                <ListingCard listing={listing} />
              </Col>
            ))}
            {listings.length === 0 && (
              <Col span={24}>
                <Typography.Text type="secondary">Aucune annonce trouvée.</Typography.Text>
              </Col>
            )}
          </Row>
          {total > 12 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination current={page} total={total} pageSize={12} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
