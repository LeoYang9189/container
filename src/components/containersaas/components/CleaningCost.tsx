import React, { useState, useEffect } from 'react';
import { Card, Table, InputNumber, Button, Space, Typography, Divider, Input } from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

// 费用项目类型
interface CostItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// 预设费用项目
const defaultCostItems: CostItem[] = [
  { id: '1', name: '普通清洗', unit: '次', quantity: 1, unitPrice: 200, amount: 200 },
  { id: '2', name: '化学清洗', unit: '次', quantity: 1, unitPrice: 500, amount: 500 },
  { id: '3', name: '烘干', unit: '小时', quantity: 2, unitPrice: 100, amount: 200 },
  { id: '4', name: '气密性测试', unit: '次', quantity: 1, unitPrice: 300, amount: 300 }
];

interface CleaningCostProps {
  workOrderId: string;
  cleaningItems: string[];
  onCostChange: (totalAmount: number, costItems: CostItem[]) => void;
}

const CleaningCost: React.FC<CleaningCostProps> = ({
  workOrderId,
  cleaningItems,
  onCostChange
}) => {
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // 根据施工项目初始化费用项目
  useEffect(() => {
    const items = defaultCostItems.filter(item => 
      cleaningItems.includes(item.name === '普通清洗' ? 'NORMAL' :
        item.name === '化学清洗' ? 'CHEMICAL' :
        item.name === '烘干' ? 'DRYING' :
        item.name === '气密性测试' ? 'AIR_TIGHTNESS' : '')
    );
    setCostItems(items);
    calculateTotal(items);
  }, [cleaningItems]);

  // 计算总金额
  const calculateTotal = (items: CostItem[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    onCostChange(total, items);
  };

  // 添加费用项目
  const handleAddItem = () => {
    const newItem: CostItem = {
      id: Date.now().toString(),
      name: '',
      unit: '次',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    const newItems = [...costItems, newItem];
    setCostItems(newItems);
    calculateTotal(newItems);
  };

  // 删除费用项目
  const handleDeleteItem = (id: string) => {
    const newItems = costItems.filter(item => item.id !== id);
    setCostItems(newItems);
    calculateTotal(newItems);
  };

  // 更新费用项目
  const handleItemChange = (id: string, field: keyof CostItem, value: number | string) => {
    const newItems = costItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    setCostItems(newItems);
    calculateTotal(newItems);
  };

  // 表格列定义
  const columns = [
    {
      title: '费用项目',
      dataIndex: 'name',
      width: 200,
      render: (value: string, record: CostItem) => (
        <Input
          value={value}
          onChange={(value: string) => handleItemChange(record.id, 'name', value)}
          placeholder="请输入费用项目"
        />
      )
    },
    {
      title: '单位',
      dataIndex: 'unit',
      width: 100,
      render: (value: string, record: CostItem) => (
        <Input
          value={value}
          onChange={(value: string) => handleItemChange(record.id, 'unit', value)}
          placeholder="单位"
        />
      )
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 120,
      render: (value: number, record: CostItem) => (
        <InputNumber
          value={value}
          onChange={(value) => handleItemChange(record.id, 'quantity', value || 0)}
          min={0}
          precision={0}
        />
      )
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 120,
      render: (value: number, record: CostItem) => (
        <InputNumber
          value={value}
          onChange={(value) => handleItemChange(record.id, 'unitPrice', value || 0)}
          min={0}
          precision={2}
          prefix="¥"
        />
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (value: number) => (
        <Text>¥{value.toFixed(2)}</Text>
      )
    },
    {
      title: '操作',
      width: 80,
      render: (_: any, record: CostItem) => (
        <Button
          type="text"
          status="danger"
          icon={<IconDelete />}
          onClick={() => handleDeleteItem(record.id)}
        />
      )
    }
  ];

  return (
    <Card title="费用计算" className="mb-4">
      <div className="mb-4">
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={handleAddItem}
          >
            添加费用项目
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        data={costItems}
        border={false}
        pagination={false}
      />

      <Divider />

      <div className="flex justify-end">
        <Space>
          <Text>合计金额：</Text>
          <Title heading={4} type="primary">
            ¥{totalAmount.toFixed(2)}
          </Title>
        </Space>
      </div>
    </Card>
  );
};

export default CleaningCost; 