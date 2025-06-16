import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// 获取洗箱工作单详情
export const getCleaningWorkOrder = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/cleaning-work-orders/${id}`);
  return response.data;
};

// 创建洗箱工作单
export const createCleaningWorkOrder = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/cleaning-work-orders`, data);
  return response.data;
};

// 更新洗箱工作单
export const updateCleaningWorkOrder = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/cleaning-work-orders/${id}`, data);
  return response.data;
};

// 获取洗箱工作单列表
export const getCleaningWorkOrders = async (params: any) => {
  const response = await axios.get(`${API_BASE_URL}/cleaning-work-orders`, { params });
  return response.data;
};

// 删除洗箱工作单
export const deleteCleaningWorkOrder = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/cleaning-work-orders/${id}`);
  return response.data;
};

// 获取修箱工作单列表
export const getRepairWorkOrders = async (params: any) => {
  const response = await axios.get(`${API_BASE_URL}/repair-work-orders`, { params });
  return response.data;
};

// 获取修箱工作单详情
export const getRepairWorkOrder = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/repair-work-orders/${id}`);
  return response.data;
};

// 创建修箱工作单
export const createRepairWorkOrder = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/repair-work-orders`, data);
  return response.data;
};

// 更新修箱工作单
export const updateRepairWorkOrder = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE_URL}/repair-work-orders/${id}`, data);
  return response.data;
};

// 删除修箱工作单
export const deleteRepairWorkOrder = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/repair-work-orders/${id}`);
  return response.data;
};

// 获取集装箱当前堆场
export const getContainerCurrentYard = async (containerNo: string) => {
  const response = await axios.get(`${API_BASE_URL}/containers/${containerNo}/current-yard`);
  return response.data;
}; 