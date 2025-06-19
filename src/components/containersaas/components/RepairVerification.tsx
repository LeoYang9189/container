import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Message } from '@arco-design/web-react';
import { IconSave } from '@arco-design/web-react/icon';

const FormItem = Form.Item;

export interface VerificationData {
  result: 'PASS' | 'FAIL';
  verifier: string;
  verificationTime: string;
  remark: string;
  issues?: string;
}

interface RepairVerificationProps {
  value?: VerificationData;
  onChange: (verification: VerificationData) => void;
}

const RepairVerification: React.FC<RepairVerificationProps> = ({
  value,
  onChange
}) => {
  // 验收信息状态
  const [verification, setVerification] = useState<VerificationData>(value || {
    result: 'PASS',
    verifier: '',
    verificationTime: '',
    remark: '',
    issues: ''
  });
  const [form] = Form.useForm();

  // 验收结果选项
  const resultOptions = [
    { label: '验收通过', value: 'PASS' },
    { label: '验收不通过', value: 'FAIL' },
    { label: '待复验', value: 'PENDING' }
  ];

  // 保存验收信息
  const handleSave = async () => {
    try {
      const values = await form.validate();
      const newVerification = {
        ...values,
        verificationTime: new Date().toISOString()
      };
      setVerification(newVerification);
      onChange(newVerification);
      Message.success('保存验收信息成功');
    } catch (error) {
      // 表单验证失败
    }
  };

  return (
    <Card
      title="验收信息"
      extra={
        <Button
          type="primary"
          icon={<IconSave />}
          onClick={handleSave}
        >
          保存
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={verification}
        autoComplete="off"
      >
        <FormItem
          label="验收结果"
          field="result"
          rules={[{ required: true, message: '请选择验收结果' }]}
        >
          <Select
            placeholder="请选择验收结果"
            options={resultOptions}
            onChange={value => {
              if (value === 'FAIL') {
                form.setFieldValue('issues', '');
              }
            }}
          />
        </FormItem>

        <FormItem
          label="验收人"
          field="verifier"
          rules={[{ required: true, message: '请输入验收人' }]}
        >
          <Input placeholder="请输入验收人" />
        </FormItem>

        <FormItem
          label="验收备注"
          field="remark"
        >
          <Input.TextArea
            placeholder="请输入验收备注"
            maxLength={200}
            showWordLimit
          />
        </FormItem>

        <FormItem
          label="问题描述"
          field="issues"
          rules={[
            {
              required: form.getFieldValue('result') === 'FAIL',
              message: '验收不通过时，请填写问题描述'
            }
          ]}
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.result !== currentValues.result
          }
        >
          <Input.TextArea
            placeholder="验收不通过时，请详细描述存在的问题"
            maxLength={500}
            showWordLimit
            disabled={form.getFieldValue('result') !== 'FAIL'}
          />
        </FormItem>

        <FormItem
          label="验收时间"
          field="verificationTime"
        >
          <Input
            value={new Date(verification.verificationTime).toLocaleString()}
            disabled
          />
        </FormItem>
      </Form>
    </Card>
  );
};

export default RepairVerification; 