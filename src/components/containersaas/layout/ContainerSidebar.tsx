import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Button } from '@arco-design/web-react';
import {
  IconDashboard,
  IconStorage,
  IconTool,
  IconInteraction,
  IconDesktop,
  IconBook,
  IconPoweroff,
  IconFile,
  IconUser,
  IconSettings,
  IconCalendar
} from '@arco-design/web-react/icon';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

interface ContainerSidebarProps {
  collapsed: boolean;
}

const ContainerSidebar: React.FC<ContainerSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 获取当前路径最后一段作为选中的菜单项
  const currentPath = location.pathname.replace(/^\/smartainer/, '');
  const selectedKey = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'dashboard';

  // 菜单项点击处理
  const onClickMenuItem = (key: string) => {
    // 使用绝对路径导航，防止路径叠加
    navigate(`/smartainer/${key}`);
  };

  return (
    <>
      {/* Logo区域 */}
      <div className="p-4 flex items-center justify-center">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-4 relative overflow-hidden shadow-lg">
              <span className="text-xl font-bold">S</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">C</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600 leading-relaxed tracking-wide">智慧集装箱</div>
              <div className="text-xs text-gray-500 mt-0.5 tracking-wider">SMARTAINER</div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
            <span className="text-xl font-bold">S</span>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
              <span className="text-xs text-blue-600 font-bold">C</span>
            </div>
          </div>
        )}
      </div>

      {/* 导航菜单 */}
      <Menu
        selectedKeys={[selectedKey]}
        onClickMenuItem={onClickMenuItem}
        autoOpen
        style={{ width: '100%' }}
        className="mt-2"
      >
        <MenuItem key="dashboard">
          <IconDashboard className="mr-2" />
          <span>控制台</span>
        </MenuItem>
        
        <SubMenu
          key="dynamic-sub"
          title={
            <span>
              <IconDesktop className="mr-2" />
              <span>动态管理</span>
            </span>
          }
        >
          <MenuItem key="dynamic-query">动态查询</MenuItem>
          <SubMenu key="dynamic-maintenance-sub" title="动态维护">
            <MenuItem key="single-container-maintenance">单箱维护</MenuItem>
            <MenuItem key="batch-container-maintenance">批量维护</MenuItem>
          </SubMenu>
        </SubMenu>
        
        <SubMenu
          key="equipment-sub"
          title={
            <span>
              <IconStorage className="mr-2" />
              <span>设备管理</span>
            </span>
          }
        >
          <MenuItem key="container-management">集装箱管理</MenuItem>
          <MenuItem key="chassis-management">车架管理</MenuItem>
          <MenuItem key="trailer-management">拖车管理</MenuItem>
        </SubMenu>
        
        <SubMenu
          key="maintenance-sub"
          title={
            <span>
              <IconTool className="mr-2" />
              <span>设备维护</span>
            </span>
          }
        >
          <MenuItem key="repair-management">修箱管理</MenuItem>
          <MenuItem key="cleaning-management">洗箱管理</MenuItem>
        </SubMenu>
        
        <MenuItem key="release">
          <IconInteraction className="mr-2" />
          <span>放箱管理</span>
        </MenuItem>
        
        <SubMenu
          key="reservation-sub"
          title={
            <span>
              <IconCalendar className="mr-2" />
              <span>预约管理</span>
            </span>
          }
        >
          <MenuItem key="entry-reservation">进场预约</MenuItem>
          <MenuItem key="exit-reservation">出场预约</MenuItem>
        </SubMenu>
        
        <SubMenu
          key="order-sub"
          title={
            <span>
              <IconFile className="mr-2" />
              <span>订单管理</span>
            </span>
          }
        >
          <MenuItem key="transfer-orders">调拨指令</MenuItem>
        </SubMenu>
        
        <MenuItem key="cost">
          <IconSettings className="mr-2" />
          <span>费用管理</span>
        </MenuItem>
        
        <SubMenu
          key="customer-sub"
          title={
            <span>
              <IconUser className="mr-2" />
              <span>客商管理</span>
            </span>
          }
        >
          <MenuItem key="yard-management">堆场管理</MenuItem>
          <MenuItem key="customer-management">客户管理</MenuItem>
          <MenuItem key="supplier-management">供应商管理</MenuItem>
        </SubMenu>
        
        <MenuItem key="reporting">
          <IconBook className="mr-2" />
          <span>报表中心</span>
        </MenuItem>
        
        <SubMenu
          key="system-sub"
          title={
            <span>
              <IconSettings className="mr-2" />
              <span>系统设置</span>
            </span>
          }
        >
          <MenuItem key="dynamic-settings">动态设置</MenuItem>
          <MenuItem key="system-config">系统配置</MenuItem>
          <MenuItem key="yard-planning">堆场规划</MenuItem>
        </SubMenu>
      </Menu>

      {/* 底部按钮 */}
      <div className="absolute bottom-5 w-full px-4">
        <Button 
          type="primary" 
          long 
          icon={<IconPoweroff />}
          className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 border-0"
          onClick={() => navigate('/')}
        >
          {!collapsed && '返回首页'}
        </Button>
      </div>
    </>
  );
};

export default ContainerSidebar; 