import React, { useState } from 'react';
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
  Tooltip,
  Checkbox
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconEdit,
  IconDelete,
  IconDownload
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 调拨指令数据接口
interface TransferOrder {
  id: string;
  transferOrderNo: string;
  containerNumbers: string[];
  fromYard: string;
  toYard: string;
  transferPurpose: string;
  createTime: string;
  status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  creator: string;
  approver?: string;
  remark?: string;
}

// 搜索参数接口
interface SearchParams {
  transferOrderNo: string;
  fromYard: string;
  toYard: string;
  status: string;
  dateRange: string[];
}

const TransferOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState<TransferOrder | null>(null);

  // 模拟数据
  const mockData: TransferOrder[] = Array.from({ length: 20 }, (_, index) => {
    const containerCounts = [1, 2, 3, 4, 5];
    const containerCount = containerCounts[Math.floor(Math.random() * containerCounts.length)];
    const containerNumbers = Array.from({ length: containerCount }, (_, i) => 
      `CONT${String(index * 10 + i + 1).padStart(6, '0')}`
    );

    return {
      id: `TO${String(index + 1).padStart(6, '0')}`,
      transferOrderNo: `TO${String(index + 1).padStart(6, '0')}`,
      containerNumbers,
      fromYard: ['上海港洋山码头', '上海港外高桥码头', '宁波舟山港', '深圳港'][Math.floor(Math.random() * 4)],
      toYard: ['上海港洋山码头', '上海港外高桥码头', '宁波舟山港', '深圳港'][Math.floor(Math.random() * 4)],
      transferPurpose: ['修箱需要', '洗箱需要', '客户指定', '堆场整理', '其他'][Math.floor(Math.random() * 5)],
      createTime: `2024-12-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status: ['PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 5)] as TransferOrder['status'],
      creator: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
      approver: Math.random() > 0.3 ? ['管理员', '审核员', '主管'][Math.floor(Math.random() * 3)] : undefined,
      remark: Math.random() > 0.5 ? `调拨备注信息${index + 1}` : undefined
    };
  });

  const [data, setData] = useState<TransferOrder[]>(mockData);
  const [filteredData, setFilteredData] = useState<TransferOrder[]>(mockData);

  // 搜索处理
  const handleSearch = async () => {
    try {
      const values = await form.validate();
      setLoading(true);
      
      // 模拟搜索延迟
      setTimeout(() => {
        let filtered = [...data];
        
        if (values.transferOrderNo) {
          filtered = filtered.filter(item => 
            item.transferOrderNo.toLowerCase().includes(values.transferOrderNo.toLowerCase())
          );
        }
        
        if (values.fromYard) {
          filtered = filtered.filter(item => item.fromYard === values.fromYard);
        }
        
        if (values.toYard) {
          filtered = filtered.filter(item => item.toYard === values.toYard);
        }
        
        if (values.status) {
          filtered = filtered.filter(item => item.status === values.status);
        }
        
        if (values.dateRange && values.dateRange.length === 2) {
          const [startDate, endDate] = values.dateRange;
          filtered = filtered.filter(item => {
            const createTime = new Date(item.createTime);
            return createTime >= new Date(startDate) && createTime <= new Date(endDate);
          });
        }
        
        setFilteredData(filtered);
        setLoading(false);
        Message.success(`找到 ${filtered.length} 条记录`);
      }, 500);
    } catch (error) {
      setLoading(false);
      console.error('搜索失败:', error);
    }
  };

  // 重置搜索
  const handleReset = () => {
    form.resetFields();
    setFilteredData(data);
    Message.info('已重置搜索条件');
  };

  // 新增调拨指令
  const handleAdd = () => {
    navigate('/smartainer/transfer-orders/create');
  };

  // 编辑调拨指令
  const handleEdit = (record: TransferOrder) => {
    navigate(`/smartainer/transfer-orders/edit/${record.id}`);
  };

  // 删除确认
  const handleDeleteConfirm = (record: TransferOrder) => {
    setDeleteItem(record);
    setDeleteModalVisible(true);
  };

  // 执行删除
  const handleDelete = () => {
    if (deleteItem) {
      const newData = data.filter(item => item.id !== deleteItem.id);
      setData(newData);
      setFilteredData(newData.filter(item => 
        filteredData.some(filtered => filtered.id === item.id)
      ));
      Message.success('删除成功');
    }
    setDeleteModalVisible(false);
    setDeleteItem(null);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要删除的记录');
      return;
    }
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`,
      onOk: () => {
        const newData = data.filter(item => !selectedRowKeys.includes(item.id));
        setData(newData);
        setFilteredData(newData);
        setSelectedRowKeys([]);
        Message.success('批量删除成功');
      }
    });
  };

  // 获取状态标签
  const getStatusTag = (status: TransferOrder['status']) => {
    const statusConfig = {
      PENDING: { color: 'orange', text: '待审核' },
      APPROVED: { color: 'blue', text: '已审核' },
      IN_PROGRESS: { color: 'cyan', text: '调拨中' },
      COMPLETED: { color: 'green', text: '已完成' },
      CANCELLED: { color: 'red', text: '已取消' }
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
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

  // 表格列定义
  const columns = [
    {
      title: '调拨单号',
      dataIndex: 'transferOrderNo',
      key: 'transferOrderNo',
      width: 140,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
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
      title: '调出堆场',
      dataIndex: 'fromYard',
      key: 'fromYard',
      width: 150
    },
    {
      title: '调入堆场',
      dataIndex: 'toYard',
      key: 'toYard',
      width: 150
    },
    {
      title: '调拨目的',
      dataIndex: 'transferPurpose',
      key: 'transferPurpose',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TransferOrder['status']) => getStatusTag(status)
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: TransferOrder) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            status="danger"
            icon={<IconDelete />}
            onClick={() => handleDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  // 分页配置
  const pagination = {
    showTotal: true,
    total: filteredData.length,
    pageSize: 10,
    current: 1,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
  };

  return (
    <div className="p-6">
      {/* 搜索区域 */}
      <Card className="mb-4">
        <Form form={form} layout="horizontal">
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="调拨单号" field="transferOrderNo">
                <Input placeholder="请输入调拨单号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="调出堆场" field="fromYard">
                <Select placeholder="请选择调出堆场" allowClear>
                  <Option value="上海港洋山码头">上海港洋山码头</Option>
                  <Option value="上海港外高桥码头">上海港外高桥码头</Option>
                  <Option value="宁波舟山港">宁波舟山港</Option>
                  <Option value="深圳港">深圳港</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="调入堆场" field="toYard">
                <Select placeholder="请选择调入堆场" allowClear>
                  <Option value="上海港洋山码头">上海港洋山码头</Option>
                  <Option value="上海港外高桥码头">上海港外高桥码头</Option>
                  <Option value="宁波舟山港">宁波舟山港</Option>
                  <Option value="深圳港">深圳港</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" field="status">
                <Select placeholder="请选择状态" allowClear>
                  <Option value="PENDING">待审核</Option>
                  <Option value="APPROVED">已审核</Option>
                  <Option value="IN_PROGRESS">调拨中</Option>
                  <Option value="COMPLETED">已完成</Option>
                  <Option value="CANCELLED">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="创建时间" field="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Space>
                <Button icon={<IconRefresh />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<IconSearch />} loading={loading} onClick={handleSearch}>
                  搜索
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增调拨指令
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button status="danger" icon={<IconDelete />} onClick={handleBatchDelete}>
                批量删除
              </Button>
            )}
            <Button icon={<IconDownload />}>
              导出数据
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          data={filteredData}
          loading={loading}
          pagination={pagination}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys as string[]);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteItem(null);
        }}
        okButtonProps={{ status: 'danger' }}
      >
        <p>确定要删除调拨指令 "{deleteItem?.transferOrderNo}" 吗？</p>
        <p style={{ color: '#999', fontSize: '12px' }}>删除后无法恢复，请谨慎操作。</p>
      </Modal>
    </div>
  );
};

export default TransferOrderPage; 