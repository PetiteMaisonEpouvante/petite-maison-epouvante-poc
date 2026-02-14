import { useEffect, useState } from 'react';
import { Typography, Tabs, Table, Tag, Button, Space, Select, Popconfirm, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getReports, reviewReport, updateListingStatus, getUsers, updateUserRole } from '../api/admin';
import { REPORT_REASON_LABELS } from '../types';
import type { Report, User, Role, ListingStatus, ReportStatus } from '../types';

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchReports = () => {
    setLoadingReports(true);
    getReports()
      .then((data) => setReports(data.items))
      .finally(() => setLoadingReports(false));
  };

  const fetchUsers = () => {
    setLoadingUsers(true);
    getUsers()
      .then(setUsers)
      .finally(() => setLoadingUsers(false));
  };

  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  const handleReviewReport = async (id: string, status: ReportStatus) => {
    await reviewReport(id, status);
    message.success('Signalement traité');
    fetchReports();
  };

  const handleListingStatus = async (id: string, status: ListingStatus) => {
    await updateListingStatus(id, status);
    message.success('Statut modifié');
    fetchReports();
  };

  const handleRoleChange = async (userId: string, role: Role) => {
    await updateUserRole(userId, role);
    message.success('Rôle modifié');
    fetchUsers();
  };

  const reportColumns = [
    {
      title: 'Type',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (t: string) => <Tag>{t}</Tag>,
    },
    {
      title: 'Raison',
      dataIndex: 'reason',
      key: 'reason',
      render: (r: keyof typeof REPORT_REASON_LABELS) => REPORT_REASON_LABELS[r],
    },
    { title: 'Détails', dataIndex: 'details', key: 'details' },
    {
      title: 'Signalé par',
      key: 'reporter',
      render: (_: unknown, r: Report) => r.reporter?.nickname || r.reporter?.email,
    },
    {
      title: 'Cible',
      key: 'target',
      render: (_: unknown, r: Report) => r.listing?.title || r.message?.content?.substring(0, 50) || '-',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s === 'PENDING' ? 'orange' : s === 'REVIEWED' ? 'green' : 'default'}>{s}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Report) => (
        <Space>
          {record.status === 'PENDING' && (
            <>
              <Button size="small" icon={<CheckOutlined />} onClick={() => handleReviewReport(record.id, 'REVIEWED')}>
                Traiter
              </Button>
              <Button size="small" icon={<CloseOutlined />} onClick={() => handleReviewReport(record.id, 'DISMISSED')}>
                Rejeter
              </Button>
              {record.listingId && (
                <Popconfirm title="Suspendre l'annonce ?" onConfirm={() => handleListingStatus(record.listingId!, 'SUSPENDED')}>
                  <Button size="small" danger>Suspendre annonce</Button>
                </Popconfirm>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  const userColumns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Pseudo', dataIndex: 'nickname', key: 'nickname' },
    {
      title: 'Rôle',
      key: 'role',
      render: (_: unknown, record: User) => (
        <Select
          value={record.role}
          onChange={(role) => handleRoleChange(record.id, role)}
          style={{ width: 140 }}
        >
          <Select.Option value="USER">Utilisateur</Select.Option>
          <Select.Option value="MODERATOR">Modérateur</Select.Option>
          <Select.Option value="ADMIN">Admin</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Inscrit le',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d: string) => new Date(d).toLocaleDateString('fr-FR'),
    },
  ];

  const tabItems = [
    {
      key: 'reports',
      label: `Signalements (${reports.filter((r) => r.status === 'PENDING').length})`,
      children: <Table columns={reportColumns} dataSource={reports} rowKey="id" loading={loadingReports} />,
    },
    {
      key: 'users',
      label: `Utilisateurs (${users.length})`,
      children: <Table columns={userColumns} dataSource={users} rowKey="id" loading={loadingUsers} />,
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Modération</Typography.Title>
      <Tabs items={tabItems} />
    </div>
  );
}
