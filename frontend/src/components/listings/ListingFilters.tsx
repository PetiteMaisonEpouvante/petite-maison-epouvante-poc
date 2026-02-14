import { Row, Col, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CATEGORY_LABELS, TYPE_LABELS, type ListingCategory, type ListingType } from '../../types';

interface Props {
  category?: ListingCategory;
  type?: ListingType;
  search?: string;
  onCategoryChange: (v: ListingCategory | undefined) => void;
  onTypeChange: (v: ListingType | undefined) => void;
  onSearchChange: (v: string) => void;
}

export default function ListingFilters({
  category,
  type,
  search,
  onCategoryChange,
  onTypeChange,
  onSearchChange,
}: Props) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <Input
          placeholder="Rechercher..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />
      </Col>
      <Col xs={12} sm={8}>
        <Select
          placeholder="Catégorie"
          value={category}
          onChange={onCategoryChange}
          allowClear
          style={{ width: '100%' }}
        >
          {(Object.entries(CATEGORY_LABELS) as [ListingCategory, string][]).map(([value, label]) => (
            <Select.Option key={value} value={value}>{label}</Select.Option>
          ))}
        </Select>
      </Col>
      <Col xs={12} sm={8}>
        <Select
          placeholder="Type"
          value={type}
          onChange={onTypeChange}
          allowClear
          style={{ width: '100%' }}
        >
          {(Object.entries(TYPE_LABELS) as [ListingType, string][]).map(([value, label]) => (
            <Select.Option key={value} value={value}>{label}</Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
}
