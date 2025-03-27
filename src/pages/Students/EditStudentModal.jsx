import React from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';

const EditStudentModal = ({ visible, student, onClose, token, onRefresh }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${BASE_URL}/api/admin/students/${student.id}`, values, config);
      message.success('Student updated successfully');
      form.resetFields();
      onClose();
      onRefresh(); // Refetch students
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update student');
    }
  };

  return (
    <Modal
      title={`Edit Student: ${student?.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: student?.name,
          department_id: student?.department_id,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter the student name!' },
            { max: 255, message: 'Name must be less than 255 characters!' },
          ]}
        >
          <Input placeholder="Enter student name" className="rounded-md" />
        </Form.Item>

        <Form.Item
          label="Department ID"
          name="department_id"
          rules={[
            { required: true, message: 'Please enter the department ID!' },
            { type: 'number', min: 1, message: 'Department ID must be a positive number!' },
          ]}
        >
          <InputNumber min={1} className="w-full rounded-md" />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="rounded-md">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-md"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditStudentModal;