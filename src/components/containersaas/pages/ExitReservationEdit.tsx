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
  DatePicker,
  Checkbox,
  Tag,
  Divider,
  Typography
} from '@arco-design/web-react';
import {
  IconSave,
  IconRefresh,
  IconLeft,
  IconPlus,
  IconDelete
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';

const { Row, Col } = Grid;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

// 出场预约表单接口
interface ExitReservationForm {
  reservationNo: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  exitPurpose: string;
  needCleaning: boolean;
  needModification: boolean;
  containerNumbers: string[];
  pickupTime: string;
  remark?: string;
}

const ExitReservationEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [containerNumbers, setContainerNumbers] = useState<string[]>(['']);

  // 是否为编辑模式
  const isEdit = !!id;

  // 模拟客户数据
  const customers = [
    '上海远洋运输有限公司',
    '中远海运集装箱运输有限公司',
    '马士基航运',
    '地中海航运',
    '达飞轮船',
    '长荣海运',
    '阳明海运',
    '现代商船'
  ];

  // 模拟加载数据
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      // 模拟 API 调用
      setTimeout(() => {
        const mockData = {
          reservationNo: `ER${id?.padStart(6, '0')}`,
          customerName: '上海远洋运输有限公司',
          contactPerson: '张三',
          contactPhone: '13812345678',
          exitPurpose: '提箱',
          needCleaning: true,
          needModification: false,
          containerNumbers: ['EXIT000001', 'EXIT000002'],
          pickupTime: '2024-12-25 10:00:00',
          remark: '紧急出场预约'
        };
        
        form.setFieldsValue(mockData);
        setContainerNumbers(mockData.containerNumbers);
        setLoading(false);
      }, 1000);
    } else {
      // 新增模式，生成预约流水号
      const newReservationNo = `ER${String(Date.now()).slice(-6)}`;
      form.setFieldValue('reservationNo', newReservationNo);
    }
  }, [isEdit, id, form]);

  // 添加箱号输入框
  const addContainerInput = () => {
    setContainerNumbers([...containerNumbers, '']);
  };

  // 删除箱号输入框
  const removeContainerInput = (index: number) => {
    if (containerNumbers.length > 1) {
      const newContainers = containerNumbers.filter((_, i) => i !== index);
      setContainerNumbers(newContainers);
      
      // 更新表单值
      const formContainers = form.getFieldValue('containerNumbers') || [];
      const newFormContainers = formContainers.filter((_: string, i: number) => i !== index);
      form.setFieldValue('containerNumbers', newFormContainers);
    }
  };

  // 更新箱号
  const updateContainerNumber = (index: number, value: string) => {
    const newContainers = [...containerNumbers];
    newContainers[index] = value;
    setContainerNumbers(newContainers);
    
    // 更新表单值
    const formContainers = [...newContainers];
    form.setFieldValue('containerNumbers', formContainers.filter(c => c.trim() !== ''));
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      
      // 过滤空的箱号
      const validContainers = containerNumbers.filter(c => c.trim() !== '');
      values.containerNumbers = validContainers;

      console.log('表单数据:', values);

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      Message.success(isEdit ? '出场预约更新成功' : '出场预约创建成功');
      navigate('/exit-reservation');
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setContainerNumbers(['']);
    if (!isEdit) {
      const newReservationNo = `ER${String(Date.now()).slice(-6)}`;
      form.setFieldValue('reservationNo', newReservationNo);
    }
  };

  // 返回列表
  const handleBack = () => {
    navigate('/exit-reservation');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Space>
          <Button icon={<IconLeft />} onClick={handleBack}>
            返回
          </Button>
          <Title heading={4} style={{ margin: 0 }}>
            {isEdit ? '编辑出场预约' : '新增出场预约'}
          </Title>
        </Space>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="预约流水号"
                field="reservationNo"
                rules={[{ required: true, message: '请输入预约流水号' }]}
              >
                <Input 
                  placeholder="预约流水号"
                  readOnly
                  style={{ 
                    backgroundColor: '#f7f8fa',
                    fontFamily: 'monospace'
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="客户名称"
                field="customerName"
                rules={[{ required: true, message: '请选择客户名称' }]}
              >
                <Select
                  placeholder="请选择客户名称"
                  showSearch
                  allowClear
                >
                  {customers.map(customer => (
                    <Option key={customer} value={customer}>
                      {customer}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="联系人"
                field="contactPerson"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="联系电话"
                field="contactPhone"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { 
                    validator: (value, callback) => {
                      if (value && !/^1[3-9]\d{9}$/.test(value)) {
                        callback('请输入正确的手机号码格式');
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="出场目的"
                field="exitPurpose"
                rules={[{ required: true, message: '请选择出场目的' }]}
              >
                <Select placeholder="请选择出场目的">
                  <Option value="提箱">提箱</Option>
                  <Option value="空箱回收">空箱回收</Option>
                  <Option value="修理后提箱">修理后提箱</Option>
                  <Option value="清洗后提箱">清洗后提箱</Option>
                  <Option value="改装后提箱">改装后提箱</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="预约提箱时间"
                field="pickupTime"
                rules={[{ required: true, message: '请选择预约提箱时间' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择预约提箱时间"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">服务要求</Divider>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="是否需要洗箱"
                field="needCleaning"
                triggerPropName="checked"
              >
                <Checkbox>需要洗箱服务</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="是否需要改装"
                field="needModification"
                triggerPropName="checked"
              >
                <Checkbox>需要改装服务</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">箱号信息</Divider>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">箱号列表</span>
              <Button
                type="outline"
                size="small"
                icon={<IconPlus />}
                onClick={addContainerInput}
              >
                添加箱号
              </Button>
            </div>

            <div className="space-y-3">
              {containerNumbers.map((container, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`请输入第${index + 1}个箱号`}
                      value={container}
                      onChange={(value) => updateContainerNumber(index, value)}
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                  {containerNumbers.length > 1 && (
                    <Button
                      type="text"
                      status="danger"
                      icon={<IconDelete />}
                      onClick={() => removeContainerInput(index)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {containerNumbers.filter(c => c.trim() !== '').length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium mb-2">已添加的箱号：</div>
                <div className="flex flex-wrap gap-2">
                  {containerNumbers
                    .filter(c => c.trim() !== '')
                    .map((container, index) => (
                      <Tag key={index} color="blue" style={{ fontFamily: 'monospace' }}>
                        {container}
                      </Tag>
                    ))}
                </div>
              </div>
            )}
          </div>

          <Form.Item
            label="备注"
            field="remark"
          >
            <TextArea
              placeholder="请输入备注信息"
              rows={4}
              maxLength={500}
              showWordLimit
            />
          </Form.Item>

          <Divider />

          <div className="flex justify-end space-x-4">
            <Button onClick={handleReset} icon={<IconRefresh />}>
              重置
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              icon={<IconSave />}
            >
              {isEdit ? '更新' : '保存'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ExitReservationEdit; 