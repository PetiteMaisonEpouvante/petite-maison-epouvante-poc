import { useState } from 'react';
import { Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/listings';
import ListingForm from '../components/listings/ListingForm';

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: Parameters<typeof createListing>[0]) => {
    setLoading(true);
    try {
      const listing = await createListing(values);
      message.success('Annonce publiée !');
      navigate(`/listings/${listing.id}`);
    } catch {
      message.error('Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Typography.Title level={3}>Publier une annonce</Typography.Title>
      <ListingForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
