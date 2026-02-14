import { useEffect, useState } from 'react';
import { Typography, List, Button, Form, Input, Select, Space, Tag, Popconfirm, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getWishlists, createWishlist, deleteWishlist } from '../api/wishlists';
import { CATEGORY_LABELS, type ListingCategory, type Wishlist } from '../types';

export default function WishlistPage() {
  const [items, setItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const fetch = () => {
    setLoading(true);
    getWishlists()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const handleAdd = async (values: { title: string; category: ListingCategory }) => {
    try {
      await createWishlist(values);
      message.success('Recherche ajoutée');
      form.resetFields();
      fetch();
    } catch {
      message.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteWishlist(id);
    fetch();
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Typography.Title level={3}>Articles recherchés</Typography.Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline" onFinish={handleAdd}>
          <Form.Item name="title" rules={[{ required: true, message: 'Titre requis' }]}>
            <Input placeholder="Ex: Figurine Predator" />
          </Form.Item>
          <Form.Item name="category" rules={[{ required: true }]}>
            <Select placeholder="Catégorie" style={{ width: 180 }}>
              {(Object.entries(CATEGORY_LABELS) as [ListingCategory, string][]).map(([v, l]) => (
                <Select.Option key={v} value={v}>{l}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Ajouter</Button>
          </Form.Item>
        </Form>
      </Card>

      <List
        loading={loading}
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm key="del" title="Supprimer ?" onConfirm={() => handleDelete(item.id)}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <Space>
              <Typography.Text strong>{item.title}</Typography.Text>
              <Tag>{CATEGORY_LABELS[item.category]}</Tag>
            </Space>
          </List.Item>
        )}
        locale={{ emptyText: 'Aucun article recherché' }}
      />
    </div>
  );
}
