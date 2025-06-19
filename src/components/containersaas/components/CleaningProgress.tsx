import React, { useState } from 'react';
import { Card, Timeline, Form, Input, Button, Space, Typography, Select, Message } from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';

const { Text } = Typography;
const { Option } = Select;

// 进度状态选项
const progressStatusOptions = [
  { value: 'STARTED', label: '开始施工', color: 'blue' },
  { value: 'IN_PROGRESS', label: '施工中', color: 'orange' },
  { value: 'COMPLETED', label: '施工完成', color: 'green' },
  { value: 'PAUSED', label: '暂停施工', color: 'red' }
];

interface ProgressItem {
  id: string;
  status: string;
  remark: string;
  operator: string;
  timestamp: string;
}

interface CleaningProgressProps {
  workOrderId: string;
  onProgressChange: (progress: ProgressItem[]) => void;
}

const CleaningProgress: React.FC<CleaningProgressProps> = ({
  onProgressChange
}) => {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [form] = Form.useForm();

  // 添加进度记录
  const handleAddProgress = async () => {
    try {
      const values = await form.validate();
      const newProgress: ProgressItem = {
        id: Date.now().toString(),
        ...values,
        timestamp: new Date().toISOString()
      };

      setProgress(prev => [...prev, newProgress]);
      onProgressChange([...progress, newProgress]);
      form.resetFields();
      Message.success('进度记录已添加');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除进度记录
  const handleDeleteProgress = (id: string) => {
    setProgress(prev => prev.filter(item => item.id !== id));
    onProgressChange(progress.filter(item => item.id !== id));
    Message.success('进度记录已删除');
  };

  return (
    <Card title="施工进度" className="mb-4">
      <div className="mb-4">
        <Form
          form={form}
          layout="inline"
          style={{ width: '100%' }}
        >
          <Form.Item
            field="status"
            rules={[{ required: true, message: '请选择进度状态' }]}
          >
            <Select placeholder="选择进度状态" style={{ width: 150 }}>
              {progressStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            field="operator"
            rules={[{ required: true, message: '请输入操作人' }]}
          >
            <Input placeholder="操作人" style={{ width: 150 }} />
          </Form.Item>

          <Form.Item
            field="remark"
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <Input placeholder="备注" style={{ width: 300 }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={handleAddProgress}
            >
              添加进度
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Timeline>
        {progress.map(item => {
          const statusOption = progressStatusOptions.find(opt => opt.value === item.status);
          return (
            <Timeline.Item
              key={item.id}
              dotColor={statusOption?.color}
              label={
                <Space>
                  <Text>{new Date(item.timestamp).toLocaleString()}</Text>
                  <Button
                    type="text"
                    status="danger"
                    size="small"
                    icon={<IconDelete />}
                    onClick={() => handleDeleteProgress(item.id)}
                  />
                </Space>
              }
            >
              <div>
                <div className="font-bold">{statusOption?.label}</div>
                <div className="mt-1">
                  <Text type="secondary">操作人：{item.operator}</Text>
                </div>
                <div className="mt-1">
                  <Text type="secondary">备注：{item.remark}</Text>
                </div>
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Card>
  );
};

export default CleaningProgress; 