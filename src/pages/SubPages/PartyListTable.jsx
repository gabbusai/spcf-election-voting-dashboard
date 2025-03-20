import React from 'react';
import { Table, Button, Badge } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const PartyListTable = ({ 
  partylists, 
  loading, 
  onEdit, 
  onDelete 
}) => {
  // Partylist Table columns
  const partylistColumns = [
    { 
      title: 'Party List Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        text ? <span className="text-gray-600">{text}</span> : <span className="text-gray-400 italic">No description</span>
      ),
    },
    {
      title: 'Candidates',
      dataIndex: 'candidates',
      key: 'candidates',
      render: (candidates) => (
        <Badge 
          count={candidates?.length || 0} 
          style={{ 
            backgroundColor: candidates?.length ? '#6366F1' : '#D1D5DB',
            fontSize: '12px',
            padding: '0 8px'
          }}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            onClick={() => onEdit(record)} 
            icon={<EditOutlined />}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 rounded-md shadow-sm"
          >
            Edit
          </Button>
          <Button 
            danger 
            onClick={() => onDelete(record.id)}
            icon={<DeleteOutlined />}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 rounded-md shadow-sm"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-700">Party Lists</h3>
        <p className="text-sm text-gray-500">Manage party lists for election candidates</p>
      </div>
      
      <Table
        dataSource={partylists}
        columns={partylistColumns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          className: "p-4"
        }}
        rowClassName="hover:bg-gray-50"
      />
    </div>
  );
};

export default PartyListTable;