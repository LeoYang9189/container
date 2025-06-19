import React, { useState } from 'react';
import { 
  Card, 
  Breadcrumb, 
  Button, 
  Space, 
  Input, 
  Select, 
  Form, 
  Grid, 
  Checkbox,
  Radio, 
  Table,
  Message,
  Modal,
  DatePicker
} from '@arco-design/web-react';
import { IconSave, IconDelete, IconUpload, IconRobot } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import SaasLayout from './SaasLayout';
import './CreateFclInquiry.css';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const provinceOptions = [
  { value: '浙江省', label: '浙江省' },
  { value: '江苏省', label: '江苏省' },
  { value: '上海市', label: '上海市' },
  { value: '广东省', label: '广东省' },
  { value: '内蒙古自治区', label: '内蒙古自治区' },
  { value: '黑龙江省', label: '黑龙江省' },
  { value: '新疆维吾尔自治区', label: '新疆维吾尔自治区' },
];
const cityOptions = {
  '浙江省': [
    { value: '杭州市', label: '杭州市' },
    { value: '嘉兴市', label: '嘉兴市' },
    { value: '湖州市', label: '湖州市' },
    { value: '宁波市', label: '宁波市' },
    { value: '绍兴市', label: '绍兴市' },
  ],
  '江苏省': [
    { value: '苏州市', label: '苏州市' },
    { value: '南京市', label: '南京市' },
    { value: '无锡市', label: '无锡市' },
  ],
  '上海市': [
    { value: '上海市', label: '上海市' },
  ],
  '广东省': [
    { value: '广州市', label: '广州市' },
    { value: '佛山市', label: '佛山市' },
    { value: '深圳市', label: '深圳市' },
  ],
};
const districtOptions = {
  '杭州市': [
    { value: '萧山区', label: '萧山区' },
    { value: '西湖区', label: '西湖区' },
    { value: '余杭区', label: '余杭区' },
  ],
  '嘉兴市': [
    { value: '海宁市', label: '海宁市' },
    { value: '平湖市', label: '平湖市' },
  ],
  '苏州市': [
    { value: '工业园区', label: '工业园区' },
    { value: '姑苏区', label: '姑苏区' },
  ],
  '上海市': [
    { value: '浦东新区', label: '浦东新区' },
    { value: '黄浦区', label: '黄浦区' },
  ],
};
const streetOptions = {
  '萧山区': [
    { value: '新塘街道', label: '新塘街道' },
    { value: '北干街道', label: '北干街道' },
  ],
  '西湖区': [
    { value: '灵隐街道', label: '灵隐街道' },
    { value: '西溪街道', label: '西溪街道' },
  ],
  '工业园区': [
    { value: '娄葑街道', label: '娄葑街道' },
    { value: '斜塘街道', label: '斜塘街道' },
  ],
  '浦东新区': [
    { value: '陆家嘴街道', label: '陆家嘴街道' },
    { value: '张江镇', label: '张江镇' },
  ],
};
const zipCodeAddressMap: {[key: string]: string} = {
  '90001': 'Los Angeles, CA',
  '90210': 'Beverly Hills, CA',
  '10001': 'New York, NY',
  '33101': 'Miami, FL',
  '60601': 'Chicago, IL',
  '98101': 'Seattle, WA',
  '94101': 'San Francisco, CA',
  '02101': 'Boston, MA',
  '77001': 'Houston, TX',
  '19101': 'Philadelphia, PA',
  '20001': 'Washington, DC',
  '30301': 'Atlanta, GA',
  '48201': 'Detroit, MI',
  '80201': 'Denver, CO',
  '85001': 'Phoenix, AZ',
  '92101': 'San Diego, CA',
  '75201': 'Dallas, TX',
  '89101': 'Las Vegas, NV',
  '97201': 'Portland, OR',
  '37201': 'Nashville, TN'
};

// 拼箱干线运价表格数据示例
const lclMainlineRateData = [
  {
    id: '1',
    shipCompany: 'SITC',
    departurePort: 'CNSHA | Shanghai',
    dischargePort: 'USLAX | Los Angeles',
    validPeriod: '2024-06-01 ~ 2024-07-01',
    costTon: '1200',
    costCbm: '350',
    peerTon: '1300',
    peerCbm: '370',
    directTon: '1400',
    directCbm: '400',
    marketTon: '1500',
    marketCbm: '420',
  },
  {
    id: '2',
    shipCompany: '万海',
    departurePort: 'CNNGB | Ningbo',
    dischargePort: 'USNYC | New York',
    validPeriod: '2024-07-01 ~ 2024-08-01',
    costTon: '1250',
    costCbm: '360',
    peerTon: '1350',
    peerCbm: '380',
    directTon: '1450',
    directCbm: '410',
    marketTon: '1550',
    marketCbm: '430',
  }
];

// 港前运价表格数据
const precarriageRateData = [
  {
    id: '1',
    certNo: 'P001',
    type: '直达',
    origin: '苏州工业园区',
    destination: '洋山港',
    vendor: '德邦专线',
    currency: 'CNY',
    '20GP': '800.00',
    '40GP': '1200.00',
    '40HC': '1300.00',
    validDate: '2024-12-31',
  },
  {
    id: '2',
    certNo: 'P002',
    type: '支线',
    origin: '太仓港',
    destination: '洋山港',
    vendor: '速航65号',
    currency: 'CNY',
    '20GP': '400.00',
    '40GP': '700.00',
    '40HC': '750.00',
    validDate: '2024-11-30',
  }
];

// 尾程运价表格数据
const oncarriageRateData = [
  {
    id: '1',
    certNo: 'O001',
    origin: 'USLAX | LOS ANGELES',
    addressType: '第三方地址',
    zipCode: '92101',
    address: 'San Diego, CA',
    warehouseCode: null,
    agentName: 'XPO TRUCK LLC',
    validDateRange: '2024-05-01 至 2024-12-31',
    remark: '',
    status: '正常'
  },
  {
    id: '2',
    certNo: 'O002',
    origin: 'USNYC | NEW YORK',
    addressType: '亚马逊仓库',
    zipCode: '',
    address: '',
    warehouseCode: 'ONT8',
    agentName: 'DRAYEASY INC',
    validDateRange: '2024-05-15 至 2024-11-30',
    remark: '',
    status: '正常'
  }
];

const CreateLclInquiry: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // 表单状态
  const [formState, setFormState] = useState({
    inquiryNo: 'LCL' + Date.now(),
    inquirer: '张三',
    precarriageChecked: false,  // 港前报价始终为false
    mainlineChecked: true,     // 干线报价
    lastmileChecked: true,     // 尾程报价
    cargoNature: '询价',
    cargoReadyTimeType: '区间',
    cargoReadyTime: '二周内',
    cargoReadyDate: '',
    cargoQuality: '实单',
    serviceTerms: 'DDP',
    customServiceTerms: '',
    clientType: '不指定',
    clientCompany: '',
    clientName: '',
    weight: '',
    volume: '',
    // 去掉AI识别相关的装箱门点字段
    // 保留尾程送货地址相关字段
    addressType: '第三方地址',
    zipCode: '',
    address: '',
    warehouseCode: '',
    transitType: '不指定',
    route: '跨太平洋东行',
    departurePort: 'CNSHA | Shanghai',
    dischargePort: 'USLAX | Los Angeles',
    transitPort: '',
    goodsType: '普货',
    dangerLevel: '',
    unNo: '',
    temperature: '',
    humidity: '',
    hsCode: '',
    shipCompany: '',
    remark: ''
  });
  
  // 可用的状态变量
  const [selectedMainlineRate, setSelectedMainlineRate] = useState('');
  const [selectedOncarriageRates, setSelectedOncarriageRates] = useState<string[]>([]);
  
  // 尾程送货地址AI识别相关
  const [deliveryAiModalVisible, setDeliveryAiModalVisible] = useState(false);
  const [deliveryAddressText, setDeliveryAddressText] = useState('');
  
  // 负责人弹窗
  const [managerSelectVisible, setManagerSelectVisible] = useState(false);
  const [selectedLastMileManager, setSelectedLastMileManager] = useState('');
  const [selectedMainlineManager, setSelectedMainlineManager] = useState('');
  
  // 运价详情弹窗状态
  const [rateDetailVisible, setRateDetailVisible] = useState(false);
  const [currentRateDetail, setCurrentRateDetail] = useState('');
  const [currentRateType, setCurrentRateType] = useState<'mainline' | 'precarriage' | 'oncarriage'>('mainline');

  // 处理复选框状态变化
  const handleCheckboxChange = (key: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [key]: checked
    }));

    // 在拼箱询价中只有尾程价格可以勾选/取消
    if (key === 'precarriageChecked') {
      // 港前价格在拼箱询价中始终为false，不能更改
      return;
    }
    
    // 如果取消了尾程价格勾选，则清空送货地址相关数据
    if (key === 'lastmileChecked' && !checked) {
      setFormState(prev => ({
        ...prev,
        [key]: checked,
        addressType: '第三方地址',
        zipCode: '',
        address: '',
        warehouseCode: ''
      }));
    }
  };

  // 表单校验
  const handleSaveDraft = () => {
    Message.success('草稿保存成功');
    navigate('/inquiry-management');
  };

  const confirmManagerSelect = () => {
    if (!selectedLastMileManager && !selectedMainlineManager) {
      Message.error('请至少选择一位负责人');
      return;
    }
    Message.success('询价单提交成功');
    setManagerSelectVisible(false);
    navigate('/inquiry-management');
  };

  const handleCancel = () => {
    navigate('/inquiry-management');
  };

    // 拼箱询价中只需要尾程送货地址AI识别

  // 打开运价详情弹窗
  const showRateDetail = (rateId: string, type: 'mainline' | 'precarriage' | 'oncarriage' = 'mainline') => {
    setCurrentRateDetail(rateId);
    setCurrentRateType(type);
    setRateDetailVisible(true);
  };

  // 关闭运价详情弹窗
  const closeRateDetail = () => {
    setRateDetailVisible(false);
  };

  // 获取运价详情数据
  interface FeeDetail {
    key: string;
    name: string;
    price: string;
    currency: string;
    unit: string;
    remark: string;
    type: 'basic' | 'origin' | 'destination';
  }

  const getRateDetail = (_rateId: string, type: 'mainline' | 'precarriage' | 'oncarriage' = 'mainline'): { basic: FeeDetail[], origin: FeeDetail[], destination: FeeDetail[] } => {
    // 根据不同的运价类型返回不同的数据
    if (type === 'precarriage') {
      // 港前运价详情
      return {
        basic: [
          { key: '1', name: '拖车费', price: '800.00', currency: 'CNY', unit: '20GP', remark: '', type: 'basic' },
          { key: '2', name: '拖车费', price: '1200.00', currency: 'CNY', unit: '40GP', remark: '', type: 'basic' },
          { key: '3', name: '拖车费', price: '1300.00', currency: 'CNY', unit: '40HC', remark: '', type: 'basic' }
        ],
        origin: [
          { key: '4', name: '装柜费', price: '200.00', currency: 'CNY', unit: '箱', remark: '', type: 'origin' }
        ],
        destination: []
      };
    } else if (type === 'oncarriage') {
      // 尾程运价详情
      return {
        basic: [
          { key: '1', name: 'ISF CHARGE', price: '50.00', currency: 'USD', unit: 'B/L', remark: '', type: 'basic' }
        ],
        origin: [],
        destination: []
      };
    } else {
      // 干线运价详情
      return {
        basic: [
          { key: '1', name: '海运费', price: '1200.00', currency: 'USD', unit: 'TON', remark: '', type: 'basic' },
          { key: '2', name: '海运费', price: '350.00', currency: 'USD', unit: 'CBM', remark: '', type: 'basic' }
        ],
        origin: [
          { key: '3', name: '文件费', price: '500.00', currency: 'CNY', unit: '票', remark: '', type: 'origin' }
        ],
        destination: [
          { key: '4', name: '燃油附加费', price: '100.00', currency: 'USD', unit: 'TON', remark: '', type: 'destination' }
        ]
      };
    }
  };

  const handleDeliveryAiRecognize = () => {
    setTimeout(() => {
      if (deliveryAddressText) {
        setFormState(prev => ({ ...prev, address: deliveryAddressText }));
        Message.success('地址识别成功');
      }
      setDeliveryAiModalVisible(false);
    }, 1000);
  };

  const handleFormChange = (field: string, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SaasLayout 
      menuSelectedKey="9" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>询价报价</Breadcrumb.Item>
          <Breadcrumb.Item>询价管理</Breadcrumb.Item>
          <Breadcrumb.Item>新建拼箱询价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <Form form={form} layout="vertical">
        <Card className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Checkbox 
                style={{ marginRight: 16 }} 
                checked={false}
                disabled={true}
              >
                港前价格
              </Checkbox>
              <Checkbox 
                style={{ marginRight: 16 }}
                checked={formState.mainlineChecked}
                onChange={(checked) => handleCheckboxChange('mainlineChecked', checked)}
              >
                干线价格
              </Checkbox>
              <Checkbox 
                checked={formState.lastmileChecked}
                onChange={(checked) => handleCheckboxChange('lastmileChecked', checked)}
              >
                尾程价格
              </Checkbox>
            </div>
            <Space>
              <Button icon={<IconSave />} onClick={handleSaveDraft}>保存草稿</Button>
              <Button type="primary" icon={<IconUpload />} onClick={() => setManagerSelectVisible(true)}>直接提交</Button>
              <Button icon={<IconDelete />} onClick={handleCancel}>取消</Button>
            </Space>
          </div>
          <Row gutter={[16, 16]}>
            {/* 左侧区域：基本信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">基本信息</div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <FormItem label="询价编号" field="inquiryNo">
                      <Input value={formState.inquiryNo} disabled />
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="询价人" field="inquirer">
                      <Input value={formState.inquirer} disabled />
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="货盘性质" field="cargoNature">
                      <Select value={formState.cargoNature} onChange={v => setFormState({ ...formState, cargoNature: v })}>
                        <Option value="询价">询价</Option>
                        <Option value="实单">实单</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="货好时间" field="cargoReadyTime">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Radio.Group
                          type="button"
                          name="cargoReadyTimeType"
                          value={formState.cargoReadyTimeType}
                          onChange={v => setFormState({ ...formState, cargoReadyTimeType: v })}
                        >
                          <Radio value="区间">区间</Radio>
                          <Radio value="日期">日期</Radio>
                        </Radio.Group>
                        <div style={{ flex: 1, marginLeft: 8 }}>
                          {formState.cargoReadyTimeType === '区间' ? (
                            <Select value={formState.cargoReadyTime} onChange={v => setFormState({ ...formState, cargoReadyTime: v })} style={{ width: '100%' }}>
                              <Option value="一周内">一周内</Option>
                              <Option value="二周内">二周内</Option>
                              <Option value="一个月内">一个月内</Option>
                              <Option value="一月以上">一月以上</Option>
                              <Option value="时间未知">时间未知</Option>
                            </Select>
                          ) : (
                            <DatePicker style={{ width: '100%' }} value={formState.cargoReadyDate} onChange={v => setFormState({ ...formState, cargoReadyDate: v })} />
                          )}
                        </div>
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="货盘质量" field="cargoQuality">
                      <Select value={formState.cargoQuality} onChange={v => setFormState({ ...formState, cargoQuality: v })}>
                        <Option value="实单">实单</Option>
                        <Option value="询价">询价</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="服务条款" field="serviceTerms">
                      <Select value={formState.serviceTerms} onChange={v => setFormState({ ...formState, serviceTerms: v })} style={{ width: formState.serviceTerms === '自定义' ? '50%' : '100%' }}>
                        <Option value="CIF">CIF</Option>
                        <Option value="FOB">FOB</Option>
                        <Option value="DDP">DDP</Option>
                        <Option value="DDU">DDU</Option>
                        <Option value="EXW">EXW</Option>
                        <Option value="DAP">DAP</Option>
                        <Option value="FBA">FBA</Option>
                        <Option value="自定义">自定义</Option>
                      </Select>
                      {formState.serviceTerms === '自定义' && (
                        <Input style={{ width: '50%', marginLeft: 8 }} value={formState.customServiceTerms} onChange={v => setFormState({ ...formState, customServiceTerms: v })} placeholder="请输入自定义服务条款" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="委托单位" field="clientType">
                      <Select value={formState.clientType} onChange={v => setFormState({ ...formState, clientType: v })}>
                        <Option value="不指定">不指定</Option>
                        <Option value="正式客户">正式客户</Option>
                        <Option value="临时客户">临时客户</Option>
                      </Select>
                      {formState.clientType === '正式客户' && (
                        <Select style={{ width: '100%', marginTop: 8 }} value={formState.clientCompany} onChange={v => setFormState({ ...formState, clientCompany: v })} placeholder="选择客户抬头">
                          <Option value="阿里巴巴集团">阿里巴巴集团</Option>
                          <Option value="京东物流有限公司">京东物流有限公司</Option>
                          <Option value="华为技术有限公司">华为技术有限公司</Option>
                          <Option value="小米科技有限公司">小米科技有限公司</Option>
                          <Option value="海尔集团公司">海尔集团公司</Option>
                          <Option value="宝钢集团有限公司">宝钢集团有限公司</Option>
                          <Option value="招商局集团">招商局集团</Option>
                          <Option value="中远海运集团">中远海运集团</Option>
                        </Select>
                      )}
                      {formState.clientType === '临时客户' && (
                        <Input style={{ width: '100%', marginTop: 8 }} value={formState.clientName} onChange={v => setFormState({ ...formState, clientName: v })} placeholder="请输入客户抬头" />
                      )}
                    </FormItem>
                  </Col>
                                    {/* 拼箱询价不显示装箱门点区域 */}
                  {/* 尾程送货地址，仅在勾选尾程报价时显示 */}
                  {formState.lastmileChecked && (
                    <Col span={24}>
                      <div className="mb-4">
                        <div className="text-gray-800 font-medium mb-2">尾程送货地址</div>
                        <div className="flex items-center justify-between mb-2">
                          <FormItem label="" style={{ width: '100%', marginBottom: 0 }}>
                            <div className="flex items-center w-full">
                              <div className="text-xs text-gray-500 mr-auto">配送地址信息</div>
                              <Button 
                                type="primary"
                                icon={<IconRobot />}
                                onClick={() => setDeliveryAiModalVisible(true)}
                              >
                                AI识别
                              </Button>
                            </div>
                          </FormItem>
                        </div>
                        <FormItem label="配送地址类型" field="addressType" style={{ marginBottom: '12px' }}>
                          <RadioGroup 
                            value={formState.addressType}
                            onChange={v => setFormState({...formState, addressType: v})}
                          >
                            <Radio value="第三方地址">第三方地址</Radio>
                            <Radio value="亚马逊仓库">亚马逊仓库</Radio>
                            <Radio value="易仓">易仓</Radio>
                          </RadioGroup>
                        </FormItem>
                        {formState.addressType === '第三方地址' && (
                          <>
                            <FormItem label="邮编" field="zipCode" style={{ marginBottom: '12px' }}>
                              <Input 
                                placeholder="请输入邮编"
                                value={formState.zipCode}
                                onChange={v => {
                                  setFormState({...formState, zipCode: v});
                                  // 如果邮编存在于映射中，自动填充地址
                                  if (v && zipCodeAddressMap[v]) {
                                    setFormState(prev => ({
                                      ...prev,
                                      zipCode: v,
                                      address: zipCodeAddressMap[v]
                                    }));
                                    Message.success(`已自动填充地址: ${zipCodeAddressMap[v]}`);
                                  }
                                }}
                                allowClear
                              />
                            </FormItem>
                            <FormItem label="地址" field="address" style={{ marginBottom: '12px' }}>
                              <Input 
                                placeholder="例如：San Diego, CA"
                                value={formState.address}
                                onChange={v => setFormState({...formState, address: v})}
                                allowClear
                              />
                            </FormItem>
                          </>
                        )}
                        {(formState.addressType === '亚马逊仓库' || formState.addressType === '易仓') && (
                          <FormItem 
                            label="仓库代码"
                            field="warehouseCode"
                            style={{ marginBottom: '12px' }}
                          >
                            <Input 
                              placeholder={formState.addressType === '亚马逊仓库' ? "例如：ONT8" : "例如：LAX203"}
                              value={formState.warehouseCode}
                              onChange={v => setFormState({...formState, warehouseCode: v})}
                              allowClear
                            />
                          </FormItem>
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
            {/* 右侧区域：货物信息 */}
            <Col span={12}>
              <div className="border rounded p-4 mb-4">
                <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">货物信息</div>
                
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <FormItem label="直达/中转" field="transitType">
                      <RadioGroup 
                        value={formState.transitType || '不指定'}
                        onChange={(value) => handleFormChange('transitType', value)}
                      >
                        <Radio value="不指定">不指定</Radio>
                        <Radio value="直达">直达</Radio>
                        <Radio value="中转">中转</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="航线" field="route">
                      <Select
                        placeholder="请选择航线" 
                        value={formState.route || '跨太平洋东行'}
                        onChange={(value) => handleFormChange('route', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="跨太平洋东行">跨太平洋东行</Option>
                        <Option value="跨太平洋西行">跨太平洋西行</Option>
                        <Option value="远东西行">远东西行</Option>
                        <Option value="远东东行">远东东行</Option>
                        <Option value="欧地线">欧地线</Option>
                        <Option value="亚洲区域">亚洲区域</Option>
                        <Option value="中东印巴线">中东印巴线</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="起运港" field="departurePort">
                      <Select
                        placeholder="请选择起运港" 
                        value={formState.departurePort || 'CNSHA | Shanghai'}
                        onChange={(value) => handleFormChange('departurePort', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="CNSHA | Shanghai">CNSHA | Shanghai</Option>
                        <Option value="CNNGB | Ningbo">CNNGB | Ningbo</Option>
                        <Option value="CNQIN | Qingdao">CNQIN | Qingdao</Option>
                        <Option value="CNTXG | Tianjin">CNTXG | Tianjin</Option>
                        <Option value="CNCAN | Guangzhou">CNCAN | Guangzhou</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  <Col span={24}>
                    <FormItem label="卸货港" field="dischargePort">
                      <Select
                        placeholder="请选择卸货港" 
                        value={formState.dischargePort || 'USLAX | Los Angeles'}
                        onChange={(value) => handleFormChange('dischargePort', value)}
                        style={{ width: '100%' }}
                        showSearch
                      >
                        <Option value="USLAX | Los Angeles">USLAX | Los Angeles</Option>
                        <Option value="USNYC | New York">USNYC | New York</Option>
                        <Option value="DEHAM | Hamburg">DEHAM | Hamburg</Option>
                        <Option value="NLRTM | Rotterdam">NLRTM | Rotterdam</Option>
                        <Option value="SGSIN | Singapore">SGSIN | Singapore</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {/* 中转港字段 - 仅在选择中转时显示 */}
                  {formState.transitType === '中转' && (
                    <Col span={24}>
                      <FormItem label="中转港" field="transitPort">
                        <Select
                          placeholder="请选择中转港" 
                          value={formState.transitPort}
                          onChange={(value) => handleFormChange('transitPort', value)}
                          style={{ width: '100%' }}
                          showSearch
                        >
                          <Option value="KRPUS | Busan">KRPUS | Busan</Option>
                          <Option value="SGSIN | Singapore">SGSIN | Singapore</Option>
                          <Option value="HKHKG | Hong Kong">HKHKG | Hong Kong</Option>
                          <Option value="TWKHH | Kaohsiung">TWKHH | Kaohsiung</Option>
                          <Option value="MYPKG | Port Klang">MYPKG | Port Klang</Option>
                        </Select>
                      </FormItem>
                    </Col>
                  )}
                  
                  <Col span={24}>
                    <FormItem label="货物类型" field="goodsType">
                      <Select 
                        placeholder="请选择" 
                        style={{ width: '100%' }}
                        value={formState.goodsType || '普货'}
                        onChange={(value) => handleFormChange('goodsType', value)}
                      >
                        <Option value="普货">普货</Option>
                        <Option value="危险品">危险品</Option>
                        <Option value="冷冻货">冷冻货</Option>
                        <Option value="卷钢">卷钢</Option>
                        <Option value="化工品">化工品</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {formState.goodsType === '危险品' && (
                    <>
                      <Col span={24}>
                        <FormItem label="危险品等级" field="dangerLevel">
                          <Input
                            placeholder="请输入危险品等级"
                            value={formState.dangerLevel}
                            onChange={(value) => handleFormChange('dangerLevel', value)}
                          />
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="UN No" field="unNo">
                          <Input
                            placeholder="请输入UN No"
                            value={formState.unNo}
                            onChange={(value) => handleFormChange('unNo', value)}
                          />
                        </FormItem>
                      </Col>
                    </>
                  )}
                  
                  {formState.goodsType === '冷冻货' && (
                    <>
                      <Col span={24}>
                        <FormItem label="温度" field="temperature">
                          <Input
                            placeholder="请输入温度"
                            value={formState.temperature}
                            onChange={(value) => handleFormChange('temperature', value)}
                            suffix="°C"
                          />
                        </FormItem>
                      </Col>
                      
                      <Col span={24}>
                        <FormItem label="通风量" field="humidity">
                          <Input
                            placeholder="请输入通风量"
                            value={formState.humidity}
                            onChange={(value) => handleFormChange('humidity', value)}
                            suffix="%"
                          />
                        </FormItem>
                      </Col>
                    </>
                  )}
                  
                  <Col span={24}>
                    <FormItem label="品名（HS Code）" field="hsCode">
                      <Input 
                        placeholder="请输入品名或HS Code" 
                        value={formState.hsCode}
                        onChange={(value) => handleFormChange('hsCode', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={12}>
                    <FormItem label="重量 (KGS)" field="weight" rules={[{ required: true, message: '请输入重量' }]}>
                      <Input 
                        placeholder="请输入重量" 
                        suffix="KGS"
                        value={formState.weight}
                        onChange={(value) => handleFormChange('weight', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  <Col span={12}>
                    <FormItem label="体积 (CBM)" field="volume" rules={[{ required: true, message: '请输入体积' }]}>
                      <Input 
                        placeholder="请输入体积" 
                        suffix="CBM"
                        value={formState.volume}
                        onChange={(value) => handleFormChange('volume', value)}
                      />
                    </FormItem>
                  </Col>
                  
                  {/* 船公司字段 */}
                  <Col span={24}>
                    <FormItem label="船公司" field="shipCompany">
                      <Select 
                        placeholder="不指定" 
                        style={{ width: '100%' }}
                        value={formState.shipCompany || '不指定'}
                        onChange={(value) => handleFormChange('shipCompany', value)}
                        allowClear
                      >
                        <Option value="不指定">不指定</Option>
                        <Option value="MSC | 地中海">MSC | 地中海</Option>
                        <Option value="COSCO | 中远海运">COSCO | 中远海运</Option>
                        <Option value="MAERSK | 马士基">MAERSK | 马士基</Option>
                        <Option value="OOCL | 东方海外">OOCL | 东方海外</Option>
                        <Option value="CMA | 达飞轮船">CMA | 达飞轮船</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  
                  {/* 备注字段 */}
                  <Col span={24}>
                    <FormItem label="备注" field="remark">
                      <Input.TextArea 
                        placeholder="请输入备注信息" 
                        value={formState.remark}
                        onChange={(value) => handleFormChange('remark', value)}
                        style={{ minHeight: '60px' }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 干线运价表格 */}
        <Card className="mb-4">
          <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">干线运价</div>
          <Table
            rowKey="id"
            rowSelection={{
              type: 'radio',
              onChange: (selectedRowKeys) => setSelectedMainlineRate(selectedRowKeys[0] as string),
              selectedRowKeys: selectedMainlineRate ? [selectedMainlineRate] : []
            }}
            columns={[
              { title: '运价编号', dataIndex: 'id', width: 100 },
              { 
                title: '查看明细', 
                dataIndex: 'view', 
                width: 100, 
                render: (_, record) => (
                  <span 
                    className="view-link" 
                    style={{ color: '#1e88e5', cursor: 'pointer' }}
                    onClick={() => showRateDetail(record.id, 'mainline')}
                  >
                    查看
                  </span>
                )
              },
              { title: '船公司', dataIndex: 'shipCompany', width: 120 },
              { title: '起运港', dataIndex: 'departurePort', width: 150 },
              { title: '卸货港', dataIndex: 'dischargePort', width: 150 },
              { title: '有效期', dataIndex: 'validPeriod', width: 160 },
              { title: '成本价(TON)', dataIndex: 'costTon', width: 120 },
              { title: '成本价(CBM)', dataIndex: 'costCbm', width: 120 },
              { title: '同行价(TON)', dataIndex: 'peerTon', width: 120 },
              { title: '同行价(CBM)', dataIndex: 'peerCbm', width: 120 },
              { title: '直客价(TON)', dataIndex: 'directTon', width: 120 },
              { title: '直客价(CBM)', dataIndex: 'directCbm', width: 120 },
              { title: '市场价(TON)', dataIndex: 'marketTon', width: 120 },
              { title: '市场价(CBM)', dataIndex: 'marketCbm', width: 120 }
            ]}
            data={lclMainlineRateData}
            scroll={{ x: 1400 }}
            pagination={false}
            border={true}
            className="mt-4 match-price-table"
            tableLayoutFixed={false}
          />
        </Card>

                {/* 在拼箱询价中不需要显示港前运价 */}

        {/* 尾程运价表格 */}
        <Card className="mb-4">
          <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">尾程运价</div>
          <Table
            rowKey="id"
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys) => setSelectedOncarriageRates(selectedRowKeys as string[]),
              selectedRowKeys: selectedOncarriageRates
            }}
            columns={[
              { title: '运价编号', dataIndex: 'certNo', width: 100 },
              { 
                title: '查看明细', 
                dataIndex: 'view', 
                width: 100, 
                render: (_, record) => (
                  <span 
                    className="view-link" 
                    style={{ color: '#1e88e5', cursor: 'pointer' }}
                    onClick={() => showRateDetail(record.id, 'oncarriage')}
                  >
                    查看
                  </span>
                )
              },
              { title: '目的港', dataIndex: 'origin', width: 150 },
              { title: '配送地址类型', dataIndex: 'addressType', width: 120 },
              { title: '邮编', dataIndex: 'zipCode', width: 100 },
              { title: '地址', dataIndex: 'address', width: 180 },
              { title: '仓库代码', dataIndex: 'warehouseCode', width: 120, render: (v: string | null) => v || '-' },
              { title: '代理名称', dataIndex: 'agentName', width: 150 },
              { title: '有效期', dataIndex: 'validDateRange', width: 180 },
              { title: '备注', dataIndex: 'remark', width: 150 },
            ]}
            data={oncarriageRateData}
            scroll={{ x: 1300 }}
            pagination={false}
            border={true}
            className="mt-2 match-price-table"
          />
        </Card>

                {/* 拼箱询价不需要装箱门点AI识别弹窗 */}
        <Modal title="AI智能识别地址" visible={deliveryAiModalVisible} onCancel={() => setDeliveryAiModalVisible(false)} footer={[<Button key="cancel" onClick={() => setDeliveryAiModalVisible(false)}>取消</Button>,<Button key="recognize" type="primary" onClick={handleDeliveryAiRecognize}>识别</Button>]}>
          <div className="p-4">
            <Input.TextArea placeholder="请输入美国地址" style={{ minHeight: '120px' }} value={deliveryAddressText} onChange={setDeliveryAddressText} />
          </div>
        </Modal>

        {/* 负责人弹窗 */}
        <Modal title="选择询价负责人" visible={managerSelectVisible} onOk={confirmManagerSelect} onCancel={() => setManagerSelectVisible(false)} maskClosable={false} footer={[<Button key="cancel" onClick={() => setManagerSelectVisible(false)}>取消</Button>,<Button key="confirm" type="primary" onClick={confirmManagerSelect}>确定</Button>]}>
          <div>
            <div className="mb-4 pl-4 pt-2 text-gray-600">请选择需要发起询价的人员：</div>
            <Table columns={[{ title: '负责人', dataIndex: 'manager' }, { title: '选择', render: (_, record) => (<Radio checked={selectedLastMileManager === record.key} onChange={() => setSelectedLastMileManager(record.key)} />) }]} data={[{ key: '1', manager: '王五' }, { key: '2', manager: '李四' }]} pagination={false} border={true} rowKey="key" />
          </div>
        </Modal>

        {/* 运价详情弹窗 */}
        <Modal 
          title="运价详情"
          visible={rateDetailVisible}
          onOk={closeRateDetail}
          onCancel={closeRateDetail}
          maskClosable={false}
          style={{ width: 800 }}
        >
          <div className="p-4">
            {currentRateDetail && (
              <>
                {/* 基本信息 */}
                <div className="mb-6">
                  <div className="text-blue-600 font-bold mb-3 border-l-4 border-blue-600 pl-2">基本信息</div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentRateType === 'mainline' && lclMainlineRateData.filter(item => item.id === currentRateDetail).map(rate => (
                      <React.Fragment key={rate.id}>
                        <div className="mb-2">
                          <span className="text-gray-500">运价编号：</span>
                          <span className="font-medium">{rate.id}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">船公司：</span>
                          <span className="font-medium">{rate.shipCompany}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">起运港：</span>
                          <span className="font-medium">{rate.departurePort}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">卸货港：</span>
                          <span className="font-medium">{rate.dischargePort}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">有效期：</span>
                          <span className="font-medium">{rate.validPeriod}</span>
                        </div>
                      </React.Fragment>
                    ))}
                    {currentRateType === 'precarriage' && precarriageRateData.filter(item => item.id === currentRateDetail).map(rate => (
                      <React.Fragment key={rate.id}>
                        <div className="mb-2">
                          <span className="text-gray-500">运价编号：</span>
                          <span className="font-medium">{rate.certNo}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">类型：</span>
                          <span className="font-medium">{rate.type}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">起运地：</span>
                          <span className="font-medium">{rate.origin}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">目的地：</span>
                          <span className="font-medium">{rate.destination}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">供应商：</span>
                          <span className="font-medium">{rate.vendor}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">有效期：</span>
                          <span className="font-medium">{rate.validDate}</span>
                        </div>
                      </React.Fragment>
                    ))}
                    {currentRateType === 'oncarriage' && oncarriageRateData.filter(item => item.id === currentRateDetail).map(rate => (
                      <React.Fragment key={rate.id}>
                        <div className="mb-2">
                          <span className="text-gray-500">运价编号：</span>
                          <span className="font-medium">{rate.certNo}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">目的港：</span>
                          <span className="font-medium">{rate.origin}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">配送地址类型：</span>
                          <span className="font-medium">{rate.addressType}</span>
                        </div>
                        {rate.addressType === '第三方地址' && (
                          <>
                            <div className="mb-2">
                              <span className="text-gray-500">邮编：</span>
                              <span className="font-medium">{rate.zipCode}</span>
                            </div>
                            <div className="mb-2">
                              <span className="text-gray-500">地址：</span>
                              <span className="font-medium">{rate.address}</span>
                            </div>
                          </>
                        )}
                        {(rate.addressType === '亚马逊仓库' || rate.addressType === '易仓') && (
                          <div className="mb-2">
                            <span className="text-gray-500">仓库代码：</span>
                            <span className="font-medium">{rate.warehouseCode}</span>
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="text-gray-500">代理名称：</span>
                          <span className="font-medium">{rate.agentName}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-gray-500">有效期：</span>
                          <span className="font-medium">{rate.validDateRange}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {/* 费用明细 */}
                <div>
                  <div className="text-blue-600 font-bold mb-3 border-l-4 border-blue-600 pl-2">费用明细</div>
                  {/* 基础运费 */}
                  <div className="mb-4">
                    <div className="text-gray-700 font-medium mb-2 border-l-2 border-gray-400 pl-2">基础运费</div>
                    <Table 
                      columns={[
                        { title: '费用名称', dataIndex: 'name', width: 120 },
                        { title: '单价', dataIndex: 'price', width: 100 },
                        { title: '币种', dataIndex: 'currency', width: 80 },
                        { title: '计费单位', dataIndex: 'unit', width: 100 },
                        { title: '备注', dataIndex: 'remark', width: 150 }
                      ]}
                      data={currentRateDetail ? getRateDetail(currentRateDetail, currentRateType).basic : []}
                      pagination={false}
                      border={true}
                      rowKey="key"
                    />
                  </div>
                  {/* 起运港附加费 - 仅在有数据时显示 */}
                  {currentRateDetail && getRateDetail(currentRateDetail, currentRateType).origin.length > 0 && (
                    <div className="mb-4">
                      <div className="text-gray-700 font-medium mb-2 border-l-2 border-gray-400 pl-2">起运港附加费</div>
                      <Table 
                        columns={[
                          { title: '费用名称', dataIndex: 'name', width: 120 },
                          { title: '单价', dataIndex: 'price', width: 100 },
                          { title: '币种', dataIndex: 'currency', width: 80 },
                          { title: '计费单位', dataIndex: 'unit', width: 100 },
                          { title: '备注', dataIndex: 'remark', width: 150 }
                        ]}
                        data={getRateDetail(currentRateDetail, currentRateType).origin}
                        pagination={false}
                        border={true}
                        rowKey="key"
                      />
                    </div>
                  )}
                  {/* 目的港附加费 - 仅在有数据时显示 */}
                  {currentRateDetail && getRateDetail(currentRateDetail, currentRateType).destination.length > 0 && (
                    <div>
                      <div className="text-gray-700 font-medium mb-2 border-l-2 border-gray-400 pl-2">目的港附加费</div>
                      <Table 
                        columns={[
                          { title: '费用名称', dataIndex: 'name', width: 120 },
                          { title: '单价', dataIndex: 'price', width: 100 },
                          { title: '币种', dataIndex: 'currency', width: 80 },
                          { title: '计费单位', dataIndex: 'unit', width: 100 },
                          { title: '备注', dataIndex: 'remark', width: 150 }
                        ]}
                        data={getRateDetail(currentRateDetail, currentRateType).destination}
                        pagination={false}
                        border={true}
                        rowKey="key"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal>
      </Form>
    </SaasLayout>
  );
};

export default CreateLclInquiry; 