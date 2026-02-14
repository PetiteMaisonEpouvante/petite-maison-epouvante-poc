import { useEffect, useState } from 'react';
import { Typography, Card, Checkbox, Button, Avatar, Descriptions, message, Spin } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import { useUser } from '../context/UserContext';
import { getInterests, setInterests } from '../api/users';
import { CATEGORY_LABELS, type ListingCategory } from '../types';

export default function SettingsPage() {
  const { dbUser, loading: userLoading } = useUser();
  const [selected, setSelected] = useState<ListingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getInterests()
      .then((interests) => setSelected(interests.map((i) => i.category)))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setInterests(selected);
      message.success('Préférences enregistrées');
    } catch {
      message.error('Erreur');
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || loading) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  }

  const categories = Object.entries(CATEGORY_LABELS) as [ListingCategory, string][];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Typography.Title level={3}>Paramètres</Typography.Title>

      <Card title="Profil" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <Avatar size={64} src={dbUser?.avatar} icon={<UserOutlined />} />
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>{dbUser?.nickname || 'Utilisateur'}</Typography.Title>
            <Typography.Text type="secondary">{dbUser?.email}</Typography.Text>
          </div>
        </div>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Rôle">{dbUser?.role}</Descriptions.Item>
          <Descriptions.Item label="Membre depuis">
            {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('fr-FR') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Centres d'intérêt (notifications)">
        <Typography.Paragraph type="secondary">
          Sélectionnez les catégories qui vous intéressent. Vous recevrez une notification lorsqu'un nouvel article correspondant sera publié.
        </Typography.Paragraph>
        <Checkbox.Group
          value={selected}
          onChange={(v) => setSelected(v as ListingCategory[])}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {categories.map(([value, label]) => (
            <Checkbox key={value} value={value}>{label}</Checkbox>
          ))}
        </Checkbox.Group>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saving}
          style={{ marginTop: 16 }}
        >
          Enregistrer
        </Button>
      </Card>
    </div>
  );
}
