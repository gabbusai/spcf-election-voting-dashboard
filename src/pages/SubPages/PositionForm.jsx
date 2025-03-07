import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { useFetchDepartments } from '../../utils/queries';

const { Option } = Select;

const PositionForm = ({ position, onClose, onRefresh, token }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isGeneral, setIsGeneral] = useState(position ? position.is_general : true);
  const { data: departments, isLoading: isDepartmentsLoading } = useFetchDepartments();

  useEffect(() => {
    if (position) {
      form.setFieldsValue({
        name: position.name,
        is_general: position.is_general ? 1 : 0,
        department_id: position.department_id,
      });
      setIsGeneral(position.is_general);
    } else {
      form.resetFields();
      setIsGeneral(true);
    }
  }, [position, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Convert is_general to boolean and handle department_id
      const submitValues = {
        name: values.name,
        is_general: values.is_general === 1,
      };
      if (values.is_general === 0 && values.department_id) {
        submitValues.department_id = values.department_id;
      }

      if (position) {
        // Use PUT request with position ID for updates
        await axios.put(`/api/positions/${position.id}`, submitValues, config);
        message.success('Position updated successfully!');
      } else {
        // Use POST request for creating new positions
        await axios.post('/api/positions-make', submitValues, config);
        message.success('Position added successfully!');
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving position:', error);
      message.error(error.response?.data?.message || 'An error occurred while saving the position.');
    } finally {
      setLoading(false);
    }
  };

  const handleElectionTypeChange = (value) => {
    setIsGeneral(value === 1);
    if (value === 1) {
      form.setFieldsValue({ department_id: null });
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={handleSubmit}
      initialValues={{
        name: '',
        is_general: 1, // Default to general
        department_id: null,
      }}
    >
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
        <Select 
          placeholder="Select election type"
          onChange={handleElectionTypeChange}
        >
          <Option value={1}>General</Option>
          <Option value={0}>Departmental</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Department"
        name="department_id"
        rules={[
          {
            required: !isGeneral,
            message: 'Please select a department for departmental positions!',
          },
        ]}
      >
        <Select
          placeholder="Select department"
          loading={isDepartmentsLoading}
          disabled={isDepartmentsLoading || isGeneral}
          allowClear
        >
          {departments?.map((dept) => (
            <Option key={dept.id} value={dept.id}>
              {dept.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          style={{ marginRight: 10 }}
        >
          {position ? 'Update Position' : 'Add Position'}
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PositionForm;