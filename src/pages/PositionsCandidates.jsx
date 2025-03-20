import React, { useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useFetchCandidates, useFetchPartyList, useFetchPositions } from '../utils/queries';
import PositionForm from './SubPages/PositionForm';
import CandidateForm from './SubPages/CandidateForm';
import PartylistForm from './SubPages/PartylistForm';
import { useAuthContext } from '../utils/AuthContext';
import axios from 'axios';
import PartyListTable from './SubPages/PartyListTable';

const PositionsCandidates = () => {
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isPartylistModalOpen, setIsPartylistModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedPartylist, setSelectedPartylist] = useState(null);
  const { token } = useAuthContext();

  const { data: positions, isLoading: positionsLoading, refetch: refetchPositions } = useFetchPositions();
  const { data: candidates, isLoading: candidatesLoading, refetch: refetchCandidates } = useFetchCandidates();
  const { data: partylists, isLoading: partylistsLoading, refetch: refetchPartyLists } = useFetchPartyList(token);

  // Handlers for modal visibility
  const openPositionModal = (position = null) => {
    setSelectedPosition(position);
    setIsPositionModalOpen(true);
  };

  const closePositionModal = () => {
    setSelectedPosition(null);
    setIsPositionModalOpen(false);
  };

  const openCandidateModal = (candidate = null) => {
    setSelectedCandidate(candidate);
    setIsCandidateModalOpen(true);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
    setIsCandidateModalOpen(false);
  };

  const openPartylistModal = (partylist = null) => {
    setSelectedPartylist(partylist);
    setIsPartylistModalOpen(true);
  };

  const closePartylistModal = () => {
    setSelectedPartylist(null);
    setIsPartylistModalOpen(false);
  };

  // Delete handlers
  const handleDeletePosition = async (positionId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this position?',
      content: 'This action cannot be undone.',
      async onOk() {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
          };
          await axios.delete(`/api/positions-delete/${positionId}`, config);
          message.success('Position deleted successfully');
          refetchPositions();
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete position');
        }
      },
    });
  };

  const handleDeleteCandidate = async (candidateId) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this candidate?',
      content: 'This will remove their candidacy status.',
      async onOk() {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
          };
          await axios.delete(`/api/admin/remove-candidate/${candidateId}`, config);
          message.success('Candidate removed successfully');
          refetchCandidates();
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to remove candidate');
        }
      },
    });
  };

  const handleDeletePartylist = async (partylistId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this party list?',
      content: 'This will remove the party list and set all its candidates to Independent.',
      async onOk() {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
          }; 
          await axios.delete(`/api/admin/partylist/${partylistId}`, config);
          message.success('Party list deleted successfully');
          refetchPartyLists();
          refetchCandidates();
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete party list');
        }
      },
    });
  };

  // Position Table columns
  const positionColumns = [
    { 
      title: 'Position Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Election Type',
      dataIndex: 'is_general',
      key: 'is_general',
      render: (isGeneral) => (
        <span className={`px-2 py-1 rounded-full text-sm ${isGeneral 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-indigo-100 text-indigo-800'}`}>
          {isGeneral ? 'General' : 'Departmental'}
        </span>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        department 
          ? <span className="text-gray-800">{department.name}</span> 
          : <span className="text-gray-400 italic">N/A</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            onClick={() => openPositionModal(record)} 
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 rounded-md shadow-sm"
          >
            Edit
          </Button>
          <Button 
            danger 
            onClick={() => handleDeletePosition(record.id)}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 rounded-md shadow-sm"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Candidate Table columns
  const candidateColumns = [
    { 
      title: 'Candidate Name', 
      dataIndex: ['user', 'name'], 
      key: 'candidate_name',
      render: (text) => <span className="font-medium">{text}</span>
    },
    { 
      title: 'Student Number', 
      dataIndex: ['user', 'student_id'], 
      key: 'student_id',
      render: (text) => <span className="text-gray-600">{text}</span>
    },
    { 
      title: 'Email', 
      dataIndex: ['user', 'email'], 
      key: 'email',
      render: (text) => <span className="text-gray-600">{text}</span>
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        department 
          ? <span className="text-gray-800">{department.name}</span> 
          : <span className="text-gray-400 italic">N/A</span>
      ),
    },
    { 
      title: 'Election', 
      dataIndex: ['election', 'election_name'], 
      key: 'election',
      render: (text) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          {text}
        </span>
      )
    },
    { 
      title: 'Position', 
      dataIndex: ['position', 'name'], 
      key: 'position',
      render: (text) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {text}
        </span>
      )
    },
    { 
      title: 'Party List', 
      dataIndex: ['partylist', 'name'], 
      key: 'partylist',
      render: (text) => (
        text ? (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            {text}
          </span>
        ) : (
          <span className="text-gray-400 italic">Independent</span>
        )
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            onClick={() => openCandidateModal(record)} 
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 rounded-md shadow-sm"
          >
            Edit
          </Button>
          <Button 
            danger 
            onClick={() => handleDeleteCandidate(record.id)}
            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 rounded-md shadow-sm"
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Positions and Candidates</h2>
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            onClick={() => openPositionModal()}
            className="flex items-center bg-blue-600 hover:bg-blue-700 border-none rounded-md shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Position
          </Button>
          <Button 
            type="primary" 
            onClick={() => openCandidateModal()} 
            className="flex items-center bg-green-600 hover:bg-green-700 border-none rounded-md shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Candidate
          </Button>
          <Button 
            type="primary" 
            onClick={() => openPartylistModal()} 
            className="flex items-center bg-purple-600 hover:bg-purple-700 border-none rounded-md shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Party List
          </Button>
        </div>
      </div>

      {/* Party Lists Table */}
      <PartyListTable
        partylists={partylists}
        loading={partylistsLoading}
        onEdit={openPartylistModal}
        onDelete={handleDeletePartylist}
      />

      {/* Positions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-700">Election Positions</h3>
          <p className="text-sm text-gray-500">Manage available positions for elections</p>
        </div>
        
        <Table
          dataSource={positions}
          columns={positionColumns}
          loading={positionsLoading}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            className: "p-4"
          }}
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-700">Election Candidates</h3>
          <p className="text-sm text-gray-500">Manage registered candidates for all positions</p>
        </div>
        
        <Table
          dataSource={candidates}
          columns={candidateColumns}
          loading={candidatesLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            className: "p-4"
          }}
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {/* Position Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-800">
            {selectedPosition ? 'Edit Position' : 'Add Position'}
          </div>
        }
        open={isPositionModalOpen}
        onCancel={closePositionModal}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <PositionForm
          position={selectedPosition}
          onClose={closePositionModal}
          onRefresh={refetchPositions}
          token={token}
        />
      </Modal>

      {/* Candidate Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-800">
            {selectedCandidate ? 'Edit Candidate' : 'Add Candidate'}
          </div>
        }
        open={isCandidateModalOpen}
        onCancel={closeCandidateModal}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <CandidateForm
          candidate={selectedCandidate}
          onClose={closeCandidateModal}
          onRefresh={refetchCandidates}
          token={token}
        />
      </Modal>

      {/* Partylist Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-gray-800">
            {selectedPartylist ? 'Edit Party List' : 'Add Party List'}
          </div>
        }
        open={isPartylistModalOpen}
        onCancel={closePartylistModal}
        footer={null}
        className="rounded-lg overflow-hidden"
      >
        <PartylistForm
          partylist={selectedPartylist}
          onClose={closePartylistModal}
          onRefresh={refetchPartyLists}
          token={token}
        />
      </Modal>
    </div>
  );
};

export default PositionsCandidates;