import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Message,
  Grid,
  Divider,
  Tag
} from '@arco-design/web-react';
import {
  IconSave,
  IconRefresh,
  IconPlus,
  IconDelete
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Row, Col } = Grid;
const { Option } = Select;
const { TextArea } = Input;

// 调拨指令接口
interface TransferOrderForm {
  transferOrderNo: string;
  containerNumbers: string[];
  fromYard: string;
  toYard: string;
  transferPurpose: string;
  remark?: string;
}

const TransferOrderEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [containerNumbers, setContainerNumbers] = useState<string[]>(['']);
  const isEdit = Boolean(id);

  // 模拟数据
  const mockData = {
    transferOrderNo: 'TO000001',
    containerNumbers: ['CONT000001', 'CONT000002', 'CONT000003'],
    fromYard: '上海港洋山码头',
    toYard: '上海港外高桥码头',
    transferPurpose: '修箱需要',
    remark: '紧急调拨，请优先处理'
  };

  // 页面加载时获取数据
  useEffect(() => {
    if (isEdit) {
      fetchData();
    } else {
      // 新增时生成调拨单号
      const newTransferOrderNo = `TO${Date.now().toString().slice(-6)}`;
      form.setFieldValue('transferOrderNo', newTransferOrderNo);
    }
  }, [isEdit, form]);

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      form.setFieldsValue(mockData);
      setContainerNumbers(mockData.containerNumbers);
      setLoading(false);
    }, 1000);
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    if (!isEdit) {
      const newTransferOrderNo = `TO${Date.now().toString().slice(-6)}`;
      form.setFieldValue('transferOrderNo', newTransferOrderNo);
    }
    setContainerNumbers(['']);
  };

  // 保存调拨指令
  const handleSave = async () => {
    try {
      const values = await form.validate();
      
      // 过滤空的箱号
      const validContainerNumbers = containerNumbers.filter(num => num.trim() !== '');
      if (validContainerNumbers.length === 0) {
        Message.error('请至少输入一个箱号');
        return;
      }

      if (values.fromYard === values.toYard) {
        Message.error('调出堆场和调入堆场不能相同');
        return;
      }

      setLoading(true);
      
      const formData = {
        ...values,
        containerNumbers: validContainerNumbers
      };

      // 模拟保存延迟
      setTimeout(() => {
        setLoading(false);
        Message.success(isEdit ? '更新成功' : '创建成功');
        navigate('/smartainer/transfer-orders');
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 添加箱号输入框
  const handleAddContainer = () => {
    setContainerNumbers([...containerNumbers, '']);
  };

  // 删除箱号输入框
  const handleRemoveContainer = (index: number) => {
    if (containerNumbers.length > 1) {
      const newContainerNumbers = containerNumbers.filter((_, i) => i !== index);
      setContainerNumbers(newContainerNumbers);
    }
  };

  // 更新箱号
  const handleContainerChange = (index: number, value: string) => {
    const newContainerNumbers = [...containerNumbers];
    newContainerNumbers[index] = value;
    setContainerNumbers(newContainerNumbers);
  };

  // 渲染箱号输入组件
  const renderContainerInputs = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-medium">箱号</label>
          <Button
            type="outline"
            size="small"
            icon={<IconPlus />}
            onClick={handleAddContainer}
          >
            添加箱号
          </Button>
        </div>
        
        <div className="space-y-2">
          {containerNumbers.map((containerNumber, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={containerNumber}
                onChange={(value) => handleContainerChange(index, value)}
                placeholder={`请输入第${index + 1}个箱号`}
                style={{ fontFamily: 'monospace' }}
              />
              {containerNumbers.length > 1 && (
                <Button
                  type="text"
                  size="small"
                  status="danger"
                  icon={<IconDelete />}
                  onClick={() => handleRemoveContainer(index)}
                />
              )}
              {index === 0 && containerNumbers.length === 1 && (
                <span className="text-red-500 text-sm">*</span>
              )}
            </div>
          ))}
        </div>
        
        {containerNumbers.length > 1 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Tag color="blue" size="small">
              共 {containerNumbers.filter(num => num.trim() !== '').length} 个箱号
            </Tag>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <Card
        title={id ? '编辑调拨指令' : '新增调拨指令'}
        extra={
          <Space>
            <Button onClick={() => navigate('/smartainer/transfer-orders')}>
              返回
            </Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 800 }}
          scrollToFirstError
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="调拨单号"
                field="transferOrderNo"
                rules={[{ required: true, message: '请输入调拨单号' }]}
              >
                <Input 
                  placeholder="请输入调拨单号" 
                  disabled={isEdit}
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="调拨目的"
                field="transferPurpose"
                rules={[{ required: true, message: '请选择调拨目的' }]}
              >
                <Select placeholder="请选择调拨目的">
                  <Option value="修箱需要">修箱需要</Option>
                  <Option value="洗箱需要">洗箱需要</Option>
                  <Option value="客户指定">客户指定</Option>
                  <Option value="堆场整理">堆场整理</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="调出堆场"
                field="fromYard"
                rules={[{ required: true, message: '请选择调出堆场' }]}
              >
                <Select placeholder="请选择调出堆场">
                  <Option value="上海港洋山码头">上海港洋山码头</Option>
                  <Option value="上海港外高桥码头">上海港外高桥码头</Option>
                  <Option value="宁波舟山港">宁波舟山港</Option>
                  <Option value="深圳港">深圳港</Option>
                  <Option value="青岛港">青岛港</Option>
                  <Option value="天津港">天津港</Option>
                  <Option value="大连港">大连港</Option>
                  <Option value="厦门港">厦门港</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="调入堆场"
                field="toYard"
                rules={[{ required: true, message: '请选择调入堆场' }]}
              >
                <Select placeholder="请选择调入堆场">
                  <Option value="上海港洋山码头">上海港洋山码头</Option>
                  <Option value="上海港外高桥码头">上海港外高桥码头</Option>
                  <Option value="宁波舟山港">宁波舟山港</Option>
                  <Option value="深圳港">深圳港</Option>
                  <Option value="青岛港">青岛港</Option>
                  <Option value="天津港">天津港</Option>
                  <Option value="大连港">大连港</Option>
                  <Option value="厦门港">厦门港</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">箱号信息</Divider>

          <div className="mb-6">
            {renderContainerInputs()}
          </div>

          <Form.Item
            label="备注"
            field="remark"
          >
            <TextArea
              placeholder="请输入备注信息"
              style={{ minHeight: 100 }}
              maxLength={500}
              showWordLimit
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                icon={<IconRefresh />}
                onClick={handleReset}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<IconSave />}
                onClick={handleSave}
                loading={loading}
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TransferOrderEdit; 