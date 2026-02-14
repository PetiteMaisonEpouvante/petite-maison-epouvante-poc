import { Form, Input, Select, Button, Space } from 'antd';
import { CATEGORY_LABELS, CONDITION_LABELS, TYPE_LABELS } from '../../types';
import type { ListingCategory, ItemCondition, ListingType, Listing } from '../../types';

interface Props {
  initialValues?: Partial<Listing>;
  onSubmit: (values: {
    title: string;
    description: string;
    category: ListingCategory;
    condition: ItemCondition;
    type: ListingType;
    images: string[];
  }) => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function ListingForm({ initialValues, onSubmit, loading, submitLabel = 'Publier' }: Props) {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, unknown>) => {
    const images = (values.images as string || '')
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean);

    onSubmit({
      title: values.title as string,
      description: values.description as string,
      category: values.category as ListingCategory,
      condition: values.condition as ItemCondition,
      type: values.type as ListingType,
      images,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        images: initialValues?.images?.join('\n') || '',
      }}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="title" label="Titre" rules={[{ required: true, message: 'Titre requis' }]}>
        <Input placeholder="Ex: Figurine Alien Xenomorph" />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description requise' }]}>
        <Input.TextArea rows={4} placeholder="Décrivez votre article..." />
      </Form.Item>

      <Space style={{ width: '100%' }} size="middle">
        <Form.Item name="category" label="Catégorie" rules={[{ required: true }]} style={{ minWidth: 180 }}>
          <Select placeholder="Catégorie">
            {(Object.entries(CATEGORY_LABELS) as [ListingCategory, string][]).map(([v, l]) => (
              <Select.Option key={v} value={v}>{l}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="condition" label="État" rules={[{ required: true }]} style={{ minWidth: 150 }}>
          <Select placeholder="État">
            {(Object.entries(CONDITION_LABELS) as [ItemCondition, string][]).map(([v, l]) => (
              <Select.Option key={v} value={v}>{l}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ minWidth: 140 }}>
          <Select placeholder="Type">
            {(Object.entries(TYPE_LABELS) as [ListingType, string][]).map(([v, l]) => (
              <Select.Option key={v} value={v}>{l}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Space>

      <Form.Item name="images" label="Images (URLs, une par ligne)">
        <Input.TextArea rows={3} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} size="large">
          {submitLabel}
        </Button>
      </Form.Item>
    </Form>
  );
}
