import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useAuthContext } from '../../utils/AuthContext';

const AdminPromotionForm = ({ onRefresh }) => {
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
      await axios.post('/api/admin/make-admin', values, config);
      message.success('User promoted to admin successfully');
      form.resetFields();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error promoting user:', error);
      message.error(error.response?.data?.message || 'Failed to promote user to admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ student_id: '' }}
    >
      <Form.Item
        label="Student ID"
        name="student_id"
        rules={[{ required: true, message: 'Please enter the student ID!' }]}
      >
        <Input placeholder="Enter student ID" type="number" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Promote to Admin
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminPromotionForm;