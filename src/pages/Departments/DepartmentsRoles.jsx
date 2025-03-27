import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, message, Form, Input } from 'antd';
import { useAuthContext } from '../../utils/AuthContext';
import { useFetchDepartmentsList } from '../../utils/queries';
import axios from 'axios';
import { ENV_BASE_URL } from '../../../DummyENV';

function DepartmentsRoles() {
  const { token } = useAuthContext();
  const { data, isLoading, isError, refetch } = useFetchDepartmentsList(token);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Unable to load departments data.</span>
      </div>
    );
  }

  const departmentsList = data.departments;

  // Define columns for the departments table
  const departmentColumns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id' 
    },
    { 
      title: 'Department Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>
    },
    { 
      title: 'Total Students', 
      dataIndex: 'student_count', 
      key: 'student_count',
      render: (count) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {count}
        </span>
      )
    },
    { 
      title: 'Registered Students', 
      dataIndex: 'registered_count', 
      key: 'registered_count',
      render: (count, record) => {
        const percentage = record.student_count > 0 
          ? Math.round((count / record.student_count) * 100) 
          : 0;
        
        return (
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {count}
            </span>
            <span className="text-gray-500 text-xs">({percentage}%)</span>
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Link to={`/departments/${record.id}`}>
          <Button 
            type="primary" 
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-md shadow-sm"
          >
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  // Handle Add Department submission
  const handleAddDepartment = async (values) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${ENV_BASE_URL}/api/admin/departments`, values, config);
      message.success('Department added successfully');
      form.resetFields();
      setIsAddModalOpen(false);
      refetch(); // Refresh the departments list
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add department');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
        <div className="flex space-x-2">
          <Button 
            className="flex items-center bg-green-600 hover:bg-green-700 text-white border-none rounded-md shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Department
          </Button>
          <Button 
            className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 rounded-md shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Departments Overview</h2>
          <p className="text-sm text-gray-500">Manage all departments and track student registrations</p>
        </div>
        
        <Table 
          dataSource={departmentsList} 
          columns={departmentColumns} 
          rowKey="id"
          className="departments-table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            className: "p-4"
          }}
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {/* Add Department Modal */}
      <Modal
        title="Add New Department"
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddDepartment}
          initialValues={{ name: '' }}
        >
          <Form.Item
            label="Department Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter a department name!' },
              { max: 255, message: 'Name must be less than 255 characters!' },
            ]}
          >
            <Input 
              placeholder="Enter department name" 
              className="rounded-md"
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button 
              onClick={() => {
                setIsAddModalOpen(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="bg-green-600 hover:bg-green-700 border-none"
            >
              Add Department
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default DepartmentsRoles;