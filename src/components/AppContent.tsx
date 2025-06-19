import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner';

// 只保留集装箱系统相关的懒加载组件
const ContainerSystem = lazy(() => import('./containersaas/ContainerSystem'));

interface AppContentProps {}

const AppContent = ({}: AppContentProps) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    }>
      <Routes>
        {/* 默认路由重定向到智慧集装箱系统 */}
        <Route path="/" element={<Navigate to="/smartainer/dashboard" replace />} />
        {/* 智慧集装箱系统路由 */}
        <Route path="/smartainer/*" element={<ContainerSystem />} />
        {/* 所有其他路由都重定向到集装箱系统 */}
        <Route path="*" element={<Navigate to="/smartainer/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppContent;
