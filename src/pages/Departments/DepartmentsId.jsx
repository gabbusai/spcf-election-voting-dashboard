import React, { useState } from 'react';
import { useAuthContext } from '../../utils/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { useFetchDepartmenyById } from '../../utils/queries';
import { Table, Button, Modal, message } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../utils/api';
import { ENV_BASE_URL } from '../../../DummyENV';

function DepartmentsId() {
  const { user, token } = useAuthContext();
  const { id } = useParams(); // Get the ID from the URL
  const { data: departmentData, isLoading, isError } = useFetchDepartmenyById(token, id);

  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Unable to load department data. Please try again later.</span>
        </div>
      </div>
    );
  }

  const department = departmentData.department;
  const students = department.students;

  // Define columns for the students table
  const studentColumns = [
    { 
      title: 'Student ID', 
      dataIndex: 'student_id', 
      key: 'student_id',
      render: (text) => <span className="text-gray-600 font-mono">{text}</span>
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    {
      title: 'Registered',
      dataIndex: 'is_registered',
      key: 'is_registered',
      render: (isRegistered) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          isRegistered 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isRegistered ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  // Delete handler
  const handleDelete = () => {
    Modal.confirm({
      title: `Are you sure you want to delete ${department.name}?`,
      content: 'This action cannot be undone and will remove all associated students.',
      async onOk() {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.delete(`${ENV_BASE_URL}/api/departments/${id}`, config);
          message.success('Department deleted successfully');
          // Optionally redirect after deletion
          window.location.href = '/departments-roles'; // Adjust route as needed
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete department');
        }
      },
    });
  };

  // Modify handler (placeholder for form submission)
  const handleModifySubmit = async (values) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${ENV_BASE_URL}/api/admin/departments/${id}`, { name: values.name }, config);
      message.success('Department updated successfully');
      setIsModifyModalOpen(false);
      // Refetch or update state manually if needed
      window.location.reload(); // Simple refresh; use refetch if available
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update department');
    }
  };

  // Calculate registration stats
  const totalStudents = students.length;
  const registeredStudents = students.filter(student => student.is_registered).length;
  const registrationPercentage = totalStudents > 0 
    ? Math.round((registeredStudents / totalStudents) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/departments-roles`}>
        <div className="flex items-center bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 rounded-md shadow-sm"
        >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Departments
        </div>
         
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {department.name}
              </h1>
              <p className="text-gray-500">Department ID: {id}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsModifyModalOpen(true)}
                className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 rounded-md shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Department
              </Button>
              <Button 
                danger 
                onClick={handleDelete}
                className="flex items-center bg-red-50 text-red-600 hover:bg-red-100 border-red-200 rounded-md shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Department
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Students</h3>
            <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registered</h3>
            <p className="text-2xl font-bold text-green-600">{registeredStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Rate</h3>
            <p className="text-2xl font-bold text-purple-600">{registrationPercentage}%</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Student List</h2>
          <Table
            dataSource={students}
            columns={studentColumns}
            rowKey="student_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              className: "p-4"
            }}
            rowClassName="hover:bg-gray-50"
          />
        </div>
      </div>
      
      {/* Modify Department Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-800">
            Edit Department Details
          </div>
        }
        open={isModifyModalOpen}
        onCancel={() => setIsModifyModalOpen(false)}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            handleModifySubmit({ name });
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={department.name}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button 
              onClick={() => setIsModifyModalOpen(false)}
              className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 rounded-md"
            >
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
        </form>
      </Modal>
    </div>
  );
}

export default DepartmentsId;