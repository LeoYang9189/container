import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Message,
  Typography,
  Checkbox,
  Grid,
  Divider,
  Tabs,
  Modal
} from '@arco-design/web-react';
import {
  IconSave,
  IconRefresh,
  IconLeft,
  IconPrinter,
  IconExclamationCircle
} from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import RepairCost from '../components/RepairCost';
import RepairPhotos from '../components/RepairPhotos';
import RepairProgress from '../components/RepairProgress';
import RepairVerification from '../components/RepairVerification';
import RepairWorkOrderPrint from '../components/RepairWorkOrderPrint';

const { Title } = Typography;
const { Option } = Select;
const { Row, Col } = Grid;

// 施工项目选项
const repairItems = [
  { value: 'BEAM', label: '横梁修理' },
  { value: 'DENT', label: '凹陷修复' },
  { value: 'HOLE', label: '破洞修补' },
  { value: 'DOOR', label: '箱门修补' },
  { value: 'LOCK', label: '门锁修复' },
  { value: 'OTHER', label: '其他' }
];

// 状态选项
const statusOptions = [
  { value: 'DRAFT', label: '草稿' },
  { value: 'PENDING', label: '待施工' },
  { value: 'COMPLETED', label: '施工完成' },
  { value: 'CANCELLED', label: '撤销' }
];

// 模拟数据
const mockData = {
  id: 'RWO000001',
  containerNo: 'CONT123456',
  yard: '上海港洋山码头',
  customer: '上海远洋运输有限公司',
  bookingNo: 'BK123456',
  blNo: 'BL123456',
  previousCargo: '钢材',
  status: 'DRAFT',
  repairItems: ['BEAM', 'DENT'],
  repairRequirements: '需要修复横梁损坏，修复箱体凹陷',
  createTime: new Date().toISOString(),
  creator: '李四'
};

const RepairWorkOrderEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRepairItems, setSelectedRepairItems] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [costItems, setCostItems] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [verification, setVerification] = useState<any>(null);
  const [printVisible, setPrintVisible] = useState(false);
  const isEdit = Boolean(id);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [currentYard, setCurrentYard] = useState('');
  const [selectedYard, setSelectedYard] = useState('');

  // 页面加载时获取数据
  useEffect(() => {
    if (isEdit) {
      fetchData();
    }
  }, [isEdit]);

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      form.setFieldsValue(mockData);
      setLoading(false);
    }, 1000);
  };

  // 返回列表页
  const handleGoBack = () => {
    navigate('/smartainer/repair-management');
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 处理费用变化
  const handleCostChange = (items: any[], total: number) => {
    setTotalAmount(total);
    setCostItems(items);
  };

  // 处理施工项目变化
  const handleRepairItemsChange = (values: string[]) => {
    setSelectedRepairItems(values);
  };

  // 处理照片变化
  const handlePhotosChange = (newPhotos: any[]) => {
    setPhotos(newPhotos);
  };

  // 处理进度变化
  const handleProgressChange = (newProgress: any[]) => {
    setProgress(newProgress);
  };

  // 处理验收信息变化
  const handleVerificationChange = (newVerification: any) => {
    setVerification(newVerification);
  };

  // 处理打印
  const handlePrint = () => {
    setPrintVisible(true);
  };

  // 打印工作单
  const printWorkOrder = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = document.getElementById('print-content');
      if (printContent) {
        printWindow.document.write(`
          <html>
            <head>
              <title>集装箱修理工作单</title>
              <style>
                body { margin: 0; padding: 0; }
                @media print {
                  @page { size: A4; margin: 0; }
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  // 模拟获取集装箱当前堆场
  const getContainerCurrentYard = async (containerNo: string) => {
    // 这里应该调用实际的 API，现在用模拟数据
    return '上海外高桥堆场';
  };

  // 处理保存前的堆场校验
  const handleSaveWithYardCheck = async () => {
    try {
      const containerNo = form.getFieldValue('containerNo');
      const selectedYard = form.getFieldValue('yard');
      
      if (!containerNo || !selectedYard) {
        Message.error('请填写箱号和施工堆场');
        return;
      }

      // 获取集装箱当前堆场
      const currentYard = await getContainerCurrentYard(containerNo);
      setCurrentYard(currentYard);
      setSelectedYard(selectedYard);

      // 如果堆场不一致，显示调拨提示
      if (currentYard !== selectedYard) {
        setTransferModalVisible(true);
      } else {
        // 堆场一致，直接保存
        handleSave();
      }
    } catch (error) {
      Message.error('校验堆场失败');
    }
  };

  // 确认创建调拨指令
  const handleTransferConfirm = () => {
    setTransferModalVisible(false);
    Message.success('已创建调拨指令');
    handleSave();
  };

  // 取消调拨，仅保存工作单
  const handleTransferCancel = () => {
    setTransferModalVisible(false);
    handleSave();
  };

  // 保存工作单
  const handleSave = async () => {
    try {
      const values = await form.validate();
      setLoading(true);
      
      // 模拟保存延迟
      setTimeout(() => {
        setLoading(false);
        Message.success(isEdit ? '更新成功' : '创建成功');
        navigate('/smartainer/repair-management');
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div className="p-6">
      <Card
        title={id ? '编辑修箱工作单' : '新增修箱工作单'}
        extra={
          <Space>
            {id && (
              <Button
                type="primary"
                icon={<IconPrinter />}
                onClick={handlePrint}
              >
                打印工作单
              </Button>
            )}
            <Button onClick={() => navigate('/smartainer/repair-management')}>
              返回
            </Button>
            <Button type="primary" onClick={handleSaveWithYardCheck}>
              保存
            </Button>
          </Space>
        }
      >
        <Tabs defaultActiveTab="basic">
          <Tabs.TabPane key="basic" title="基本信息">
            <Form
              form={form}
              layout="vertical"
              style={{ maxWidth: 800 }}
              scrollToFirstError
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="工作单编号"
                    field="id"
                    rules={[{ required: true, message: '请输入工作单编号' }]}
                  >
                    <Input placeholder="请输入工作单编号" disabled={isEdit} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="箱号"
                    field="containerNo"
                    rules={[{ required: true, message: '请输入箱号' }]}
                  >
                    <Input placeholder="请输入箱号" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="施工堆场"
                    field="yard"
                    rules={[{ required: true, message: '请选择施工堆场' }]}
                  >
                    <Select placeholder="请选择施工堆场">
                      <Option value="上海港洋山码头">上海港洋山码头</Option>
                      <Option value="上海港外高桥码头">上海港外高桥码头</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="委托客户"
                    field="customer"
                    rules={[{ required: true, message: '请选择委托客户' }]}
                  >
                    <Select placeholder="请选择委托客户">
                      <Option value="上海远洋运输有限公司">上海远洋运输有限公司</Option>
                      <Option value="中远海运集装箱运输有限公司">中远海运集装箱运输有限公司</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="订舱号"
                    field="bookingNo"
                    rules={[{ required: true, message: '请输入订舱号' }]}
                  >
                    <Input placeholder="请输入订舱号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="提单号"
                    field="blNo"
                    rules={[{ required: true, message: '请输入提单号' }]}
                  >
                    <Input placeholder="请输入提单号" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="前装货"
                    field="previousCargo"
                    rules={[{ required: true, message: '请输入前装货' }]}
                  >
                    <Input placeholder="请输入前装货" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="状态"
                    field="status"
                    rules={[{ required: true, message: '请选择状态' }]}
                  >
                    <Select placeholder="请选择状态">
                      {statusOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">施工信息</Divider>

              <Form.Item
                label="施工项目"
                field="repairItems"
                rules={[{ required: true, message: '请选择施工项目' }]}
              >
                <Checkbox.Group onChange={handleRepairItemsChange}>
                  <Space direction="vertical" size="large">
                    <Row gutter={[24, 16]}>
                      {repairItems.map(item => (
                        <Col span={8} key={item.value}>
                          <Checkbox value={item.value}>{item.label}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                label="修理要求"
                field="repairRequirements"
                rules={[{ required: true, message: '请输入修理要求' }]}
              >
                <Input.TextArea
                  placeholder="请输入修理要求"
                  style={{ minHeight: 100 }}
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
          </Tabs.TabPane>

          <Tabs.TabPane key="cost" title="费用信息">
            <RepairCost
              repairItems={selectedRepairItems}
              value={costItems}
              onChange={handleCostChange}
            />
          </Tabs.TabPane>

          <Tabs.TabPane key="photos" title="施工照片">
            <RepairPhotos
              value={photos}
              onChange={handlePhotosChange}
            />
          </Tabs.TabPane>

          <Tabs.TabPane key="progress" title="施工进度">
            <RepairProgress
              value={progress}
              onChange={handleProgressChange}
            />
          </Tabs.TabPane>

          <Tabs.TabPane key="verification" title="验收信息">
            <RepairVerification
              value={verification}
              onChange={handleVerificationChange}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 打印预览弹窗 */}
      <Modal
        title="打印预览"
        visible={printVisible}
        onCancel={() => setPrintVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setPrintVisible(false)}>
            取消
          </Button>,
          <Button key="print" type="primary" onClick={printWorkOrder}>
            打印
          </Button>
        ]}
        style={{ width: '1000px', maxWidth: '90vw' }}
      >
        <div id="print-content">
          <RepairWorkOrderPrint
            data={{
              id: form.getFieldValue('id') || '新工作单',
              containerNo: form.getFieldValue('containerNo'),
              yard: form.getFieldValue('yard'),
              customer: form.getFieldValue('customer'),
              bookingNo: form.getFieldValue('bookingNo'),
              blNo: form.getFieldValue('blNo'),
              previousCargo: form.getFieldValue('previousCargo'),
              status: form.getFieldValue('status'),
              repairItems: form.getFieldValue('repairItems'),
              repairRequirements: form.getFieldValue('repairRequirements'),
              totalAmount,
              costItems,
              createTime: form.getFieldValue('createTime') || new Date().toISOString(),
              creator: form.getFieldValue('creator'),
              photos,
              progress,
              verification
            }}
          />
        </div>
      </Modal>

      {/* 调拨提示弹窗 */}
      <Modal
        title={
          <Space>
            <IconExclamationCircle style={{ color: '#FF7D00', fontSize: '20px' }} />
            <span>堆场不一致提示</span>
          </Space>
        }
        visible={transferModalVisible}
        onCancel={handleTransferCancel}
        footer={[
          <Button key="cancel" onClick={handleTransferCancel}>
            仅保存工作单
          </Button>,
          <Button key="confirm" type="primary" onClick={handleTransferConfirm}>
            创建调拨指令并保存
          </Button>
        ]}
      >
        <div className="p-4">
          <p className="mb-4">
            该集装箱当前所在堆场为 <Typography.Text className="font-bold">{currentYard}</Typography.Text>，
            与修箱施工堆场 <Typography.Text className="font-bold">{selectedYard}</Typography.Text> 不符。
          </p>
          <p className="text-gray-500">
            是否创建调拨指令？创建调拨指令后，系统将自动生成集装箱调拨申请。
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default RepairWorkOrderEdit; 