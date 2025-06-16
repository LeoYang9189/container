import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Message,
  Modal,
  Tag,
  Grid,
  Form,
  Typography,
  Tooltip,
  Dropdown
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconEdit,
  IconDelete,
  IconDownload,
  IconEye,
  IconCalendar,
  IconMore,
  IconClose,
  IconCheck
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

// 出场预约数据接口
interface ExitReservation {
  id: string;
  reservationNo: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  exitPurpose: string;
  needCleaning: boolean;
  needModification: boolean;
  containerNumbers: string[];
  pickupTime: string;
  createTime: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  remark?: string;
}

// 搜索参数接口
interface SearchParams {
  keyword: string;
  exitPurpose: string;
  status: string;
  dateRange: string[];
}

const ExitReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentRecord, setCurrentRecord] = useState<ExitReservation | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [wechatModalVisible, setWechatModalVisible] = useState(false);
  const [createWorkOrders, setCreateWorkOrders] = useState({
    cleaning: false,
    modification: false
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    exitPurpose: '',
    status: '',
    dateRange: []
  });
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  // 模拟数据
  const initialData: ExitReservation[] = Array.from({ length: 20 }, (_, index) => {
    const containerCounts = [1, 2, 3, 4, 5];
    const containerCount = containerCounts[Math.floor(Math.random() * containerCounts.length)];
    const containerNumbers = Array.from({ length: containerCount }, (_, i) => 
      `EXIT${String(index * 10 + i + 1).padStart(6, '0')}`
    );

    return {
      id: `ER${String(index + 1).padStart(6, '0')}`,
      reservationNo: `ER${String(index + 1).padStart(6, '0')}`,
      customerName: ['上海远洋运输有限公司', '中远海运集装箱运输有限公司', '马士基航运', '地中海航运'][Math.floor(Math.random() * 4)],
      contactPerson: ['张三', '李四', '王五', '赵六', '钱七'][Math.floor(Math.random() * 5)],
      contactPhone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      exitPurpose: ['提箱', '空箱回收', '修理后提箱', '清洗后提箱', '改装后提箱', '其他'][Math.floor(Math.random() * 6)],
      needCleaning: Math.random() > 0.5,
      needModification: Math.random() > 0.7,
      containerNumbers,
      pickupTime: `2024-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${['00', '30'][Math.floor(Math.random() * 2)]}:00`,
      createTime: `2024-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as ExitReservation['status'],
      approver: Math.random() > 0.3 ? ['管理员A', '审核员B', '主管C'][Math.floor(Math.random() * 3)] : undefined,
      remark: Math.random() > 0.5 ? `出场预约备注信息${index + 1}` : undefined
    };
  });

  const [data, setData] = useState<ExitReservation[]>(initialData);
  const [filteredData, setFilteredData] = useState<ExitReservation[]>(initialData);

  // 搜索处理
  const handleSearch = () => {
    let filtered = [...data];

    if (searchParams.keyword) {
      filtered = filtered.filter(item =>
        item.reservationNo.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.exitPurpose) {
      filtered = filtered.filter(item => item.exitPurpose === searchParams.exitPurpose);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= new Date(startDate) && createTime <= new Date(endDate);
      });
    }

    // 应用状态筛选
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeStatusFilter);
    }

    setFilteredData(filtered);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      exitPurpose: '',
      status: '',
      dateRange: []
    });
    setActiveStatusFilter('all');
    setFilteredData(data);
  };

  // 状态筛选处理
  const handleStatusFilter = (status: string) => {
    setActiveStatusFilter(status);
    // 立即应用筛选
    let filtered = [...data];

    if (searchParams.keyword) {
      filtered = filtered.filter(item =>
        item.reservationNo.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.exitPurpose) {
      filtered = filtered.filter(item => item.exitPurpose === searchParams.exitPurpose);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= new Date(startDate) && createTime <= new Date(endDate);
      });
    }

    // 应用状态筛选
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }

    setFilteredData(filtered);
  };

  // 获取状态统计
  const getStatusStats = () => {
    const stats = {
      all: data.length,
      pending: data.filter(item => item.status === 'pending').length,
      approved: data.filter(item => item.status === 'approved').length,
      rejected: data.filter(item => item.status === 'rejected').length
    };
    return stats;
  };

  // 查看详情
  const handleViewDetail = (record: ExitReservation) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 监听数据变化，自动更新筛选结果
  useEffect(() => {
    let filtered = [...data];

    if (searchParams.keyword) {
      filtered = filtered.filter(item =>
        item.reservationNo.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    if (searchParams.exitPurpose) {
      filtered = filtered.filter(item => item.exitPurpose === searchParams.exitPurpose);
    }

    if (searchParams.status) {
      filtered = filtered.filter(item => item.status === searchParams.status);
    }

    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const [startDate, endDate] = searchParams.dateRange;
      filtered = filtered.filter(item => {
        const createTime = new Date(item.createTime);
        return createTime >= new Date(startDate) && createTime <= new Date(endDate);
      });
    }

    // 应用状态筛选
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === activeStatusFilter);
    }

    setFilteredData(filtered);
  }, [data, searchParams, activeStatusFilter]);

  // 通过预约
  const handleApprove = (record: ExitReservation) => {
    // 检查是否需要改装或洗箱
    if (record.needCleaning || record.needModification) {
      setCurrentRecord(record);
      setCreateWorkOrders({
        cleaning: record.needCleaning,
        modification: record.needModification
      });
      setApproveModalVisible(true);
    } else {
      // 直接通过
      approveReservation(record);
    }
  };

  // 执行通过预约操作
  const approveReservation = (record: ExitReservation) => {
    const updatedData = data.map(item =>
      item.id === record.id ? { ...item, status: 'approved' as const } : item
    );
    setData(updatedData);
    Message.success('预约已通过');
  };

  // 确认通过并创建施工单
  const handleConfirmApprove = () => {
    if (!currentRecord) return;

    // 模拟创建施工单
    const workOrderPromises = [];

    if (createWorkOrders.cleaning) {
      workOrderPromises.push(
        new Promise(resolve => {
          setTimeout(() => {
            const cleaningOrderNo = `CWO${String(Date.now()).slice(-6)}`;
            Message.success(`洗箱工作单已创建：${cleaningOrderNo}`);
            resolve(cleaningOrderNo);
          }, 500);
        })
      );
    }

    if (createWorkOrders.modification) {
      workOrderPromises.push(
        new Promise(resolve => {
          setTimeout(() => {
            const modificationOrderNo = `MWO${String(Date.now()).slice(-6)}`;
            Message.success(`改装工作单已创建：${modificationOrderNo}`);
            resolve(modificationOrderNo);
          }, 800);
        })
      );
    }

    // 等待所有工作单创建完成后通过预约
    Promise.all(workOrderPromises).then(() => {
      approveReservation(currentRecord);
      setApproveModalVisible(false);
    });
  };

  // 拒绝预约
  const handleReject = (record: ExitReservation) => {
    const updatedData = data.map(item =>
      item.id === record.id ? { ...item, status: 'rejected' as const } : item
    );
    setData(updatedData);
    Message.success('预约已拒绝');
  };

  // 改预约时间
  const handleReschedule = (record: ExitReservation) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      pickupTime: record.pickupTime
    });
    setRescheduleModalVisible(true);
  };

  // 保存改期
  const handleSaveReschedule = async () => {
    try {
      const values = await form.validate();
      const updatedData = data.map(item =>
        item.id === currentRecord?.id 
          ? { ...item, pickupTime: values.pickupTime }
          : item
      );
      setData(updatedData);
      setRescheduleModalVisible(false);
      Message.success('预约时间已更新');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取出场目的标签
  const getExitPurposeText = (purpose: string) => {
    const purposeMap = {
      pickup: '提箱',
      empty_return: '空箱回收',
      after_repair: '修理后提箱',
      after_cleaning: '清洗后提箱',
      after_modification: '改装后提箱',
      other: '其他'
    };
    return purposeMap[purpose as keyof typeof purposeMap] || purpose;
  };

  // 箱号显示组件（参考进场预约的显示方式）
  const ContainerNumbersDisplay: React.FC<{ containerNumbers: string[] }> = ({ containerNumbers }) => {
    if (containerNumbers.length === 0) {
      return <span style={{ color: '#999' }}>-</span>;
    }

    if (containerNumbers.length === 1) {
      return (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>
          {containerNumbers[0]}
        </span>
      );
    }

    const firstContainer = containerNumbers[0];
    const remainingCount = containerNumbers.length - 1;

    const tooltipContent = (
      <div style={{ maxWidth: '300px' }}>
        <div style={{ 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#1D2129',
          fontSize: '13px'
        }}>
          全部箱号 ({containerNumbers.length}个)：
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          {containerNumbers.map((container, index) => (
            <div 
              key={index} 
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '12px',
                padding: '4px 8px',
                backgroundColor: '#165DFF',
                color: 'white',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              {container}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <Tooltip 
        content={tooltipContent} 
        position="top"
        color="white"
        style={{
          backgroundColor: 'white',
          color: '#1D2129',
          border: '1px solid #E5E6EB',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <span style={{ 
          fontFamily: 'monospace', 
          fontSize: '13px',
          cursor: 'pointer',
          borderBottom: '1px dashed #165DFF'
        }}>
          {firstContainer}
          <Tag 
            color="blue" 
            size="small" 
            style={{ 
              marginLeft: '6px', 
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            +{remainingCount}
          </Tag>
        </span>
      </Tooltip>
    );
  };

  // 更多操作菜单
  const getMoreDropdown = (record: ExitReservation) => (
    <Dropdown
      droplist={
        <div style={{ 
          padding: '4px 0',
          backgroundColor: 'white',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e6eb',
          minWidth: '120px'
        }}>
          <div 
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer',
              borderRadius: '4px',
              margin: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f3f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => handleReject(record)}
          >
            <IconClose style={{ marginRight: '8px', color: '#f53f3f' }} />
            拒绝
          </div>
          <div 
            style={{ 
              padding: '8px 12px', 
              cursor: 'pointer',
              borderRadius: '4px',
              margin: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f3f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => handleReschedule(record)}
          >
            <IconCalendar style={{ marginRight: '8px', color: '#165DFF' }} />
            改预约时间
          </div>
        </div>
      }
      position="bottom"
      trigger="click"
    >
      <Button type="text" icon={<IconMore />} size="small">
        更多
      </Button>
    </Dropdown>
  );

  // 表格列定义
  const columns = [
    {
      title: '预约流水号',
      dataIndex: 'reservationNo',
      key: 'reservationNo',
      width: 160,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 180
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 100
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 130,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: '出场目的',
      dataIndex: 'exitPurpose',
      key: 'exitPurpose',
      width: 100,
      render: (text: string) => (
        <Tag color="purple">{getExitPurposeText(text)}</Tag>
      )
    },
    {
      title: '是否需要洗箱',
      dataIndex: 'needCleaning',
      key: 'needCleaning',
      width: 120,
      render: (needCleaning: boolean) => (
        <Tag color={needCleaning ? 'green' : 'gray'}>
          {needCleaning ? '需要' : '不需要'}
        </Tag>
      )
    },
    {
      title: '是否需要改装',
      dataIndex: 'needModification',
      key: 'needModification',
      width: 120,
      render: (needModification: boolean) => (
        <Tag color={needModification ? 'orange' : 'gray'}>
          {needModification ? '需要' : '不需要'}
        </Tag>
      )
    },
    {
      title: '箱号',
      dataIndex: 'containerNumbers',
      key: 'containerNumbers',
      width: 160,
      render: (containerNumbers: string[]) => (
        <ContainerNumbersDisplay containerNumbers={containerNumbers} />
      )
    },
    {
      title: '预约提箱时间',
      dataIndex: 'pickupTime',
      key: 'pickupTime',
      width: 160
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: ExitReservation) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<IconEye />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <Button
              type="text"
              size="small"
              status="success"
              icon={<IconCheck />}
              onClick={() => handleApprove(record)}
            >
              通过
            </Button>
          )}
          {record.status === 'pending' && getMoreDropdown(record)}
        </Space>
      )
    }
  ];

  const stats = getStatusStats();

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <Title heading={4} style={{ margin: 0 }}>出场预约管理</Title>
      </div>

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeStatusFilter === 'all' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
          onClick={() => handleStatusFilter('all')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.all}</div>
            <div className="text-sm text-gray-600">全部预约</div>
          </div>
        </div>
        
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeStatusFilter === 'pending' 
              ? 'border-orange-500 bg-orange-50' 
              : 'border-gray-200 bg-white hover:border-orange-300'
          }`}
          onClick={() => handleStatusFilter('pending')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">待审核</div>
          </div>
        </div>
        
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeStatusFilter === 'approved' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 bg-white hover:border-green-300'
          }`}
          onClick={() => handleStatusFilter('approved')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">已通过</div>
          </div>
        </div>
        
        <div 
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            activeStatusFilter === 'rejected' 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-200 bg-white hover:border-red-300'
          }`}
          onClick={() => handleStatusFilter('rejected')}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">已拒绝</div>
          </div>
        </div>
      </div>

      {/* 搜索表单 */}
      <Card className="mb-6">
        <Row gutter={24}>
          <Col span={6}>
            <Input
              placeholder="搜索预约流水号、客户名称、联系人"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams({ ...searchParams, keyword: value })}
              allowClear
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder="出场目的"
              value={searchParams.exitPurpose}
              onChange={(value) => setSearchParams({ ...searchParams, exitPurpose: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="提箱">提箱</Option>
              <Option value="空箱回收">空箱回收</Option>
              <Option value="修理后提箱">修理后提箱</Option>
              <Option value="清洗后提箱">清洗后提箱</Option>
              <Option value="改装后提箱">改装后提箱</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Col>
          <Col span={5}>
            <Select
              placeholder="状态"
              value={searchParams.status}
              onChange={(value) => setSearchParams({ ...searchParams, status: value })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={searchParams.dateRange}
              onChange={(dateRange) => setSearchParams({ ...searchParams, dateRange })}
            />
          </Col>
          <Col span={2}>
            <Space>
              <Button icon={<IconSearch />} type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<IconRefresh />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 操作栏 */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <Space>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={() => navigate('/exit-reservation/create')}
            >
              新增出场预约
            </Button>
            <Button 
              icon={<IconDownload />}
              onClick={() => setExportModalVisible(true)}
            >
              导出数据
            </Button>
          </Space>
          <div className="text-sm text-gray-500">
            共 {filteredData.length} 条记录
          </div>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          data={filteredData}
          pagination={{
            showTotal: true,
            showJumper: true,
            sizeCanChange: true,
            pageSizeChangeResetCurrent: true,
          }}
          scroll={{ x: 1600 }}
          stripe
        />
      </Card>

      {/* 预约详情弹窗 */}
      <Modal
        title="出场预约详情"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        style={{ width: '800px' }}
      >
        {currentRecord && (
          <div className="space-y-4">
            <Row gutter={24}>
              <Col span={12}>
                <div><strong>预约流水号：</strong>{currentRecord.reservationNo}</div>
              </Col>
              <Col span={12}>
                <div><strong>状态：</strong>{getStatusTag(currentRecord.status)}</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div><strong>客户名称：</strong>{currentRecord.customerName}</div>
              </Col>
              <Col span={12}>
                <div><strong>联系人：</strong>{currentRecord.contactPerson}</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div><strong>联系电话：</strong>{currentRecord.contactPhone}</div>
              </Col>
              <Col span={12}>
                <div><strong>出场目的：</strong>{currentRecord.exitPurpose}</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <div><strong>是否需要洗箱：</strong>
                  <Tag color={currentRecord.needCleaning ? 'green' : 'gray'}>
                    {currentRecord.needCleaning ? '需要' : '不需要'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div><strong>是否需要改装：</strong>
                  <Tag color={currentRecord.needModification ? 'orange' : 'gray'}>
                    {currentRecord.needModification ? '需要' : '不需要'}
                  </Tag>
                </div>
              </Col>
            </Row>
            <div>
              <strong>箱号：</strong>
              <div className="mt-2">
                <ContainerNumbersDisplay containerNumbers={currentRecord.containerNumbers} />
              </div>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <div><strong>预约提箱时间：</strong>{currentRecord.pickupTime}</div>
              </Col>
              <Col span={12}>
                <div><strong>创建时间：</strong>{currentRecord.createTime}</div>
              </Col>
            </Row>
            {currentRecord.remark && (
              <div>
                <strong>备注：</strong>{currentRecord.remark}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 改期弹窗 */}
      <Modal
        title="修改预约时间"
        visible={rescheduleModalVisible}
        onOk={handleSaveReschedule}
        onCancel={() => setRescheduleModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="预约提箱时间"
            field="pickupTime"
            rules={[{ required: true, message: '请选择预约提箱时间' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 通过预约确认弹窗 */}
      <Modal
        title="通过预约确认"
        visible={approveModalVisible}
        onOk={handleConfirmApprove}
        onCancel={() => setApproveModalVisible(false)}
        style={{ width: '500px' }}
      >
        {currentRecord && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 font-medium">📋 预约信息</span>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>预约流水号：</strong>{currentRecord.reservationNo}</div>
                <div><strong>客户名称：</strong>{currentRecord.customerName}</div>
                <div><strong>箱号数量：</strong>{currentRecord.containerNumbers.length}个</div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-orange-600 font-medium">⚠️ 该预约需要额外服务</span>
              </div>
              
              <div className="space-y-3">
                {currentRecord.needCleaning && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">🧽</span>
                      <div>
                        <div className="font-medium">洗箱服务</div>
                        <div className="text-sm text-gray-500">需要创建洗箱工作单</div>
                      </div>
                    </div>
                    <Tag color="green">需要</Tag>
                  </div>
                )}

                {currentRecord.needModification && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <span className="text-orange-600 mr-2">🔧</span>
                      <div>
                        <div className="font-medium">改装服务</div>
                        <div className="text-sm text-gray-500">需要创建改装工作单</div>
                      </div>
                    </div>
                    <Tag color="orange">需要</Tag>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center text-sm text-gray-600">
                <span className="font-medium">确认通过该预约吗？</span>
                <br />
                系统将自动创建相应的施工单，并通过该出场预约。
              </div>
            </div>
                     </div>
         )}
       </Modal>

      {/* 导出数据邮件弹窗 */}
      <Modal
        title="施工单逾期提醒邮件"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setExportModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="send" 
            type="primary"
            onClick={() => {
              setExportModalVisible(false);
              setWechatModalVisible(true);
            }}
          >
            发送邮件
          </Button>
        ]}
        style={{ width: '700px' }}
      >
        <div className="bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* 邮件头部 */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">📧</span>
                <span className="text-lg font-semibold text-gray-800">逾期提醒邮件</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleString('zh-CN')}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div><strong>发件人：</strong> 集装箱管理系统 &lt;system@container.com&gt;</div>
              <div><strong>收件人：</strong> 施工部门 &lt;construction@company.com&gt;</div>
              <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                <div className="text-red-800 font-semibold">
                  <span className="mr-2">⚠️</span>
                  主题：施工单逾期提醒--工单号CWO{String(Date.now()).slice(-6)}
                </div>
              </div>
            </div>
          </div>

          {/* 邮件正文 */}
          <div className="space-y-4">
            <div className="text-gray-800">
              <p className="mb-4">尊敬的施工部门：</p>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center mb-3">
                  <span className="text-orange-600 text-xl mr-2">⏰</span>
                  <span className="text-orange-800 font-semibold text-lg">紧急提醒</span>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  以下施工单已临近提箱日，即将逾期，请尽快完成：
                </p>

                {/* 逾期工单列表 */}
                <div className="space-y-3">
                  {[
                    { 
                      workOrderNo: `CWO${String(Date.now()).slice(-6)}`, 
                      type: '洗箱工作单', 
                      containerNo: 'EXIT000001',
                      deadline: '2024-12-25 18:00',
                      customer: '上海远洋运输有限公司',
                      urgency: 'high'
                    },
                    { 
                      workOrderNo: `MWO${String(Date.now() + 1000).slice(-6)}`, 
                      type: '改装工作单', 
                      containerNo: 'EXIT000002',
                      deadline: '2024-12-26 10:00',
                      customer: '中远海运集装箱运输有限公司',
                      urgency: 'medium'
                    },
                    { 
                      workOrderNo: `RWO${String(Date.now() + 2000).slice(-6)}`, 
                      type: '修箱工作单', 
                      containerNo: 'EXIT000003',
                      deadline: '2024-12-26 16:00',
                      customer: '马士基航运',
                      urgency: 'high'
                    }
                  ].map((order, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded border-l-4 ${
                        order.urgency === 'high' 
                          ? 'bg-red-50 border-red-400' 
                          : 'bg-yellow-50 border-yellow-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className={`mr-2 ${
                              order.urgency === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {order.urgency === 'high' ? '🔴' : '🟡'}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {order.workOrderNo} - {order.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><strong>箱号：</strong>{order.containerNo}</div>
                            <div><strong>客户：</strong>{order.customer}</div>
                            <div className={`font-medium ${
                              order.urgency === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              <strong>截止时间：</strong>{order.deadline}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Tag color={order.urgency === 'high' ? 'red' : 'orange'}>
                            {order.urgency === 'high' ? '高优先级' : '中优先级'}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">💡</span>
                  <span className="font-semibold text-blue-800">温馨提示</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1 ml-6">
                  <li>• 请优先处理高优先级工单</li>
                  <li>• 如有延期需求，请提前申请</li>
                  <li>• 完成后请及时在系统中更新状态</li>
                  <li>• 如有疑问，请联系调度中心</li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t text-sm text-gray-600">
                <p>谢谢您的配合！</p>
                <br />
                <p>此致</p>
                <p className="font-semibold">集装箱管理系统</p>
                <p className="text-xs text-gray-500 mt-2">
                  * 这是系统自动生成的邮件，请勿直接回复
                </p>
              </div>
            </div>
          </div>
                 </div>
       </Modal>

      {/* 微信推送卡片弹窗 */}
      <Modal
        title={null}
        visible={wechatModalVisible}
        onCancel={() => setWechatModalVisible(false)}
        footer={null}
        style={{ width: '320px' }}
      >
        {/* 简单的微信推送卡片 */}
        <div className="bg-white rounded-lg" style={{ margin: '-20px', fontFamily: 'PingFang SC, sans-serif' }}>
          {/* 卡片头部 */}
          <div className="flex items-center p-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚠️</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">施工单逾期提醒</div>
              <div className="text-xs text-gray-500">集装箱管理系统</div>
            </div>
            <div className="text-xs text-gray-400">刚刚</div>
          </div>

          {/* 卡片内容 */}
          <div className="p-4">
            <div className="text-sm text-gray-700 mb-3">
              工单号: CWO{String(Date.now()).slice(-6)}
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              以下施工单已临近提箱日，即将逾期，请尽快完成
            </div>
          </div>

          {/* 底部操作 */}
          <div className="flex border-t border-gray-100">
            <button 
              className="flex-1 py-3 text-center text-sm text-gray-600"
              onClick={() => setWechatModalVisible(false)}
            >
              知道了
            </button>
            <div className="w-px bg-gray-100"></div>
            <button className="flex-1 py-3 text-center text-sm text-blue-600">
              查看详情
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExitReservationPage; 