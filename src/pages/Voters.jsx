import React, { useEffect, useState } from 'react';
import { useFetchStudents } from '../utils/queries';
import { useAuthContext } from '../utils/AuthContext';
import { Table, Button, Input, Spin, Modal, message, Upload } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import EditStudentModal from './Students/EditStudentModal'; 
import GenerateTokenModal from './Students/GenerateTokenModal'; 
import axios from 'axios';
import { importStudentCSV } from '../utils/api';
import { ENV_BASE_URL } from '../../DummyENV';

function Voters() {
  const { token } = useAuthContext();
  const [search, setSearch] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchStudents(token, 15, search);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle search
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Handle edit
  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditModalVisible(true);
  };

  // Handle generate token
  const handleGenerateToken = (student) => {
    setSelectedStudent(student);
    setGenerateModalVisible(true);
  };

  // Handle delete
  const handleDelete = (studentId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this student?',
      content: 'This action cannot be undone and will remove associated user data.',
      async onOk() {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.delete(`${ENV_BASE_URL}/api/admin/students/${studentId}`, config);
          message.success('Student deleted successfully');
          refetch();
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete student');
        }
      },
    });
  };

  // Handle CSV upload
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await importStudentCSV(file, token);
      message.success(`Imported ${response.count} students successfully`);
      refetch(); // Refresh the student list
    } catch (error) {
      message.error(error.message || 'Failed to import students');
    } finally {
      setUploading(false);
    }
  };

  // Upload props for Ant Design Upload component
  const uploadProps = {
    accept: '.csv',
    showUploadList: false,
    beforeUpload: (file) => {
      handleUpload(file);
      return false; // Prevent automatic upload by Upload component
    },
  };

  if (isLoading && !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading students..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 max-w-4xl mx-auto">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Unable to load students data: {error?.message}</span>
      </div>
    );
  }

  const students = data?.pages.flatMap((page) => page.students) || [];

  // Define columns for the students table
  const studentColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    { 
      title: 'Department ID', 
      dataIndex: 'department_id', 
      key: 'department_id',
    },
    { 
      title: 'Registered', 
      dataIndex: 'is_registered', 
      key: 'is_registered',
      render: (isRegistered) => (
        <span className={isRegistered ? 'text-green-600' : 'text-red-600'}>
          {isRegistered ? 'Yes' : 'No'}
        </span>
      ),
    },
    { 
      title: 'Token OTPs', 
      dataIndex: 'tokenOTPs', 
      key: 'tokenOTPs',
      render: (tokenOTPs) => (
        typeof tokenOTPs === 'string' 
          ? <span className="text-gray-500">{tokenOTPs}</span>
          : tokenOTPs.length > 0 
            ? tokenOTPs.map((otp) => (
                <div key={otp.id} className="text-sm">
                  {otp.tokenOTP} ({otp.used ? 'Used' : 'Active'})
                </div>
              ))
            : 'None'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-700 border-none"
            onClick={() => handleGenerateToken(record)}
            disabled={!record.is_registered}
          >
            Generate Token
          </Button>
          <Button
            type="default"
            className="bg-blue-600 hover:bg-blue-700 text-white border-none"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            className="bg-red-500 hover:bg-red-600 border-none"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Voters</h1>
        <div className="flex space-x-4 items-center">
          <Upload {...uploadProps}>
            <Button
              icon={<UploadOutlined />}
              className="bg-blue-600 hover:bg-blue-700 text-white border-none"
              loading={uploading}
            >
              {uploading ? 'Uploading...' : 'Import Students CSV'}
            </Button>
          </Upload>
          <Input.Search
            placeholder="Search by name or ID"
            onSearch={handleSearch}
            enterButton={<Button type="primary" icon={<SearchOutlined />} />}
            className="w-64"
            allowClear
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-700">Students Overview</h2>
          <p className="text-sm text-gray-500">Manage students and their registration status</p>
        </div>

        <Table
          dataSource={students}
          columns={studentColumns}
          rowKey="id"
          pagination={false}
          loading={isLoading}
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center my-6">
          <Spin tip="Loading more students..." />
        </div>
      )}

      <div className="mt-6 text-center">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-md"
        >
          {hasNextPage ? 'Load More' : 'No More Students'}
        </Button>
      </div>

      {/* Edit Student Modal */}
      {selectedStudent && (
        <EditStudentModal
          visible={editModalVisible}
          student={selectedStudent}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedStudent(null);
          }}
          token={token}
          onRefresh={refetch}
        />
      )}

      {/* Generate Token Modal */}
      {selectedStudent && (
        <GenerateTokenModal
          visible={generateModalVisible}
          student={selectedStudent}
          onClose={() => {
            setGenerateModalVisible(false);
            setSelectedStudent(null);
          }}
          token={token}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}

export default Voters;