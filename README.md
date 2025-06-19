# 智慧集装箱管理系统

## 系统介绍

智慧集装箱管理系统是一套专业的集装箱运营管理平台，提供集装箱全生命周期的数字化管理解决方案。

## 主要功能

### 📊 控制台
- 系统概览
- 实时数据监控
- 关键指标展示

### 📋 动态管理
- **动态查询** - 实时查询集装箱状态信息
- **动态维护** - 集装箱状态维护和更新
  - 单箱维护
  - 批量维护
  - 新增动态

### 🏗️ 设备管理
- **集装箱管理** - 集装箱基础信息管理
- **车架管理** - 车架设备管理
- **拖车管理** - 拖车设备管理
- **堆场管理** - 堆场区域管理

### 🔧 设备维护
- **修箱管理** - 集装箱维修工作单管理
- **洗箱管理** - 集装箱清洗工作单管理

### 📦 放箱管理
- 集装箱放箱流程管理

### 📅 预约管理
- **进场预约** - 集装箱进场预约管理
- **出场预约** - 集装箱出场预约管理

### 📋 订单管理
- **调拨指令** - 集装箱调拨指令管理

### 💰 费用管理
- 集装箱相关费用管理

### 🔄 EDI中心
- 电子数据交换管理

### 👥 客户中心
- 客户信息管理

### 📈 报表中心
- 各类业务报表生成

### ⚙️ 系统设置
- **动态设置** - 系统动态参数配置
- **系统配置** - 系统基础配置
- **堆场规划** - 堆场布局规划

## 技术栈

- **前端框架**: React 19 + TypeScript
- **UI组件库**: Arco Design
- **路由管理**: React Router DOM
- **样式方案**: Tailwind CSS
- **图表库**: ECharts + Ant Design Charts
- **地图组件**: Leaflet + React Leaflet
- **构建工具**: Vite
- **包管理**: npm

## 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── AppContent.tsx          # 应用主内容组件
│   ├── common/                 # 通用组件
│   │   └── LoadingSpinner.tsx  # 加载动画组件
│   └── containersaas/          # 智慧集装箱系统
│       ├── components/         # 业务组件
│       ├── layout/            # 布局组件
│       ├── pages/             # 页面组件
│       ├── container.css      # 系统样式
│       └── ContainerSystem.tsx # 系统主组件
├── assets/                    # 静态资源
├── services/                  # API服务
├── App.tsx                    # 根组件
├── main.tsx                   # 应用入口
└── index.css                  # 全局样式
```

## 访问地址

系统启动后，默认访问地址：`http://localhost:5173`

系统会自动重定向到智慧集装箱系统控制台：`/smartainer/dashboard`

## 开发说明

- 所有集装箱系统相关的组件都在 `src/components/containersaas/` 目录下
- 系统使用 Arco Design 作为主要 UI 组件库
- 路由配置在 `ContainerSystem.tsx` 中管理
- 系统支持响应式设计，适配各种屏幕尺寸
