import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { useFetchDepartments } from '../../utils/queries';

const { Option } = Select;

const PositionForm = ({ position, onClose, onRefresh }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: departments, isLoading: isDepartmentsLoading } = useFetchDepartments();

  useEffect(() => {
    if (position) {
      form.setFieldsValue({
        name: position.name,
        is_general: position.is_general,
        department_id: position.department_id,
      });
    } else {
      form.resetFields();
    }
  }, [position, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (position) {
        // Update existing position
        await axios.put(`/api/positions/${position.id}`, values);
        message.success('Position updated successfully!');
      } else {
        // Add new position
        await axios.post('/api/positions', values);
        message.success('Position added successfully!');
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      message.error('An error occurred while saving the position.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Position Name"
        name="name"
        rules={[{ required: true, message: 'Please enter the position name!' }]}
      >
        <Input placeholder="Enter position name" />
      </Form.Item>

      <Form.Item
        label="Election Type"
        name="is_general"
        rules={[{ required: true, message: 'Please select the election type!' }]}
      >
        <Select placeholder="Select election type">
          <Option value={true}>General</Option>
          <Option value={false}>Departmental</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Department"
        name="department_id"
        rules={[{ required: true, message: 'Please select a department!' }]}
      >
        <Select
          placeholder="Select department"
          loading={isDepartmentsLoading}
          disabled={isDepartmentsLoading}
        >
          {departments?.map((dept) => (
            <Option key={dept.id} value={dept.id}>
              {dept.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {position ? 'Update Position' : 'Add Position'}
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={onClose}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PositionForm;
