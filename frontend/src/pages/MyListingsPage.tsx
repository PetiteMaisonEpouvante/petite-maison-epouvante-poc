import { useEffect, useState } from 'react';
import { Typography, Table, Tag, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getMyListings, deleteListing } from '../api/listings';
import { CATEGORY_LABELS, CONDITION_LABELS } from '../types';
import type { Listing } from '../types';

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = () => {
    setLoading(true);
    getMyListings()
      .then(setListings)
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteListing(id);
      message.success('Annonce supprimée');
      fetch();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: 'green',
    PENDING: 'orange',
    SUSPENDED: 'red',
    REJECTED: 'default',
  };

  const columns = [
    { title: 'Titre', dataIndex: 'title', key: 'title' },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (cat: keyof typeof CATEGORY_LABELS) => CATEGORY_LABELS[cat],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t: string) => <Tag color={t === 'TRADE' ? 'blue' : 'green'}>{t === 'TRADE' ? 'Échange' : 'Don'}</Tag>,
    },
    {
      title: 'État',
      dataIndex: 'condition',
      key: 'condition',
      render: (c: keyof typeof CONDITION_LABELS) => CONDITION_LABELS[c],
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Listing) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/listings/${record.id}`)} />
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/listings/${record.id}/edit`)} />
          <Popconfirm title="Supprimer cette annonce ?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Mes annonces</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/listings/new')}>
          Nouvelle annonce
        </Button>
      </div>
      <Table columns={columns} dataSource={listings} rowKey="id" loading={loading} />
    </div>
  );
}
