import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Tag,
  Form,
  Input,
  Select,
  DatePicker,
  Message,
  Typography,
  Steps,
  Space,
  Descriptions,
  Upload,
  Modal,
  Image
} from '@arco-design/web-react';
import {
  IconLeft,
  IconSave,
  IconRefresh,
  IconArchive,
  IconCheck,
  IconPlus,
  IconDelete,
  IconEye
} from '@arco-design/web-react/icon';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AddDynamicPage.css';

const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;

// 集装箱信息接口
interface ContainerInfo {
  containerNo: string;
  containerType: string;
  status: string;
  location: string;
}

// 动态代码选项
const dynamicCodeOptions = [
  { value: 'GATE_IN', label: 'GATE_IN - 进场' },
  { value: 'GATE_OUT', label: 'GATE_OUT - 出场' },
  { value: 'LOAD', label: 'LOAD - 装船' },
  { value: 'DISCHARGE', label: 'DISCHARGE - 卸船' },
  { value: 'PICKUP', label: 'PICKUP - 提箱' },
  { value: 'RETURN', label: 'RETURN - 还箱' },
  { value: 'EMPTY_RETURN', label: 'EMPTY_RETURN - 还空箱' },
  { value: 'REPAIR_IN', label: 'REPAIR_IN - 进修理厂' },
  { value: 'REPAIR_OUT', label: 'REPAIR_OUT - 出修理厂' },
  { value: 'CLEANING', label: 'CLEANING - 洗箱' },
  { value: 'INSPECTION', label: 'INSPECTION - 验箱' },
  { value: 'STORAGE', label: 'STORAGE - 入库' }
];

// 添加照片上传相关的接口
interface UploadFile {
  uid: string;
  name: string;
  url: string;
  status: 'init' | 'uploading' | 'done' | 'error';
}

const AddDynamicPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const containerNo = searchParams.get('containerNo');
  
  const [form] = Form.useForm();
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 添加照片上传状态
  const [handoverPhotos, setHandoverPhotos] = useState<UploadFile[]>([]);
  const [entryPhotos, setEntryPhotos] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 页面加载时获取集装箱信息
  useEffect(() => {
    if (containerNo) {
      fetchContainerInfo(containerNo);
    }
  }, [containerNo]);

  // 获取集装箱信息
  const fetchContainerInfo = async (no: string) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockInfo: ContainerInfo = {
        containerNo: no.toUpperCase(),
        containerType: '20GP',
        status: '可用',
        location: '上海港洋山码头'
      };
      setContainerInfo(mockInfo);
      setLoading(false);
    }, 500);
  };

  // 返回上一页
  const handleGoBack = () => {
    navigate('/smartainer/single-container-maintenance');
  };

  // 动态代码变化处理
  const handleDynamicCodeChange = (value: string) => {
    const selectedOption = dynamicCodeOptions.find(option => option.value === value);
    if (selectedOption) {
      form.setFieldValue('dynamicName', selectedOption.label.split(' - ')[1]);
    }
  };

  // 获取动态代码标签颜色
  const getDynamicCodeColor = (code: string) => {
    const colorMap: Record<string, string> = {
      'GATE_IN': 'blue',
      'GATE_OUT': 'purple',
      'LOAD': 'green',
      'DISCHARGE': 'orange',
      'PICKUP': 'cyan',
      'RETURN': 'magenta',
      'EMPTY_RETURN': 'red',
      'REPAIR_IN': 'yellow',
      'REPAIR_OUT': 'lime',
      'CLEANING': 'geekblue',
      'INSPECTION': 'volcano',
      'STORAGE': 'gold'
    };
    return colorMap[code] || 'gray';
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '可用': 'green',
      '占用': 'orange',
      '维修中': 'red',
      '运输中': 'blue'
    };
    return colorMap[status] || 'gray';
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setCurrentStep(0);
  };

  // 处理照片预览
  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url);
    setPreviewVisible(true);
  };

  // 处理照片上传
  const handleUpload = async (file: File, type: 'handover' | 'entry') => {
    // 这里应该调用实际的上传API
    // 目前使用模拟上传
    return new Promise<UploadFile>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const uploadFile: UploadFile = {
          uid: Math.random().toString(36).slice(2),
          name: file.name,
          url,
          status: 'done'
        };
        resolve(uploadFile);
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理照片删除
  const handleRemove = (file: UploadFile, type: 'handover' | 'entry') => {
    if (type === 'handover') {
      setHandoverPhotos(prev => prev.filter(f => f.uid !== file.uid));
    } else {
      setEntryPhotos(prev => prev.filter(f => f.uid !== file.uid));
    }
  };

  // 修改保存函数，添加上传照片的验证
  const handleSave = async () => {
    try {
      await form.validate();
      
      // 验证照片上传
      if (handoverPhotos.length === 0) {
        Message.error('请上传设备交接单照片');
        return;
      }
      if (entryPhotos.length === 0) {
        Message.error('请上传进场照片');
        return;
      }

      setLoading(true);
      
      // 模拟保存API调用
      setTimeout(() => {
        setLoading(false);
        setCurrentStep(2);
        Message.success('动态添加成功！');
        
        // 3秒后自动返回
        setTimeout(() => {
          handleGoBack();
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 继续添加
  const handleContinueAdd = () => {
    form.resetFields();
    setCurrentStep(0);
  };

  if (!containerNo) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Text type="secondary">缺少集装箱号参数</Text>
          <br />
          <Button type="primary" onClick={handleGoBack} style={{ marginTop: '16px' }}>
            返回单箱维护
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title heading={4} style={{ margin: 0 }}>新增动态</Title>
            <Button icon={<IconLeft />} onClick={handleGoBack}>
              返回
            </Button>
          </div>
        </div>

        {/* 步骤条 */}
        <div style={{ marginBottom: '32px' }}>
          <Steps current={currentStep} size="small">
            <Step title="集装箱信息" description="确认集装箱基本信息" />
            <Step title="动态信息" description="填写动态详细信息" />
            <Step title="完成" description="动态添加成功" />
          </Steps>
        </div>

        {/* 集装箱信息卡片 */}
        {containerInfo && (
          <Card style={{ marginBottom: '24px', backgroundColor: '#f7f8fa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title heading={5} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                <IconArchive style={{ marginRight: '8px', color: '#165DFF' }} />
                集装箱信息
              </Title>
              <Tag color="blue">当前操作</Tag>
            </div>
            
                         <Descriptions
               column={4}
               data={[
                 { label: '箱号', value: containerInfo.containerNo },
                 { label: '箱型', value: containerInfo.containerType },
                 { 
                   label: '状态', 
                   value: <Tag color={getStatusColor(containerInfo.status)}>{containerInfo.status}</Tag>
                 },
                 { label: '当前位置', value: containerInfo.location }
               ]}
             />
          </Card>
        )}

        {/* 动态信息表单 */}
        {currentStep < 2 && (
          <Card>
            <div style={{ marginBottom: '24px' }}>
              <Title heading={5} style={{ margin: 0 }}>动态信息</Title>
            </div>

            <Form 
              form={form} 
              layout="vertical"
              onValuesChange={() => {
                if (currentStep === 0) setCurrentStep(1);
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <Form.Item
                  label="动态代码"
                  field="dynamicCode"
                  rules={[{ required: true, message: '请选择动态代码' }]}
                >
                  <Select
                    placeholder="请选择动态代码"
                    onChange={handleDynamicCodeChange}
                  >
                    {dynamicCodeOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Tag 
                            color={getDynamicCodeColor(option.value)} 
                            style={{ marginRight: '8px' }}
                          >
                            {option.value}
                          </Tag>
                          {option.label.split(' - ')[1]}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="动态名称"
                  field="dynamicName"
                >
                  <Input placeholder="根据动态代码自动填充" disabled />
                </Form.Item>

                <Form.Item
                  label="动态时间"
                  field="dynamicTime"
                  rules={[{ required: true, message: '请选择动态时间' }]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                    placeholder="请选择动态时间"
                  />
                </Form.Item>

                <Form.Item
                  label="关联单位"
                  field="relatedUnit"
                  rules={[{ required: true, message: '请输入关联单位' }]}
                >
                  <Input placeholder="请输入关联单位" />
                </Form.Item>

                <Form.Item
                  label="订舱号"
                  field="bookingNo"
                >
                  <Input placeholder="请输入订舱号（可选）" />
                </Form.Item>

                <Form.Item
                  label="提单号"
                  field="billOfLading"
                >
                  <Input placeholder="请输入提单号（可选）" />
                </Form.Item>

                <Form.Item
                  label="船名航次"
                  field="vesselVoyage"
                  style={{ gridColumn: 'span 2' }}
                >
                  <Input placeholder="请输入船名航次，如：COSCO SHANGHAI/2312E（可选）" />
                </Form.Item>
              </div>

              {/* 添加照片上传区域 */}
              <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <Form.Item
                  label="设备交接单照片"
                  field="handoverPhotos"
                  rules={[{ required: true, message: '请上传设备交接单照片' }]}
                >
                  <div className="upload-list">
                    <Upload
                      listType="picture-card"
                      fileList={handoverPhotos}
                      customRequest={async (option) => {
                        const file = option.file as File;
                        const uploadFile = await handleUpload(file, 'handover');
                        setHandoverPhotos(prev => [...prev, uploadFile]);
                        option.onSuccess?.();
                      }}
                      onRemove={(file) => handleRemove(file as UploadFile, 'handover')}
                      limit={5}
                      imagePreview={false}
                      onChange={(_, currentFile) => {
                        if (currentFile.status === 'done') {
                          handlePreview(currentFile as UploadFile);
                        }
                      }}
                    >
                      <div className="upload-trigger">
                        <IconPlus />
                        <div style={{ marginTop: 8 }}>上传照片</div>
                      </div>
                    </Upload>
                  </div>
                </Form.Item>

                <Form.Item
                  label="进场照片"
                  field="entryPhotos"
                  rules={[{ required: true, message: '请上传进场照片' }]}
                >
                  <div className="upload-list">
                    <Upload
                      listType="picture-card"
                      fileList={entryPhotos}
                      customRequest={async (option) => {
                        const file = option.file as File;
                        const uploadFile = await handleUpload(file, 'entry');
                        setEntryPhotos(prev => [...prev, uploadFile]);
                        option.onSuccess?.();
                      }}
                      onRemove={(file) => handleRemove(file as UploadFile, 'entry')}
                      limit={5}
                      imagePreview={false}
                      onChange={(_, currentFile) => {
                        if (currentFile.status === 'done') {
                          handlePreview(currentFile as UploadFile);
                        }
                      }}
                    >
                      <div className="upload-trigger">
                        <IconPlus />
                        <div style={{ marginTop: 8 }}>上传照片</div>
                      </div>
                    </Upload>
                  </div>
                </Form.Item>
              </div>

              {/* 照片预览模态框 */}
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
              >
                <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
              </Modal>

              {/* 表单按钮 */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button icon={<IconRefresh />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<IconSave />} onClick={handleSave} loading={loading}>
                  保存
                </Button>
              </div>
            </Form>
          </Card>
        )}

        {/* 成功页面 */}
        {currentStep === 2 && (
          <Card>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ marginBottom: '24px' }}>
                <IconCheck 
                  style={{ 
                    fontSize: '64px', 
                    color: '#00B42A',
                    marginBottom: '16px'
                  }} 
                />
              </div>
              <Title heading={3} style={{ color: '#00B42A', marginBottom: '16px' }}>
                动态添加成功！
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                集装箱 {containerInfo?.containerNo} 的动态记录已成功添加
              </Text>
              
              <div style={{ marginTop: '32px' }}>
                <Space size="large">
                  <Button onClick={handleGoBack}>
                    返回列表
                  </Button>
                  <Button type="primary" onClick={handleContinueAdd}>
                    继续添加
                  </Button>
                </Space>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  3秒后自动返回到单箱维护页面...
                </Text>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default AddDynamicPage; 