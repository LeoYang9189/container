import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Select,
  Grid,
  Tag,
  Tooltip,
  Message,
  Slider,
  Divider
} from '@arco-design/web-react';
import {
  IconEye,
  IconRefresh,
  IconSettings,
  IconHome,
  IconUp,
  IconDown,
  IconLeft,
  IconRight
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const { Row, Col } = Grid;
const { Option } = Select;

// 堆场区域定义
interface YardArea {
  id: string;
  name: string;
  rows: number;
  cols: number;
  maxLayers: number;
  color: string;
}

// 集装箱位置定义
interface ContainerPosition {
  area: string;
  row: number;
  col: number;
  layer: number;
  containerNo?: string;
  isEmpty: boolean;
  containerType?: string;
  customer?: string;
}

// 视图角度定义
interface ViewAngle {
  name: string;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

const YardPlanningPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedArea, setSelectedArea] = useState<string>('AA');
  const [currentLayer, setCurrentLayer] = useState<number>(1);
  const [viewAngle, setViewAngle] = useState<ViewAngle>({
    name: '鸟瞰视图',
    rotateX: 45,
    rotateY: 0,
    rotateZ: 45
  });
  const [zoom, setZoom] = useState<number>(100);

  // 堆场区域配置
  const yardAreas: YardArea[] = [
    { id: 'AA', name: 'AA区', rows: 8, cols: 12, maxLayers: 4, color: '#ff6b6b' },
    { id: 'BB', name: 'BB区', rows: 10, cols: 15, maxLayers: 5, color: '#4ecdc4' },
    { id: 'CC', name: 'CC区', rows: 6, cols: 10, maxLayers: 3, color: '#45b7d1' },
    { id: 'DD', name: 'DD区', rows: 12, cols: 18, maxLayers: 6, color: '#96ceb4' },
    { id: 'EE', name: 'EE区', rows: 8, cols: 14, maxLayers: 4, color: '#feca57' }
  ];

  // 预设视角
  const viewAngles: ViewAngle[] = [
    { name: '鸟瞰视图', rotateX: 45, rotateY: 0, rotateZ: 45 },
    { name: '正面视图', rotateX: 0, rotateY: 0, rotateZ: 0 },
    { name: '侧面视图', rotateX: 0, rotateY: 90, rotateZ: 0 },
    { name: '立体视图', rotateX: 30, rotateY: 30, rotateZ: 15 }
  ];

  // 模拟集装箱数据
  const generateMockContainers = (area: YardArea): ContainerPosition[] => {
    const containers: ContainerPosition[] = [];
    const occupancyRate = Math.random() * 0.7 + 0.2; // 20%-90%的占用率

    for (let row = 1; row <= area.rows; row++) {
      for (let col = 1; col <= area.cols; col++) {
        for (let layer = 1; layer <= area.maxLayers; layer++) {
                     const isEmpty = Math.random() > occupancyRate || (layer > 1 && (containers.find(c => c.area === area.id && c.row === row && c.col === col && c.layer === layer - 1)?.isEmpty ?? true));
          
          containers.push({
            area: area.id,
            row,
            col,
            layer,
            isEmpty,
            containerNo: isEmpty ? undefined : `${area.id}${String(row).padStart(2, '0')}${String(col).padStart(2, '0')}${String(layer).padStart(2, '0')}`,
            containerType: isEmpty ? undefined : ['20GP', '40GP', '40HC'][Math.floor(Math.random() * 3)],
            customer: isEmpty ? undefined : ['上海远洋', '马士基', '中远海运', '东方海外'][Math.floor(Math.random() * 4)]
          });
        }
      }
    }
    
    return containers;
  };

  const [containers, setContainers] = useState<ContainerPosition[]>([]);

  // 初始化数据
  useEffect(() => {
    const allContainers: ContainerPosition[] = [];
    yardAreas.forEach(area => {
      allContainers.push(...generateMockContainers(area));
    });
    setContainers(allContainers);
  }, []);

  // 绘制三维视图
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置画布尺寸
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = zoom / 100;

    // 获取当前选中区域
    const currentArea = yardAreas.find(area => area.id === selectedArea);
    if (!currentArea) return;

    const areaContainers = containers.filter(c => c.area === selectedArea);

    // 绘制网格和集装箱
    const cellSize = Math.min(canvas.width / (currentArea.cols + 4), canvas.height / (currentArea.rows + 4)) * scale;
    const containerHeight = cellSize * 0.8;
    const startX = centerX - (currentArea.cols * cellSize) / 2;
    const startY = centerY - (currentArea.rows * cellSize) / 2;

    // 绘制地面网格
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let row = 0; row <= currentArea.rows; row++) {
      const y = startY + row * cellSize;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + currentArea.cols * cellSize, y);
      ctx.stroke();
    }
    for (let col = 0; col <= currentArea.cols; col++) {
      const x = startX + col * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + currentArea.rows * cellSize);
      ctx.stroke();
    }

    // 绘制集装箱
    areaContainers.forEach(container => {
      if (container.isEmpty) return;

      const x = startX + (container.col - 1) * cellSize;
      const y = startY + (container.row - 1) * cellSize;
      const layerOffset = (container.layer - 1) * (containerHeight * 0.3);

      // 应用3D变换效果（简化的伪3D）
      const offsetX = Math.cos(viewAngle.rotateY * Math.PI / 180) * layerOffset * 0.5;
      const offsetY = Math.sin(viewAngle.rotateX * Math.PI / 180) * layerOffset * 0.8;

      const drawX = x + offsetX;
      const drawY = y - offsetY;
      
      // 绘制集装箱主体
      ctx.fillStyle = currentArea.color;
      ctx.globalAlpha = 0.7 + (container.layer - 1) * 0.1;
      ctx.fillRect(drawX + 2, drawY + 2, cellSize - 4, cellSize - 4);

      // 绘制集装箱边框
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.strokeRect(drawX + 2, drawY + 2, cellSize - 4, cellSize - 4);

      // 绘制层数标识
      if (container.layer > 1) {
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize * 0.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(
          container.layer.toString(),
          drawX + cellSize / 2,
          drawY + cellSize / 2
        );
      }
    });

    // 绘制坐标标识
    ctx.fillStyle = '#666';
    ctx.font = `${Math.max(12, cellSize * 0.15)}px Arial`;
    ctx.textAlign = 'center';

    // 列号标识
    for (let col = 1; col <= currentArea.cols; col++) {
      const x = startX + (col - 0.5) * cellSize;
      ctx.fillText(String(col).padStart(2, '0'), x, startY - 10);
    }

    // 行号标识
    ctx.textAlign = 'right';
    for (let row = 1; row <= currentArea.rows; row++) {
      const y = startY + (row - 0.5) * cellSize;
      ctx.fillText(String(row).padStart(2, '0'), startX - 10, y + 5);
    }

  }, [selectedArea, containers, viewAngle, zoom, currentLayer]);

  // 获取区域统计信息
  const getAreaStats = (areaId: string) => {
    const areaContainers = containers.filter(c => c.area === areaId);
    const totalPositions = areaContainers.length;
    const occupiedPositions = areaContainers.filter(c => !c.isEmpty).length;
    const occupancyRate = totalPositions > 0 ? Math.round((occupiedPositions / totalPositions) * 100) : 0;

    return {
      total: totalPositions,
      occupied: occupiedPositions,
      available: totalPositions - occupiedPositions,
      occupancyRate
    };
  };

  // 刷新数据
  const refreshData = () => {
    const allContainers: ContainerPosition[] = [];
    yardAreas.forEach(area => {
      allContainers.push(...generateMockContainers(area));
    });
    setContainers(allContainers);
    Message.success('堆场数据已刷新');
  };

  const currentAreaData = yardAreas.find(area => area.id === selectedArea);
  const areaStats = getAreaStats(selectedArea);

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <Title heading={4} style={{ margin: 0 }}>堆场规划管理</Title>
        <div className="text-sm text-gray-500 mt-1">三维可视化堆场布局，实时显示集装箱存放情况</div>
      </div>

      {/* 控制面板 */}
      <Row gutter={24} className="mb-6">
        <Col span={18}>
          <Card title="堆场三维视图" extra={
            <Space>
              <Select
                value={selectedArea}
                onChange={setSelectedArea}
                style={{ width: 120 }}
              >
                {yardAreas.map(area => (
                  <Option key={area.id} value={area.id}>
                    {area.name}
                  </Option>
                ))}
              </Select>
              <Select
                value={viewAngle.name}
                onChange={(name) => {
                  const angle = viewAngles.find(a => a.name === name);
                  if (angle) setViewAngle(angle);
                }}
                style={{ width: 120 }}
              >
                {viewAngles.map(angle => (
                  <Option key={angle.name} value={angle.name}>
                    {angle.name}
                  </Option>
                ))}
              </Select>
              <Button icon={<IconRefresh />} onClick={refreshData}>
                刷新
              </Button>
            </Space>
          }>
            <div style={{ position: 'relative', height: '500px', backgroundColor: '#f8f9fa' }}>
              <canvas
                ref={canvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px'
                }}
              />
              
              {/* 图例 */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '12px'
              }}>
                <div className="mb-2">
                  <span className="inline-block w-4 h-4 mr-2" style={{ backgroundColor: currentAreaData?.color }}></span>
                  有集装箱
                </div>
                <div>
                  <span className="inline-block w-4 h-4 mr-2 border border-gray-300 bg-white"></span>
                  空位置
                </div>
              </div>

              {/* 缩放控制 */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '10px',
                borderRadius: '6px',
                width: '200px'
              }}>
                <div className="text-xs text-gray-600 mb-2">缩放: {zoom}%</div>
                                 <Slider
                   value={zoom}
                   onChange={(value) => setZoom(Array.isArray(value) ? value[0] : value)}
                   min={50}
                   max={200}
                   step={10}
                 />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* 区域信息 */}
            <Card title={`${currentAreaData?.name || ''} 区域信息`} size="small">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>区域尺寸:</span>
                  <span>{currentAreaData?.rows} × {currentAreaData?.cols}</span>
                </div>
                <div className="flex justify-between">
                  <span>最大层数:</span>
                  <span>{currentAreaData?.maxLayers} 层</span>
                </div>
                <div className="flex justify-between">
                  <span>总位置数:</span>
                  <span>{areaStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>已占用:</span>
                  <span className="text-red-600">{areaStats.occupied}</span>
                </div>
                <div className="flex justify-between">
                  <span>可用位置:</span>
                  <span className="text-green-600">{areaStats.available}</span>
                </div>
                <div className="flex justify-between">
                  <span>占用率:</span>
                  <Tag color={areaStats.occupancyRate > 80 ? 'red' : areaStats.occupancyRate > 60 ? 'orange' : 'green'}>
                    {areaStats.occupancyRate}%
                  </Tag>
                </div>
              </div>
            </Card>

            {/* 其他区域概览 */}
            <Card title="全部区域概览" size="small">
              <div className="space-y-2">
                {yardAreas.map(area => {
                  const stats = getAreaStats(area.id);
                  return (
                    <div 
                      key={area.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedArea === area.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedArea(area.id)}
                    >
                      <div className="flex items-center">
                        <span 
                          className="inline-block w-3 h-3 rounded mr-2"
                          style={{ backgroundColor: area.color }}
                        ></span>
                        <span className="text-sm font-medium">{area.name}</span>
                      </div>
                      <Tag 
                        size="small"
                        color={stats.occupancyRate > 80 ? 'red' : stats.occupancyRate > 60 ? 'orange' : 'green'}
                      >
                        {stats.occupancyRate}%
                      </Tag>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 快捷操作 */}
            <Card title="快捷操作" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button icon={<IconEye />} size="small" long>
                  查看空位置
                </Button>
                <Button icon={<IconSettings />} size="small" long>
                  区域设置
                </Button>
                <Button icon={<IconHome />} size="small" long>
                  导出布局
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default YardPlanningPage; 