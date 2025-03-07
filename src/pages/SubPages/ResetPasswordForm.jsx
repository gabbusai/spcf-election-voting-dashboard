import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useAuthContext } from '../../utils/AuthContext';

const ResetPasswordForm = ({ onClose }) => {
  const [form] = Form.useForm();
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      // Only send new_password
      const payload = { new_password: values.new_password };
      const response = await axios.post('/api/admin/reset-password', payload, config);
      message.success(response.data.message);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ new_password: '', new_password_confirmation: '' }}
    >
      <Form.Item
        label="New Password"
        name="new_password"
        rules={[
          { required: true, message: 'Please enter a new password!' },
          { min: 8, message: 'Password must be at least 8 characters!' },
        ]}
      >
        <Input.Password placeholder="Enter new password" />
      </Form.Item>

      <Form.Item
        label="Confirm New Password"
        name="new_password_confirmation"
        rules={[
          { required: true, message: 'Please confirm the new password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('new_password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm new password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPasswordForm;