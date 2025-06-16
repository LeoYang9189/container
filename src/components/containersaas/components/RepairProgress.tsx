import React, { useState } from 'react';
import { Card, Timeline, Button, Modal, Form, Input, Select, Message, Space } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { format } from 'date-fns';

const FormItem = Form.Item;

export interface ProgressItem {
  id: string;
  status: string;
  remark: string;
  operator: string;
  updateTime: string;
}

interface RepairProgressProps {
  value?: ProgressItem[];
  onChange: (progress: ProgressItem[]) => void;
}

const RepairProgress: React.FC<RepairProgressProps> = ({
  value,
  onChange
}) => {
  const [progress, setProgress] = useState<ProgressItem[]>(value || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 状态选项
  const statusOptions = [
    { label: '待施工', value: 'PENDING' },
    { label: '施工中', value: 'IN_PROGRESS' },
    { label: '施工完成', value: 'COMPLETED' },
    { label: '验收通过', value: 'VERIFIED' },
    { label: '验收不通过', value: 'REJECTED' }
  ];

  // 添加进度记录
  const handleAddProgress = async () => {
    try {
      const values = await form.validate();
      const newProgress: ProgressItem = {
        id: Date.now().toString(),
        ...values,
        updateTime: new Date().toISOString()
      };

      const newProgressList = [...progress, newProgress];
      setProgress(newProgressList);
      onChange(newProgressList);
      setModalVisible(false);
      form.resetFields();
      Message.success('添加进度记录成功');
    } catch (error) {
      // 表单验证失败
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': 'gray',
      'IN_PROGRESS': 'blue',
      'COMPLETED': 'green',
      'VERIFIED': 'green',
      'REJECTED': 'red'
    };
    return colorMap[status] || 'gray';
  };

  // 获取状态标签文本
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待施工',
      'IN_PROGRESS': '施工中',
      'COMPLETED': '施工完成',
      'VERIFIED': '验收通过',
      'REJECTED': '验收不通过'
    };
    return statusMap[status] || status;
  };

  return (
    <Card
      title="施工进度"
      extra={
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={() => setModalVisible(true)}
        >
          添加进度
        </Button>
      }
    >
      {progress.length > 0 ? (
        <Timeline>
          {progress.map(item => (
            <Timeline.Item
              key={item.id}
              dotColor={getStatusColor(item.status)}
            >
              <div className="mb-2">
                <Space>
                  <span className="font-bold">{getStatusLabel(item.status)}</span>
                  <span className="text-gray-500">
                    {format(new Date(item.updateTime), 'yyyy-MM-dd HH:mm:ss')}
                  </span>
                </Space>
              </div>
              <div className="text-gray-600">
                <div>操作人：{item.operator}</div>
                {item.remark && <div className="mt-1">备注：{item.remark}</div>}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <div className="text-center text-gray-500 py-8">
          暂无进度记录，点击右上角按钮添加
        </div>
      )}

      <Modal
        title="添加进度记录"
        visible={modalVisible}
        onOk={handleAddProgress}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        autoFocus={false}
        focusLock={true}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <FormItem
            label="状态"
            field="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={statusOptions}
            />
          </FormItem>
          <FormItem
            label="操作人"
            field="operator"
            rules={[{ required: true, message: '请输入操作人' }]}
          >
            <Input placeholder="请输入操作人" />
          </FormItem>
          <FormItem
            label="备注"
            field="remark"
          >
            <Input.TextArea
              placeholder="请输入备注信息"
              maxLength={200}
              showWordLimit
            />
          </FormItem>
        </Form>
      </Modal>
    </Card>
  );
};

export default RepairProgress; 