import React, { useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Radio, Message } from '@arco-design/web-react';
import { IconSave } from '@arco-design/web-react/icon';

const { TextArea } = Input;

// 验收结果选项
const verificationResultOptions = [
  { value: 'PASS', label: '验收通过', color: 'green' },
  { value: 'FAIL', label: '验收不通过', color: 'red' },
  { value: 'PENDING', label: '待复验', color: 'orange' }
];

interface VerificationInfo {
  result: string;
  verifier: string;
  verifyTime: string;
  remark: string;
  issues?: string[];
}

interface CleaningVerificationProps {
  workOrderId: string;
  onVerificationChange: (verification: VerificationInfo) => void;
}

const CleaningVerification: React.FC<CleaningVerificationProps> = ({
  onVerificationChange
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 保存验收信息
  const handleSave = async () => {
    try {
      const values = await form.validate();
      setLoading(true);

      const verificationInfo: VerificationInfo = {
        ...values,
        verifyTime: new Date().toISOString()
      };

      // 模拟API调用
      setTimeout(() => {
        onVerificationChange(verificationInfo);
        setLoading(false);
        Message.success('验收信息已保存');
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Card title="验收信息" className="mb-4">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="验收结果"
          field="result"
          rules={[{ required: true, message: '请选择验收结果' }]}
        >
          <Radio.Group>
            {verificationResultOptions.map(option => (
              <Radio key={option.value} value={option.value}>
                <span style={{ color: option.color }}>{option.label}</span>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="验收人"
          field="verifier"
          rules={[{ required: true, message: '请输入验收人' }]}
        >
          <Input placeholder="请输入验收人姓名" />
        </Form.Item>

        <Form.Item
          label="验收时间"
          field="verifyTime"
          rules={[{ required: true, message: '请选择验收时间' }]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="验收备注"
          field="remark"
          rules={[{ required: true, message: '请输入验收备注' }]}
        >
          <TextArea
            placeholder="请输入验收备注信息"
            style={{ minHeight: 100 }}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.result !== currentValues.result
          }
        >
          {(formValues) => {
            const isFailed = formValues.result === 'FAIL';
            return isFailed ? (
              <Form.Item
                label="问题描述"
                field="issues"
                rules={[{ required: true, message: '请描述验收不通过的问题' }]}
              >
                <TextArea
                  placeholder="请详细描述验收不通过的问题，多个问题请用分号分隔"
                  style={{ minHeight: 100 }}
                />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<IconSave />}
            onClick={handleSave}
            loading={loading}
          >
            保存验收信息
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CleaningVerification; 