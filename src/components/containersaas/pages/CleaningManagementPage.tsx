import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Message,
  Typography,
  Modal
} from '@arco-design/web-react';
import {
  IconPlus,
  IconSearch,
  IconRefresh,
  IconDelete,
  IconEdit
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 工作单状态选项
const statusOptions = [
  { value: 'DRAFT', label: '草稿', color: 'gray' },
  { value: 'PENDING', label: '待施工', color: 'orange' },
  { value: 'COMPLETED', label: '施工完成', color: 'green' },
  { value: 'CANCELLED', label: '撤销', color: 'red' }
];

// 模拟数据
const mockData = Array.from({ length: 20 }, (_, index) => ({
  id: `WO${String(index + 1).padStart(6, '0')}`,
  containerNo: `CONT${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
  yard: '上海港洋山码头',
  customer: '上海远洋运输有限公司',
  bookingNo: `BK${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
  blNo: `BL${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
  previousCargo: '大豆',
  status: statusOptions[Math.floor(Math.random() * statusOptions.length)].value,
  createTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  creator: '张三'
}));

const CleaningManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(mockData);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 搜索
  const handleSearch = async () => {
    try {
      const values = await form.validate();
      setLoading(true);
      // 模拟API调用
      setTimeout(() => {
        // 这里应该调用实际的搜索API
        setLoading(false);
        Message.success('搜索成功');
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setData(mockData);
  };

  // 新增工作单
  const handleAdd = () => {
    navigate('/smartainer/cleaning-management/add');
  };

  // 编辑工作单
  const handleEdit = (record: any) => {
    navigate(`/smartainer/cleaning-management/edit/${record.id}`);
  };

  // 删除工作单
  const handleDelete = (record: any) => {
    setSelectedRows([record]);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setData(data.filter(item => !selectedRows.find(row => row.id === item.id)));
      setDeleteModalVisible(false);
      setSelectedRows([]);
      setLoading(false);
      Message.success('删除成功');
    }, 1000);
  };

  // 表格列定义
  const columns = [
    {
      title: '工作单编号',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: '箱号',
      dataIndex: 'containerNo',
      width: 120,
    },
    {
      title: '施工堆场',
      dataIndex: 'yard',
      width: 180,
    },
    {
      title: '委托客户',
      dataIndex: 'customer',
      width: 180,
    },
    {
      title: '订舱号',
      dataIndex: 'bookingNo',
      width: 120,
    },
    {
      title: '提单号',
      dataIndex: 'blNo',
      width: 120,
    },
    {
      title: '前装货',
      dataIndex: 'previousCargo',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? (
          <Tag color={option.color}>{option.label}</Tag>
        ) : null;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      render: (time: string) => new Date(time).toLocaleString()
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
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
            status="danger"
            size="small"
            icon={<IconDelete />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card>
        {/* 搜索表单 */}
        <Form
          form={form}
          layout="inline"
          style={{ marginBottom: '24px' }}
        >
          <Form.Item field="id" label="工作单编号">
            <Input placeholder="请输入工作单编号" allowClear />
          </Form.Item>
          <Form.Item field="containerNo" label="箱号">
            <Input placeholder="请输入箱号" allowClear />
          </Form.Item>
          <Form.Item field="status" label="状态">
            <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item field="createTime" label="创建时间">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<IconSearch />}
                onClick={handleSearch}
                loading={loading}
              >
                搜索
              </Button>
              <Button
                icon={<IconRefresh />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 操作按钮 */}
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={handleAdd}
            >
              新增工作单
            </Button>
            {selectedRows.length > 0 && (
              <Button
                status="danger"
                icon={<IconDelete />}
                onClick={() => setDeleteModalVisible(true)}
              >
                批量删除
              </Button>
            )}
          </Space>
        </div>

        {/* 数据表格 */}
        <Table
          rowKey="id"
          columns={columns}
          data={data}
          loading={loading}
          border={false}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRows(selectedRows);
            }
          }}
          pagination={{
            total: data.length,
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeOptions: [10, 20, 50, 100]
          }}
        />
      </Card>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        visible={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <p>确定要删除选中的工作单吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default CleaningManagementPage; 