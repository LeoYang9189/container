import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ContainerLayout from './layout/ContainerLayout';
import DashboardPage from './pages/DashboardPage';
import ReleaseManagementPage from './pages/ReleaseManagementPage';
import ReportingPage from './pages/ReportingPage';
import ContainerManagementPage from './pages/ContainerManagementPage';
import DynamicSettingsPage from './pages/DynamicSettingsPage';
import DynamicQueryPage from './pages/DynamicQueryPage';
import SystemConfigPage from './pages/SystemConfigPage';
import YardManagementPage from './pages/YardManagementPage';
import EntryReservationPage from './pages/EntryReservationPage';
import ExitReservationPage from './pages/ExitReservationPage';
import SingleContainerMaintenancePage from './pages/SingleContainerMaintenancePage';
import BatchContainerMaintenancePage from './pages/BatchContainerMaintenancePage';
import AddDynamicPage from './pages/AddDynamicPage';
import { Breadcrumb } from '@arco-design/web-react';
import { Link } from 'react-router-dom';
import CleaningManagementPage from './pages/CleaningManagementPage';
import CleaningWorkOrderPage from './pages/CleaningWorkOrderPage';
import RepairWorkOrderPage from './pages/RepairWorkOrderPage';
import RepairWorkOrderEdit from './pages/RepairWorkOrderEdit';
import TransferOrderPage from './pages/TransferOrderPage';
import TransferOrderEdit from './pages/TransferOrderEdit';
import ExitReservationEdit from './pages/ExitReservationEdit';
import YardPlanningPage from './pages/YardPlanningPage';

// 定义标题映射，用于显示面包屑
const pageTitleMap: Record<string, { title: string, parent?: string }> = {
  'dashboard': { title: '控制台' },
  'dynamic-query': { title: '动态查询', parent: '动态管理' },
  'dynamic-maintenance': { title: '动态维护', parent: '动态管理' },
  'single-container-maintenance': { title: '单箱维护', parent: '动态维护' },
  'batch-container-maintenance': { title: '批量维护', parent: '动态维护' },
  'add-dynamic': { title: '新增动态', parent: '单箱维护' },
  'container-management': { title: '集装箱管理', parent: '设备管理' },
  'chassis-management': { title: '车架管理', parent: '设备管理' },
  'trailer-management': { title: '拖车管理', parent: '设备管理' },
  'repair-management': { title: '修箱管理', parent: '设备维护' },
  'create': { title: '新增工作单', parent: '修箱管理' },
  'edit': { title: '编辑工作单', parent: '修箱管理' },
  'cleaning-management': { title: '洗箱管理', parent: '设备维护' },
  'release': { title: '放箱管理' },
  'entry-reservation': { title: '进场预约', parent: '预约管理' },
  'exit-reservation': { title: '出场预约', parent: '预约管理' },
  'transfer-orders': { title: '调拨指令', parent: '订单管理' },
  'cost': { title: '费用管理' },
  'edi': { title: 'EDI中心' },
  'customer': { title: '客户中心' },
  'reporting': { title: '报表中心' },
  'dynamic-settings': { title: '动态设置', parent: '系统设置' },
  'system-config': { title: '系统配置', parent: '系统设置' },
  'yard-planning': { title: '堆场规划', parent: '系统设置' },
  'yard-management': { title: '堆场管理', parent: '设备管理' },
};

// 生成面包屑导航组件
const generateBreadcrumb = (path: string) => {
  const pathSegments = path.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const pageInfo = pageTitleMap[lastSegment];

  return (
    <Breadcrumb>
      <Breadcrumb.Item key="breadcrumb-home">
        <Link to="/smartainer/dashboard">首页</Link>
      </Breadcrumb.Item>
      {pageInfo?.parent && (
        <Breadcrumb.Item key="breadcrumb-parent">{pageInfo.parent}</Breadcrumb.Item>
      )}
      {pageInfo && (
        <Breadcrumb.Item key="breadcrumb-current">{pageInfo.title}</Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};

const ContainerSystem: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/smartainer/dashboard" replace />} />
      <Route 
        path="/dashboard" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/dashboard')}>
            <DashboardPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/dynamic-query" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/dynamic-query')}>
            <DynamicQueryPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/dynamic-maintenance" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/dynamic-maintenance')}>
            <div className="bg-white p-6 rounded-lg shadow-sm">动态维护页面</div>
          </ContainerLayout>
        } 
      />
      <Route 
        path="/single-container-maintenance" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/single-container-maintenance')}>
            <SingleContainerMaintenancePage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/batch-container-maintenance" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/batch-container-maintenance')}>
            <BatchContainerMaintenancePage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/add-dynamic" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/add-dynamic')}>
            <AddDynamicPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/container-management" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/container-management')}>
            <ContainerManagementPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/chassis-management" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/chassis-management')}>
            <div className="bg-white p-6 rounded-lg shadow-sm">车架管理页面</div>
          </ContainerLayout>
        } 
      />
      <Route 
        path="/trailer-management" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/trailer-management')}>
            <div className="bg-white p-6 rounded-lg shadow-sm">拖车管理页面</div>
          </ContainerLayout>
        } 
      />
      <Route 
        path="/repair-management" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/repair-management')}>
            <RepairWorkOrderPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/repair-management/create" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/repair-management/create')}>
            <RepairWorkOrderEdit />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/repair-management/edit/:id" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/repair-management/edit')}>
            <RepairWorkOrderEdit />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/cleaning-management" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/cleaning-management')}>
            <CleaningManagementPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/cleaning-management/add" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/cleaning-management/add')}>
            <CleaningWorkOrderPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/cleaning-management/edit/:id" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/cleaning-management/edit')}>
            <CleaningWorkOrderPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/release" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/release')}>
            <ReleaseManagementPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/entry-reservation" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/entry-reservation')}>
            <EntryReservationPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/exit-reservation" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/exit-reservation')}>
            <ExitReservationPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/exit-reservation/create" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/exit-reservation/create')}>
            <ExitReservationEdit />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/exit-reservation/edit/:id" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/exit-reservation/edit')}>
            <ExitReservationEdit />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/transfer-orders" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/transfer-orders')}>
            <TransferOrderPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/transfer-orders/create" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/transfer-orders/create')}>
            <TransferOrderEdit />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/transfer-orders/edit/:id" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/transfer-orders/edit')}>
            <TransferOrderEdit />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/cost" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/cost')}>
            <div className="bg-white p-6 rounded-lg shadow-sm">费用管理页面</div>
          </ContainerLayout>
        } 
      />
      <Route 
        path="/edi" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/edi')}>
            <div className="bg-white p-6 rounded-lg shadow-sm">EDI中心页面</div>
          </ContainerLayout>
        } 
      />
      <Route 
        path="/customer" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/customer')}>
            <div className="bg-white p-6 rounded-lg shadow-sm">客户中心页面</div>
          </ContainerLayout>
        } 
      />
      <Route 
        path="/reporting" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/reporting')}>
            <ReportingPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/dynamic-settings" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/dynamic-settings')}>
            <DynamicSettingsPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/system-config" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/system-config')}>
            <SystemConfigPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/yard-planning" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/yard-planning')}>
            <YardPlanningPage />
          </ContainerLayout>
        } 
      />
      <Route 
        path="/yard-management" 
        element={
          <ContainerLayout breadcrumb={generateBreadcrumb('/yard-management')}>
            <YardManagementPage />
          </ContainerLayout>
        } 
      />
      <Route path="*" element={<Navigate to="/smartainer/dashboard" replace />} />
    </Routes>
  );
};

export default ContainerSystem; 