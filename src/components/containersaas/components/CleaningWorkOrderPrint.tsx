import React from 'react';
import { Typography, Divider } from '@arco-design/web-react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;

interface CleaningWorkOrderPrintProps {
  data: {
    id: string;
    containerNo: string;
    yard: string;
    customer: string;
    bookingNo: string;
    blNo: string;
    previousCargo: string;
    status: string;
    cleaningItems: string[];
    cleaningRequirements: string;
    totalAmount: number;
    costItems: any[];
    createTime: string;
    creator: string;
    photos?: any[];
    progress?: any[];
    verification?: any;
  };
}

const CleaningWorkOrderPrint: React.FC<CleaningWorkOrderPrintProps> = ({ data }) => {
  // 获取状态标签
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'DRAFT': '草稿',
      'PENDING': '待施工',
      'COMPLETED': '施工完成',
      'CANCELLED': '撤销'
    };
    return statusMap[status] || status;
  };

  // 获取施工项目标签
  const getCleaningItemLabel = (item: string) => {
    const itemMap: Record<string, string> = {
      'CHEMICAL': '化学清洗',
      'NORMAL': '普通清洗',
      'DRYING': '烘干',
      'AIR_TIGHTNESS': '气密性测试'
    };
    return itemMap[item] || item;
  };

  // 获取验收结果标签
  const getVerificationResultLabel = (result: string) => {
    const resultMap: Record<string, string> = {
      'PASS': '验收通过',
      'FAIL': '验收不通过',
      'PENDING': '待复验'
    };
    return resultMap[result] || result;
  };

  // 生成二维码内容
  const getQRCodeValue = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/containersaas/cleaning-work-orders/${data.id}`;
  };

  return (
    <div className="p-8" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* 页眉 */}
      <div className="flex justify-between items-start mb-8">
        <div className="text-center flex-1">
          <Title heading={2}>集装箱清洗工作单</Title>
          <Text type="secondary">打印时间：{format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</Text>
        </div>
        <div className="text-center" style={{ width: '120px' }}>
          <QRCodeSVG
            value={getQRCodeValue()}
            size={100}
            level="H"
            includeMargin={false}
            className="mx-auto"
          />
          <Text type="secondary" className="block mt-2 text-xs">
            扫描二维码跟踪施工进度
          </Text>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="mb-6">
        <Title heading={5}>基本信息</Title>
        <Divider />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text type="secondary">工作单编号：</Text>
            <Text>{data.id}</Text>
          </div>
          <div>
            <Text type="secondary">箱号：</Text>
            <Text>{data.containerNo}</Text>
          </div>
          <div>
            <Text type="secondary">施工堆场：</Text>
            <Text>{data.yard}</Text>
          </div>
          <div>
            <Text type="secondary">委托客户：</Text>
            <Text>{data.customer}</Text>
          </div>
          <div>
            <Text type="secondary">订舱号：</Text>
            <Text>{data.bookingNo}</Text>
          </div>
          <div>
            <Text type="secondary">提单号：</Text>
            <Text>{data.blNo}</Text>
          </div>
          <div>
            <Text type="secondary">前装货：</Text>
            <Text>{data.previousCargo}</Text>
          </div>
          <div>
            <Text type="secondary">状态：</Text>
            <Text>{getStatusLabel(data.status)}</Text>
          </div>
          <div>
            <Text type="secondary">创建时间：</Text>
            <Text>{format(new Date(data.createTime), 'yyyy-MM-dd HH:mm:ss')}</Text>
          </div>
          <div>
            <Text type="secondary">创建人：</Text>
            <Text>{data.creator}</Text>
          </div>
        </div>
      </div>

      {/* 施工信息 */}
      <div className="mb-6">
        <Title heading={5}>施工信息</Title>
        <Divider />
        <div className="mb-4">
          <Text type="secondary">施工项目：</Text>
          <div className="mt-2">
            {data.cleaningItems.map(item => (
              <Text key={item} className="mr-4">{getCleaningItemLabel(item)}</Text>
            ))}
          </div>
        </div>
        <div>
          <Text type="secondary">清洗要求：</Text>
          <Paragraph className="mt-2">{data.cleaningRequirements}</Paragraph>
        </div>
      </div>

      {/* 费用信息 */}
      <div className="mb-6">
        <Title heading={5}>费用信息</Title>
        <Divider />
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">费用项目</th>
              <th className="text-left p-2">单位</th>
              <th className="text-right p-2">数量</th>
              <th className="text-right p-2">单价</th>
              <th className="text-right p-2">金额</th>
            </tr>
          </thead>
          <tbody>
            {data.costItems.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.unit}</td>
                <td className="text-right p-2">{item.quantity}</td>
                <td className="text-right p-2">¥{item.unitPrice.toFixed(2)}</td>
                <td className="text-right p-2">¥{item.amount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td colSpan={4} className="text-right p-2">合计：</td>
              <td className="text-right p-2">¥{data.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 施工进度 */}
      {data.progress && data.progress.length > 0 && (
        <div className="mb-6">
          <Title heading={5}>施工进度</Title>
          <Divider />
          <div className="space-y-4">
            {data.progress.map(item => (
              <div key={item.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between">
                  <Text className="font-bold">{getStatusLabel(item.status)}</Text>
                  <Text type="secondary">
                    {format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </Text>
                </div>
                <div className="mt-1">
                  <Text type="secondary">操作人：{item.operator}</Text>
                </div>
                <div className="mt-1">
                  <Text type="secondary">备注：{item.remark}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 验收信息 */}
      {data.verification && (
        <div className="mb-6">
          <Title heading={5}>验收信息</Title>
          <Divider />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text type="secondary">验收结果：</Text>
              <Text>{getVerificationResultLabel(data.verification.result)}</Text>
            </div>
            <div>
              <Text type="secondary">验收人：</Text>
              <Text>{data.verification.verifier}</Text>
            </div>
            <div>
              <Text type="secondary">验收时间：</Text>
              <Text>{format(new Date(data.verification.verifyTime), 'yyyy-MM-dd HH:mm:ss')}</Text>
            </div>
            <div>
              <Text type="secondary">验收备注：</Text>
              <Text>{data.verification.remark}</Text>
            </div>
            {data.verification.issues && (
              <div className="col-span-2">
                <Text type="secondary">问题描述：</Text>
                <Paragraph className="mt-2">{data.verification.issues}</Paragraph>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 页脚 */}
      <div className="mt-8 pt-8 border-t">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Text type="secondary">施工方签字：</Text>
            <div className="mt-16 border-b border-dashed w-32" />
          </div>
          <div>
            <Text type="secondary">验收方签字：</Text>
            <div className="mt-16 border-b border-dashed w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningWorkOrderPrint; 