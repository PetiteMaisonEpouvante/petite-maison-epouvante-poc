import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Spin, message } from 'antd';
import { getListingById, updateListing } from '../api/listings';
import ListingForm from '../components/listings/ListingForm';
import type { Listing } from '../types';

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getListingById(id)
      .then(setListing)
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (values: Parameters<typeof updateListing>[1]) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateListing(id, values);
      message.success('Annonce modifiée');
      navigate(`/listings/${id}`);
    } catch {
      message.error('Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!listing) return null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Typography.Title level={3}>Modifier l'annonce</Typography.Title>
      <ListingForm initialValues={listing} onSubmit={handleSubmit} loading={saving} submitLabel="Enregistrer" />
    </div>
  );
}
