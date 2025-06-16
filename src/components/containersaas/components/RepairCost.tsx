import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, InputNumber, Space } from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';



export interface CostItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  remark?: string;
}

interface RepairCostProps {
  repairItems: string[];
  value?: CostItem[];
  onChange: (items: CostItem[], total: number) => void;
}

const RepairCost: React.FC<RepairCostProps> = ({
  repairItems,
  value,
  onChange
}) => {
  // 费用项目状态
  const [costItems, setCostItems] = useState<CostItem[]>(value || []);
  const [totalAmount, setTotalAmount] = useState(0);

  // 费用项目模板
  const costTemplates: Record<string, CostItem[]> = {
    'BEAM': [
      { id: 'beam_material', name: '横梁材料费', unit: '个', quantity: 1, unitPrice: 0, amount: 0 },
      { id: 'beam_labor', name: '横梁人工费', unit: '工时', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    'DENT': [
      { id: 'dent_material', name: '凹陷修复材料费', unit: '处', quantity: 1, unitPrice: 0, amount: 0 },
      { id: 'dent_labor', name: '凹陷修复人工费', unit: '工时', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    'HOLE': [
      { id: 'hole_material', name: '破洞修补材料费', unit: '处', quantity: 1, unitPrice: 0, amount: 0 },
      { id: 'hole_labor', name: '破洞修补人工费', unit: '工时', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    'DOOR': [
      { id: 'door_material', name: '箱门修补材料费', unit: '个', quantity: 1, unitPrice: 0, amount: 0 },
      { id: 'door_labor', name: '箱门修补人工费', unit: '工时', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    'LOCK': [
      { id: 'lock_material', name: '门锁材料费', unit: '个', quantity: 1, unitPrice: 0, amount: 0 },
      { id: 'lock_labor', name: '门锁安装人工费', unit: '工时', quantity: 1, unitPrice: 0, amount: 0 }
    ],
    'OTHER': [
      { id: 'other_material', name: '其他材料费', unit: '项', quantity: 1, unitPrice: 0, amount: 0 },
      { id: 'other_labor', name: '其他人工费', unit: '工时', quantity: 1, unitPrice: 0, amount: 0 }
    ]
  };

  // 根据施工项目更新费用项目
  useEffect(() => {
    const newCostItems: CostItem[] = [];
    const processedItems = new Set<string>();

    // 处理常规施工项目
    repairItems.forEach(item => {
      if (costTemplates[item] && !processedItems.has(item)) {
        processedItems.add(item);
        costTemplates[item].forEach(template => {
          newCostItems.push({
            ...template,
            id: `${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });
        });
      }
    });

    setCostItems(newCostItems);
    calculateTotal(newCostItems);
  }, [repairItems]);

  // 计算总金额
  const calculateTotal = (items: CostItem[]) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
    onChange(items, total);
  };

  // 更新费用项
  const updateCostItem = (id: string, field: keyof CostItem, value: any) => {
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

  // 添加自定义费用项
  const addCustomCostItem = () => {
    const newItem: CostItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      unit: '项',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    const newItems = [...costItems, newItem];
    setCostItems(newItems);
    calculateTotal(newItems);
  };

  // 删除费用项
  const deleteCostItem = (id: string) => {
    const newItems = costItems.filter(item => item.id !== id);
    setCostItems(newItems);
    calculateTotal(newItems);
  };

  // 表格列定义
  const columns = [
    {
      title: '费用项目',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CostItem) => (
        <Input
          value={text}
          onChange={value => updateCostItem(record.id, 'name', value)}
          placeholder="请输入费用项目名称"
        />
      )
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      render: (text: string, record: CostItem) => (
        <Input
          value={text}
          onChange={value => updateCostItem(record.id, 'unit', value)}
          placeholder="单位"
        />
      )
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (text: number, record: CostItem) => (
        <InputNumber
          value={text}
          onChange={value => updateCostItem(record.id, 'quantity', value)}
          min={0}
          precision={2}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (text: number, record: CostItem) => (
        <InputNumber
          value={text}
          onChange={value => updateCostItem(record.id, 'unitPrice', value)}
          min={0}
          precision={2}
          prefix="¥"
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (text: number) => (
        <span>¥{text.toFixed(2)}</span>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (_: any, record: CostItem) => (
        <Button
          type="text"
          status="danger"
          icon={<IconDelete />}
          onClick={() => deleteCostItem(record.id)}
        />
      )
    }
  ];

  return (
    <Card
      title="费用信息"
      extra={
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={addCustomCostItem}
        >
          添加费用项
        </Button>
      }
    >
      <Table
        columns={columns}
        data={costItems}
        pagination={false}
        rowKey="id"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={4}>
              <Space style={{ float: 'right' }}>
                <span>合计：</span>
                <span className="text-lg font-bold">¥{totalAmount.toFixed(2)}</span>
              </Space>
            </Table.Summary.Cell>
            <Table.Summary.Cell />
          </Table.Summary.Row>
        )}
      />
    </Card>
  );
};

export default RepairCost; 