import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Select,
  DatePicker,
  Card,
  Typography,
  Tag,
  Modal,
  Upload,
  Message,
  Progress,
  Switch,
  Grid,
  Input
} from '@arco-design/web-react';
import {
  IconSearch,
  IconPlus,
  IconUpload,
  IconDownload,
  IconEdit,
  IconDelete,
  IconRefresh,
  IconRobot,
  IconList,
  IconDragDotVertical
} from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';

const { Title } = Typography;
const { Option } = Select;
const { Row, Col } = Grid;

interface ContainerDataItem {
  key: string;
  containerNo: string;
  containerType: string;
  attributes: string;
  latestStatus: string;
  location: string;
  owner: string;
  tareWeight: string; // Assuming string, can be number
  maxPayload: string; // Assuming string, can be number
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

// AI Recognition and Custom Table Column Visibility states (similar to FclRates)
type RecognitionStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

const ContainerManagementPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recognitionStatus, setRecognitionStatus] = useState<RecognitionStatus>('idle');
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);

  const initialColumnVisibility = {
    containerNo: true,
    containerType: true,
    attributes: true,
    latestStatus: true,
    location: true,
    owner: true,
    tareWeight: true,
    maxPayload: true,
    createdBy: true,
    createdTime: true,
    updatedBy: true,
    updatedTime: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // Modal handlers
  const openAiModal = () => {
    setAiModalVisible(true);
    setRecognitionStatus('idle');
    setUploadProgress(0);
  };
  const closeAiModal = () => setAiModalVisible(false);
  const openCustomTableModal = () => setCustomTableModalVisible(true);
  const closeCustomTableModal = () => setCustomTableModalVisible(false);

  const handleFileUpload = () => {
    // Mock AI recognition
    setRecognitionStatus('uploading');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setUploadProgress(progress);
      }
      if (progress >= 100) {
        clearInterval(interval);
        setRecognitionStatus('processing');
        setTimeout(() => {
          setRecognitionStatus('success');
          Message.success('AI识别完成');
        }, 1500);
      }
    }, 200);
  };

  const handleColumnVisibilityChange = (column: keyof typeof columnVisibility, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [column]: visible }));
  };

  const resetColumnVisibility = () => setColumnVisibility(initialColumnVisibility);

  const applyColumnSettings = () => {
    Message.success('表格设置已应用');
    closeCustomTableModal();
  };

  const columns = [
    { title: '箱号', dataIndex: 'containerNo', sorter: true, resizable: true, hidden: !columnVisibility.containerNo },
    { title: '箱型', dataIndex: 'containerType', sorter: true, resizable: true, hidden: !columnVisibility.containerType },
    { title: '属性', dataIndex: 'attributes', sorter: true, resizable: true, hidden: !columnVisibility.attributes },
    { title: '最新状态', dataIndex: 'latestStatus', sorter: true, resizable: true, hidden: !columnVisibility.latestStatus, render: (status: string) => <Tag color={status === '可用' ? 'blue' : 'orangered'}>{status}</Tag> },
    { title: '位置', dataIndex: 'location', sorter: true, resizable: true, hidden: !columnVisibility.location },
    { title: '箱主', dataIndex: 'owner', sorter: true, resizable: true, hidden: !columnVisibility.owner },
    { title: '皮重 (KG)', dataIndex: 'tareWeight', sorter: true, resizable: true, hidden: !columnVisibility.tareWeight },
    { title: '最大载重 (KG)', dataIndex: 'maxPayload', sorter: true, resizable: true, hidden: !columnVisibility.maxPayload },
    { title: '创建人', dataIndex: 'createdBy', sorter: true, resizable: true, hidden: !columnVisibility.createdBy },
    { title: '创建时间', dataIndex: 'createdTime', sorter: true, resizable: true, hidden: !columnVisibility.createdTime },
    { title: '更新人', dataIndex: 'updatedBy', sorter: true, resizable: true, hidden: !columnVisibility.updatedBy },
    { title: '更新时间', dataIndex: 'updatedTime', sorter: true, resizable: true, hidden: !columnVisibility.updatedTime },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 180,
      render: (_: any) => (
        <Space>
          <Button type="text" size="mini" icon={<IconSearch />}>查看</Button>
          <Button type="text" size="mini" icon={<IconEdit />}>编辑</Button>
          <Button type="text" size="mini" icon={<IconDelete />}>复制</Button>
        </Space>
      ),
    },
  ].filter(col => !col.hidden);

  const data: ContainerDataItem[] = Array(5).fill(null).map((_, index) => ({
    key: `${index}`,
    containerNo: `CONU123456${index}`,
    containerType: '20GP',
    attributes: '普通',
    latestStatus: index % 2 === 0 ? '可用' : '维修中',
    location: `堆场A${index + 1}区`,
    owner: '中远海运',
    tareWeight: '2200',
    maxPayload: '21800',
    createdBy: '张三',
    createdTime: '2023-01-15 10:30',
    updatedBy: '李四',
    updatedTime: '2023-01-20 14:00',
  }));

  const pagination = { showTotal: true, total: data.length, pageSize: 10, current: 1, showJumper: true };

  const columnNamesMap: Record<keyof typeof initialColumnVisibility, string> = {
    containerNo: '箱号',
    containerType: '箱型',
    attributes: '属性',
    latestStatus: '最新状态',
    location: '位置',
    owner: '箱主',
    tareWeight: '皮重',
    maxPayload: '最大承重',
    createdBy: '创建人',
    createdTime: '创建时间',
    updatedBy: '更新人',
    updatedTime: '更新时间',
  };

  return (
    // Assuming this page is rendered within ContainerLayout which provides the overall structure
    <>
      {/* 筛选区 */}
      <Card className="mb-4">
        <Title heading={6} className="mb-4">筛选条件</Title>
        <Row gutter={24}>
          <Col span={6}><Input addBefore="箱号" placeholder="请输入箱号" allowClear /></Col>
          <Col span={6}>
            <Select addBefore="箱型" placeholder="请选择箱型" style={{ width: '100%' }} allowClear>
              <Option value="20GP">20GP</Option>
              <Option value="40GP">40GP</Option>
              <Option value="40HC">40HC</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select addBefore="状态" placeholder="请选择状态" style={{ width: '100%' }} allowClear>
              <Option value="available">可用</Option>
              <Option value="repair">维修中</Option>
            </Select>
          </Col>
           <Col span={6}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Col>
        </Row>
        <div className="flex justify-end mt-4">
          <Space>
            <Button type="primary" icon={<IconSearch />}>查询</Button>
            <Button icon={<IconRefresh />}>重置</Button>
          </Space>
        </div>
      </Card>

      {/* 按钮与表格 */}
      <Card>
        <div className="flex justify-between mb-4">
          <Space>
            <Button type="primary" icon={<IconPlus />}>新增集装箱</Button>
            <Button icon={<IconUpload />}>批量导入</Button>
            <Button icon={<IconDownload />}>导出列表</Button>
            <Button type="primary" icon={<IconRobot />} onClick={openAiModal} style={{ background: 'linear-gradient(45deg, #1890ff, #4dabf5)', border: 'none' }}>AI识别</Button>
          </Space>
          <div className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700" onClick={openCustomTableModal}>
            <IconList className="mr-1" />
            <span>自定义表格</span>
          </div>
        </div>
        <Table
          rowKey="key"
          loading={false}
          columns={columns}
          data={data}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          pagination={pagination}
          scroll={{ x: 1800 }}
          border={false}
          className="mt-4 inquiry-table-nowrap"
        />
        <div className="mt-2 text-gray-500 text-sm">共 {data.length} 条</div>
      </Card>

      {/* AI识别弹窗 */}
      <Modal
        title="AI智能识别"
        visible={aiModalVisible}
        onCancel={closeAiModal}
        footer={null}
        style={{ width: 580 }}
      >
        {recognitionStatus === 'idle' && (
          <Upload drag multiple={false} showUploadList={false} onChange={handleFileUpload} customRequest={() => { handleFileUpload(); return { abort: () => {} }; }}>
            <div className="p-12 text-center">
              <IconUpload style={{ fontSize: 48, color: 'var(--color-primary)' }} className="mb-4" />
              <div className="text-lg font-medium mb-2">点击或拖拽文件到此区域上传</div>
              <div className="text-gray-500">支持PDF、Word、Excel、图片等</div>
            </div>
          </Upload>
        )}
        {(recognitionStatus === 'uploading' || recognitionStatus === 'processing') && (
          <div className="p-10 text-center">
            <Progress percent={uploadProgress} status={recognitionStatus === 'processing' ? 'success' : 'normal'} style={{ marginBottom: 20 }} />
            <div className="text-lg font-medium">
              {recognitionStatus === 'uploading' ? '文件上传中...' : '智能识别处理中...'}
            </div>
          </div>
        )}
        {recognitionStatus === 'success' && (
          <div className="p-10 text-center">
            <IconCheckCircle style={{ fontSize: 60, color: 'var(--color-success-dark)' }} className="mb-4" />
            <div className="text-xl font-medium mb-2">识别成功</div>
            <div className="text-gray-600 mb-6">已提取运价信息，请在表格中查看。</div>
            <Button type="primary" onClick={closeAiModal}>完成</Button>
          </div>
        )}
        {recognitionStatus === 'error' && (
           <div className="p-10 text-center">
            <IconCloseCircle style={{ fontSize: 60, color: 'var(--color-danger-dark)' }} className="mb-4" />
            <div className="text-xl font-medium mb-2">识别失败</div>
            <div className="text-gray-600 mb-6">请检查文件格式或稍后重试。</div>
            <Space>
              <Button onClick={() => setRecognitionStatus('idle')}>重新上传</Button>
              <Button type="primary" onClick={closeAiModal}>关闭</Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* 自定义表格弹窗 */}
      <Modal
        title="表头设置"
        visible={customTableModalVisible}
        onCancel={closeCustomTableModal}
        style={{ width: 800 }}
        footer={[
          <Button key="reset" onClick={resetColumnVisibility} style={{ float: 'left' }}>重置</Button>,
          <Button key="cancel" onClick={closeCustomTableModal}>取消</Button>,
          <Button key="apply" type="primary" onClick={applyColumnSettings}>确认</Button>,
        ]}
      >
        <div className="p-4">
          <Row gutter={[16,16]}>
            {Object.keys(initialColumnVisibility).map((key) => (
              <Col span={8} key={key}>
                <div className="custom-column-item border border-gray-200 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IconDragDotVertical className="text-gray-400 mr-2 cursor-grab" />
                      <span>{columnNamesMap[key as keyof typeof columnVisibility]}</span>
                    </div>
                    <Switch
                      checked={columnVisibility[key as keyof typeof columnVisibility]}
                      onChange={(checked) => handleColumnVisibilityChange(key as keyof typeof columnVisibility, checked)}
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </>
  );
};

// Helper icons for Modal (if not already imported or available)
const IconCheckCircle = ({ style, className }: { style?: React.CSSProperties, className?: string }) => (
  <svg viewBox="0 0 1024 1024" style={style} className={className} fill="currentColor" width="1em" height="1em"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm0 962.4C264.7 962.4 61.6 759.3 61.6 512S264.7 61.6 512 61.6s450.4 203.1 450.4 450.4-203.1 450.4-450.4 450.4zM400.2 723.8c-11.6 0-22.4-4.4-30.8-12.7L160.7 508.8c-17-17-17-44.7 0-61.6s44.7-17 61.6 0l177.8 171.1 362.8-364.4c17-17 44.7-17 61.6 0s17 44.7 0 61.6L431 711.1c-8.3 8.3-19.2 12.7-30.8 12.7z"></path></svg>
);
const IconCloseCircle = ({ style, className }: { style?: React.CSSProperties, className?: string }) => (
  <svg viewBox="0 0 1024 1024" style={style} className={className} fill="currentColor" width="1em" height="1em"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm0 962.4C264.7 962.4 61.6 759.3 61.6 512S264.7 61.6 512 61.6s450.4 203.1 450.4 450.4-203.1 450.4-450.4 450.4zM649.9 374.1L512 512l-137.9-137.9c-17-17-44.7-17-61.6 0s-17 44.7 0 61.6L450.4 573.6l-137.9 137.9c-17 17-17 44.7 0 61.6s44.7 17 61.6 0L512 635.2l137.9 137.9c17 17 44.7 17 61.6 0s17-44.7 0-61.6L573.6 512l137.9-137.9c17-17 17-44.7 0-61.6s-44.7-17-61.6 0z"></path></svg>
);


export default ContainerManagementPage; 