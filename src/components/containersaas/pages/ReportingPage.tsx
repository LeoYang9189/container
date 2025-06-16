import React, { useState } from 'react';
import {
  Typography,
  Card,
  Button,
  Table,
  Space,
  Tabs,
  Statistic,
  Message,
  Spin,
  Tag,
  Divider,
  Grid
} from '@arco-design/web-react';
import {
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconFile,
  IconDesktop,
  IconBook,
  IconLocation,
  IconHome
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const TabPane = Tabs.TabPane;

// 报表类型枚举
enum ReportType {
  DAILY_INVENTORY = 'daily_inventory',
  LONG_STAY_CONTAINERS = 'long_stay_containers',
  REPAIR_WASH_CONTAINERS = 'repair_wash_containers',
  CONTAINER_FLOW = 'container_flow',
  YARD_UTILIZATION = 'yard_utilization'
}

// 报表配置
const REPORT_CONFIG = {
  [ReportType.DAILY_INVENTORY]: {
    title: '当日库存表',
    description: '显示各港口、堆场的集装箱库存情况',
    icon: <IconDesktop />
  },
  [ReportType.LONG_STAY_CONTAINERS]: {
    title: '长期滞留箱',
    description: '显示长期滞留在堆场的集装箱',
    icon: <IconCalendar />
  },
  [ReportType.REPAIR_WASH_CONTAINERS]: {
    title: '修洗箱统计',
    description: '显示修洗箱的统计报表',
    icon: <IconFile />
  },
  [ReportType.CONTAINER_FLOW]: {
    title: '集装箱流水',
    description: '显示集装箱进出港流水记录',
    icon: <IconBook />
  },
  [ReportType.YARD_UTILIZATION]: {
    title: '堆场利用率',
    description: '显示各堆场的利用率统计',
    icon: <IconHome />
  }
};

// 箱型枚举
enum ContainerType {
  GP20 = '20GP',
  GP40 = '40GP',
  HC40 = '40HC',
  GP45 = '45GP',
  RF20 = '20RF',
  RF40 = '40RF',
  OT20 = '20OT',
  OT40 = '40OT'
}

// 库存数据接口
interface InventoryData {
  key: string;
  port: string;
  yard: string;
  containerType: ContainerType;
  emptyCount: number;
  fullCount: number;
  totalCount: number;
  lastUpdated: string;
}

// 统计数据接口
interface InventorySummary {
  totalContainers: number;
  emptyContainers: number;
  fullContainers: number;
  totalYards: number;
}

// 修洗箱统计数据接口
interface RepairWashData {
  key: string;
  workOrderNo: string;
  containerNo: string;
  serviceType: '修箱' | '洗箱' | '改装';
  status: '待施工' | '施工中' | '已完成' | '已验收';
  customer: string;
  yard: string;
  startDate: string;
  completedDate?: string;
  cost: number;
  remark?: string;
}

// 修洗箱统计汇总接口
interface RepairWashSummary {
  totalOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  totalCost: number;
  avgCost: number;
}

const { Row, Col } = Grid;

const ReportingPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);
  const [repairWashData, setRepairWashData] = useState<RepairWashData[]>([]);
  const [repairWashSummary, setRepairWashSummary] = useState<RepairWashSummary | null>(null);
  const [activeTab, setActiveTab] = useState('byYard');

  // 模拟库存数据
  const mockInventoryData: InventoryData[] = [
    {
      key: '1',
      port: '上海港',
      yard: '长胜2堆场',
      containerType: ContainerType.GP20,
      emptyCount: 150,
      fullCount: 80,
      totalCount: 230,
      lastUpdated: '2024-02-01 16:30:00'
    },
    {
      key: '2',
      port: '上海港',
      yard: '长胜2堆场',
      containerType: ContainerType.GP40,
      emptyCount: 120,
      fullCount: 60,
      totalCount: 180,
      lastUpdated: '2024-02-01 16:30:00'
    },
    {
      key: '3',
      port: '上海港',
      yard: '东海物流园',
      containerType: ContainerType.GP20,
      emptyCount: 200,
      fullCount: 120,
      totalCount: 320,
      lastUpdated: '2024-02-01 16:25:00'
    },
    {
      key: '4',
      port: '上海港',
      yard: '东海物流园',
      containerType: ContainerType.GP40,
      emptyCount: 180,
      fullCount: 100,
      totalCount: 280,
      lastUpdated: '2024-02-01 16:25:00'
    },
    {
      key: '5',
      port: '上海港',
      yard: '东海物流园',
      containerType: ContainerType.HC40,
      emptyCount: 90,
      fullCount: 50,
      totalCount: 140,
      lastUpdated: '2024-02-01 16:25:00'
    },
    {
      key: '6',
      port: '宁波港',
      yard: '宝山重箱堆场',
      containerType: ContainerType.GP20,
      emptyCount: 180,
      fullCount: 90,
      totalCount: 270,
      lastUpdated: '2024-02-01 16:20:00'
    },
    {
      key: '7',
      port: '宁波港',
      yard: '宝山重箱堆场',
      containerType: ContainerType.GP40,
      emptyCount: 160,
      fullCount: 80,
      totalCount: 240,
      lastUpdated: '2024-02-01 16:20:00'
    },
    {
      key: '8',
      port: '宁波港',
      yard: '洋山港堆场',
      containerType: ContainerType.RF20,
      emptyCount: 30,
      fullCount: 20,
      totalCount: 50,
      lastUpdated: '2024-02-01 16:15:00'
    }
  ];

  // 模拟修洗箱统计数据
  const mockRepairWashData: RepairWashData[] = [
    {
      key: '1',
      workOrderNo: 'CWO240001',
      containerNo: 'CXDU1234567',
      serviceType: '洗箱',
      status: '已完成',
      customer: '上海远洋运输有限公司',
      yard: '长胜2堆场',
      startDate: '2024-02-01',
      completedDate: '2024-02-02',
      cost: 800,
      remark: '常规清洗'
    },
    {
      key: '2',
      workOrderNo: 'RWO240001',
      containerNo: 'MSCU9876543',
      serviceType: '修箱',
      status: '已验收',
      customer: '马士基航运',
      yard: '东海物流园',
      startDate: '2024-01-28',
      completedDate: '2024-01-30',
      cost: 2500,
      remark: '门锁损坏维修'
    },
    {
      key: '3',
      workOrderNo: 'MWO240001',
      containerNo: 'HLBU5555555',
      serviceType: '改装',
      status: '施工中',
      customer: '赫伯罗特',
      yard: '宝山重箱堆场',
      startDate: '2024-02-01',
      cost: 5000,
      remark: '加装冷藏设备'
    },
    {
      key: '4',
      workOrderNo: 'CWO240002',
      containerNo: 'COSU1111111',
      serviceType: '洗箱',
      status: '待施工',
      customer: '中远海运',
      yard: '长胜2堆场',
      startDate: '2024-02-03',
      cost: 600,
      remark: '轻度污染清洗'
    },
    {
      key: '5',
      workOrderNo: 'RWO240002',
      containerNo: 'PONU2222222',
      serviceType: '修箱',
      status: '已完成',
      customer: '东方海外',
      yard: '洋山港堆场',
      startDate: '2024-01-29',
      completedDate: '2024-01-31',
      cost: 1800,
      remark: '底板修复'
    },
    {
      key: '6',
      workOrderNo: 'CWO240003',
      containerNo: 'YMLU3333333',
      serviceType: '洗箱',
      status: '施工中',
      customer: '阳明海运',
      yard: '东海物流园',
      startDate: '2024-02-02',
      cost: 900,
      remark: '深度清洗除锈'
    },
    {
      key: '7',
      workOrderNo: 'MWO240002',
      containerNo: 'HJMU4444444',
      serviceType: '改装',
      status: '已完成',
      customer: '现代商船',
      yard: '宝山重箱堆场',
      startDate: '2024-01-25',
      completedDate: '2024-01-28',
      cost: 4200,
      remark: '加装通风设备'
    },
    {
      key: '8',
      workOrderNo: 'RWO240003',
      containerNo: 'EMCU5555555',
      serviceType: '修箱',
      status: '待施工',
      customer: '长荣海运',
      yard: '长胜2堆场',
      startDate: '2024-02-04',
      cost: 3200,
      remark: '侧壁损坏维修'
    }
  ];

  // 生成报表
  const generateReport = (reportType: ReportType) => {
    setLoading(true);
    setSelectedReportType(reportType);
    
    // 模拟API调用
    setTimeout(() => {
      if (reportType === ReportType.DAILY_INVENTORY) {
        setInventoryData(mockInventoryData);
        
        // 计算统计数据
        const summary: InventorySummary = {
          totalContainers: mockInventoryData.reduce((sum, item) => sum + item.totalCount, 0),
          emptyContainers: mockInventoryData.reduce((sum, item) => sum + item.emptyCount, 0),
          fullContainers: mockInventoryData.reduce((sum, item) => sum + item.fullCount, 0),
          totalYards: new Set(mockInventoryData.map(item => item.yard)).size
        };
        setInventorySummary(summary);
      } else if (reportType === ReportType.REPAIR_WASH_CONTAINERS) {
        setRepairWashData(mockRepairWashData);
        
        // 计算修洗箱统计数据
        const summary: RepairWashSummary = {
          totalOrders: mockRepairWashData.length,
          completedOrders: mockRepairWashData.filter(item => item.status === '已完成' || item.status === '已验收').length,
          inProgressOrders: mockRepairWashData.filter(item => item.status === '施工中').length,
          totalCost: mockRepairWashData.reduce((sum, item) => sum + item.cost, 0),
          avgCost: Math.round(mockRepairWashData.reduce((sum, item) => sum + item.cost, 0) / mockRepairWashData.length)
        };
        setRepairWashSummary(summary);
      }
      setLoading(false);
      Message.success('报表生成成功！');
    }, 1000);
  };

  // 导出报表
  const exportReport = () => {
    if (!inventoryData.length) {
      Message.warning('没有数据可导出');
      return;
    }
    
    // 模拟导出功能
    const csvContent = generateCSV();
    downloadCSV(csvContent, `库存报表_${new Date().toISOString().split('T')[0]}.csv`);
    Message.success('报表导出成功！');
  };

  // 生成CSV内容
  const generateCSV = () => {
    const headers = ['港口', '堆场', '箱型', '空箱数量', '重箱数量', '总计', '更新时间'];
    const rows = inventoryData.map(item => [
      item.port,
      item.yard,
      item.containerType,
      item.emptyCount,
      item.fullCount,
      item.totalCount,
      item.lastUpdated
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // 下载CSV文件
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 按堆场分组的表格列
  const yardColumns = [
    {
      title: '港口',
      dataIndex: 'port',
      width: 120,
      render: (port: string) => (
        <div className="flex items-center">
          <IconLocation className="mr-1 text-blue-500 w-3 h-3" />
          <span className="font-medium">{port}</span>
        </div>
      )
    },
    {
      title: '堆场',
      dataIndex: 'yard',
      width: 150,
      render: (yard: string) => (
        <div className="flex items-center">
          <IconHome className="mr-1 text-green-500 w-3 h-3" />
          <span>{yard}</span>
        </div>
      )
    },
    {
      title: '箱型',
      dataIndex: 'containerType',
      width: 100,
      render: (type: ContainerType) => (
        <Tag color="blue" size="small">{type}</Tag>
      )
    },
    {
      title: '空箱数量',
      dataIndex: 'emptyCount',
      width: 100,
      render: (count: number) => (
        <span className="text-orange-600 font-medium">{count}</span>
      )
    },
    {
      title: '重箱数量',
      dataIndex: 'fullCount',
      width: 100,
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      )
    },
    {
      title: '总计',
      dataIndex: 'totalCount',
      width: 100,
      render: (count: number) => (
        <span className="text-blue-600 font-bold">{count}</span>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdated',
      width: 160,
      render: (time: string) => (
        <div className="text-sm text-gray-500 flex items-center">
          <IconCalendar className="mr-1 w-3 h-3" />
          {time}
        </div>
      )
    }
  ];

  // 按港口汇总数据
  const getPortSummary = () => {
    const portMap = new Map();
    inventoryData.forEach(item => {
      const key = item.port;
      if (!portMap.has(key)) {
        portMap.set(key, {
          port: item.port,
          emptyCount: 0,
          fullCount: 0,
          totalCount: 0,
          yardCount: new Set()
        });
      }
      const summary = portMap.get(key);
      summary.emptyCount += item.emptyCount;
      summary.fullCount += item.fullCount;
      summary.totalCount += item.totalCount;
      summary.yardCount.add(item.yard);
    });
    
    return Array.from(portMap.values()).map((item, index) => ({
      key: index.toString(),
      ...item,
      yardCount: item.yardCount.size
    }));
  };

  // 按箱型汇总数据
  const getContainerTypeSummary = () => {
    const typeMap = new Map();
    inventoryData.forEach(item => {
      const key = item.containerType;
      if (!typeMap.has(key)) {
        typeMap.set(key, {
          containerType: item.containerType,
          emptyCount: 0,
          fullCount: 0,
          totalCount: 0
        });
      }
      const summary = typeMap.get(key);
      summary.emptyCount += item.emptyCount;
      summary.fullCount += item.fullCount;
      summary.totalCount += item.totalCount;
    });
    
    return Array.from(typeMap.values()).map((item, index) => ({
      key: index.toString(),
      ...item
    }));
  };

  // 港口汇总表格列
  const portSummaryColumns = [
    {
      title: '港口',
      dataIndex: 'port',
      render: (port: string) => (
        <div className="flex items-center">
          <IconLocation className="mr-1 text-blue-500 w-3 h-3" />
          <span className="font-medium">{port}</span>
        </div>
      )
    },
    {
      title: '堆场数量',
      dataIndex: 'yardCount',
      render: (count: number) => (
        <span className="text-purple-600 font-medium">{count}</span>
      )
    },
    {
      title: '空箱总计',
      dataIndex: 'emptyCount',
      render: (count: number) => (
        <span className="text-orange-600 font-medium">{count}</span>
      )
    },
    {
      title: '重箱总计',
      dataIndex: 'fullCount',
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      )
    },
    {
      title: '总计',
      dataIndex: 'totalCount',
      render: (count: number) => (
        <span className="text-blue-600 font-bold">{count}</span>
      )
    }
  ];

  // 箱型汇总表格列
  const containerTypeSummaryColumns = [
    {
      title: '箱型',
      dataIndex: 'containerType',
      render: (type: ContainerType) => (
        <Tag color="blue" size="small">{type}</Tag>
      )
    },
    {
      title: '空箱总计',
      dataIndex: 'emptyCount',
      render: (count: number) => (
        <span className="text-orange-600 font-medium">{count}</span>
      )
    },
    {
      title: '重箱总计',
      dataIndex: 'fullCount',
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      )
    },
    {
      title: '总计',
      dataIndex: 'totalCount',
      render: (count: number) => (
        <span className="text-blue-600 font-bold">{count}</span>
      )
    }
  ];

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title heading={5}>
            <IconDesktop className="mr-2" />
            报表中心
          </Title>
          {selectedReportType && (
            <Space>
              <Button icon={<IconRefresh />} onClick={() => generateReport(selectedReportType)}>
                刷新数据
              </Button>
              <Button type="primary" icon={<IconDownload />} onClick={exportReport}>
                导出报表
              </Button>
            </Space>
          )}
        </div>

        {/* 报表类型选择 */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-gray-700">选择要生成的报表类型：</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(REPORT_CONFIG).map(([key, config]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReportType === key ? 'border-blue-500 bg-blue-50' : ''
                }`}
                size="small"
                onClick={() => generateReport(key as ReportType)}
              >
                <div className="text-center">
                  <div className="text-xl mb-2">{config.icon}</div>
                  <div className="font-medium text-sm mb-1">{config.title}</div>
                  <div className="text-xs text-gray-500">{config.description}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* 报表内容区域 */}
      {selectedReportType && (
        <Card>
          <Spin loading={loading}>
            {selectedReportType === ReportType.DAILY_INVENTORY && (
              <div>
                {/* 统计概览 */}
                {inventorySummary && (
                  <div className="mb-6">
                    <Title heading={6} className="mb-4">库存概览</Title>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic
                          title="总库存"
                          value={inventorySummary.totalContainers}
                          suffix="TEU"
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="空箱数量"
                          value={inventorySummary.emptyContainers}
                          suffix="TEU"
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="重箱数量"
                          value={inventorySummary.fullContainers}
                          suffix="TEU"
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="堆场数量"
                          value={inventorySummary.totalYards}
                          suffix="个"
                        />
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                )}

                {/* 分组查看 */}
                <Tabs activeTab={activeTab} onChange={setActiveTab}>
                  <TabPane key="byYard" title="按堆场明细">
                    <Table
                      columns={yardColumns}
                      data={inventoryData}
                      pagination={{
                        showTotal: true,
                        pageSize: 10,
                        showJumper: true
                      }}
                      scroll={{ x: 800 }}
                      border={{
                        wrapper: true,
                        cell: true
                      }}
                    />
                  </TabPane>
                  
                  <TabPane key="byPort" title="按港口汇总">
                    <Table
                      columns={portSummaryColumns}
                      data={getPortSummary()}
                      pagination={false}
                      border={{
                        wrapper: true,
                        cell: true
                      }}
                    />
                  </TabPane>
                  
                  <TabPane key="byType" title="按箱型汇总">
                    <Table
                      columns={containerTypeSummaryColumns}
                      data={getContainerTypeSummary()}
                      pagination={false}
                      border={{
                        wrapper: true,
                        cell: true
                      }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            )}

            {selectedReportType === ReportType.LONG_STAY_CONTAINERS && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">长期滞留箱报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}

            {selectedReportType === ReportType.REPAIR_WASH_CONTAINERS && (
              <div>
                {/* 修洗箱统计概览 */}
                {repairWashSummary && (
                  <div className="mb-6">
                    <Title heading={6} className="mb-4">修洗箱统计概览</Title>
                    <Row gutter={16}>
                      <Col span={5}>
                        <Statistic
                          title="总工单数"
                          value={repairWashSummary.totalOrders}
                          suffix="个"
                        />
                      </Col>
                                             <Col span={5}>
                         <div style={{ color: '#00B42A' }}>
                           <Statistic
                             title="已完成"
                             value={repairWashSummary.completedOrders}
                             suffix="个"
                           />
                         </div>
                       </Col>
                       <Col span={5}>
                         <div style={{ color: '#FF7D00' }}>
                           <Statistic
                             title="施工中"
                             value={repairWashSummary.inProgressOrders}
                             suffix="个"
                           />
                         </div>
                       </Col>
                       <Col span={5}>
                         <div style={{ color: '#165DFF' }}>
                           <Statistic
                             title="总费用"
                             value={repairWashSummary.totalCost}
                             prefix="¥"
                           />
                         </div>
                       </Col>
                      <Col span={4}>
                        <Statistic
                          title="平均费用"
                          value={repairWashSummary.avgCost}
                          prefix="¥"
                        />
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                )}

                {/* 修洗箱明细表格 */}
                <Table
                  columns={[
                    {
                      title: '工单号',
                      dataIndex: 'workOrderNo',
                      width: 120,
                      render: (text: string) => (
                        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
                      )
                    },
                    {
                      title: '箱号',
                      dataIndex: 'containerNo',
                      width: 140,
                      render: (text: string) => (
                        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{text}</span>
                      )
                    },
                    {
                      title: '服务类型',
                      dataIndex: 'serviceType',
                      width: 100,
                      render: (type: string) => {
                        const colorMap = {
                          '修箱': 'red',
                          '洗箱': 'blue',
                          '改装': 'orange'
                        };
                        return <Tag color={colorMap[type as keyof typeof colorMap]}>{type}</Tag>;
                      }
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      width: 100,
                      render: (status: string) => {
                        const statusConfig = {
                          '待施工': { color: 'gray', text: '待施工' },
                          '施工中': { color: 'orange', text: '施工中' },
                          '已完成': { color: 'green', text: '已完成' },
                          '已验收': { color: 'blue', text: '已验收' }
                        };
                        const config = statusConfig[status as keyof typeof statusConfig];
                        return <Tag color={config.color}>{config.text}</Tag>;
                      }
                    },
                    {
                      title: '客户',
                      dataIndex: 'customer',
                      width: 180
                    },
                    {
                      title: '堆场',
                      dataIndex: 'yard',
                      width: 120
                    },
                    {
                      title: '开始日期',
                      dataIndex: 'startDate',
                      width: 110
                    },
                    {
                      title: '完成日期',
                      dataIndex: 'completedDate',
                      width: 110,
                      render: (date: string | undefined) => date || '-'
                    },
                    {
                      title: '费用',
                      dataIndex: 'cost',
                      width: 100,
                      render: (cost: number) => (
                        <span className="font-medium text-blue-600">¥{cost.toLocaleString()}</span>
                      )
                    },
                    {
                      title: '备注',
                      dataIndex: 'remark',
                      width: 150,
                      render: (remark: string | undefined) => remark || '-'
                    }
                  ]}
                  data={repairWashData}
                  pagination={{
                    showTotal: true,
                    pageSize: 10,
                    showJumper: true
                  }}
                  scroll={{ x: 1200 }}
                  border={{
                    wrapper: true,
                    cell: true
                  }}
                />
              </div>
            )}

            {selectedReportType === ReportType.CONTAINER_FLOW && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">集装箱流水报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}

            {selectedReportType === ReportType.YARD_UTILIZATION && (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg mb-4">堆场利用率报表</div>
                <div className="text-gray-400">功能开发中，敬请期待...</div>
              </div>
            )}
          </Spin>
        </Card>
      )}

      {!selectedReportType && (
        <Card>
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">请选择要生成的报表类型</div>
            <div className="text-gray-400">从上方报表类型中选择一个开始生成报表</div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportingPage; 