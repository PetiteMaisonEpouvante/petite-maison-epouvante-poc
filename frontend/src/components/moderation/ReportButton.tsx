import { useState } from 'react';
import { Button, Modal, Form, Select, Input, message } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { createReport } from '../../api/reports';
import { REPORT_REASON_LABELS, type ReportReason, type ReportTargetType } from '../../types';

interface Props {
  targetType: ReportTargetType;
  listingId?: string;
  messageId?: string;
}

export default function ReportButton({ targetType, listingId, messageId }: Props) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createReport({
        reason: values.reason,
        details: values.details,
        targetType,
        listingId,
        messageId,
      });
      message.success('Signalement envoyé');
      setOpen(false);
      form.resetFields();
    } catch {
      // validation error or API error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="text"
        danger
        icon={<WarningOutlined />}
        onClick={() => setOpen(true)}
        size="small"
      >
        Signaler
      </Button>
      <Modal
        title="Signaler un contenu"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Envoyer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="reason" label="Raison" rules={[{ required: true, message: 'Choisissez une raison' }]}>
            <Select placeholder="Sélectionnez une raison">
              {(Object.entries(REPORT_REASON_LABELS) as [ReportReason, string][]).map(([value, label]) => (
                <Select.Option key={value} value={value}>{label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="details" label="Détails (optionnel)">
            <Input.TextArea rows={3} placeholder="Décrivez le problème..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
