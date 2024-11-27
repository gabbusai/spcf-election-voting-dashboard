import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import axios from 'axios';
import { useFetchPositions } from '../../utils/queries';

const { Option } = Select;

const CandidateForm = ({ onClose, onRefresh, candidate = null }) => {
  const [form] = Form.useForm();

  // Fetch available positions for selection
  const { data: positions, isLoading: positionsLoading } = useFetchPositions();

  useEffect(() => {
    if (candidate) {
      form.setFieldsValue({
        name: candidate.name,
        position_id: candidate.position_id,
        department_id: candidate.department_id,
      });
    } else {
      form.resetFields();
    }
  }, [candidate, form]);

  const handleSubmit = async (values) => {
    try {
      if (candidate) {
        // Update existing candidate
        await axios.put(`/api/candidates/${candidate.id}`, values);
      } else {
        // Add new candidate
        await axios.post('/api/candidates', values);
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: '',
        position_id: null,
        department_id: null,
      }}
    >
      <Form.Item
        label="Candidate Name"
        name="name"
        rules={[{ required: true, message: 'Please enter the candidate name' }]}
      >
        <Input placeholder="Enter candidate name" />
      </Form.Item>

      <Form.Item
        label="Position"
        name="position_id"
        rules={[{ required: true, message: 'Please select a position' }]}
      >
        <Select placeholder="Select position" loading={positionsLoading}>
          {positions?.map((position) => (
            <Option key={position.id} value={position.id}>
              {position.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Department"
        name="department_id"
        rules={[{ required: true, message: 'Please select a department' }]}
      >
        <Select placeholder="Select department">
          <Option value={1}>Department 1</Option>
          <Option value={2}>Department 2</Option>
          <Option value={3}>Department 3</Option>
          {/* Dynamically fetch departments if available */}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
          {candidate ? 'Update Candidate' : 'Add Candidate'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default CandidateForm;
