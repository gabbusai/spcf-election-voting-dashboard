import React, { useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useFetchCandidates, useFetchPositions } from '../utils/queries';
import PositionForm from './SubPages/PositionForm';
import CandidateForm from './SubPages/CandidateForm';
import PartylistForm from './SubPages/PartylistForm';
import { useAuthContext } from '../utils/AuthContext';
import axios from 'axios';

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
          await axios.delete(`/api/admin/remove-candidate/${candidateId}`, config); // Adjust endpoint if different
          message.success('Candidate removed successfully');
          refetchCandidates();
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to remove candidate');
        }
      },
    });
  };

  // Position Table columns
  const positionColumns = [
    { title: 'Position Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Election Type',
      dataIndex: 'is_general',
      key: 'is_general',
      render: (isGeneral) => (isGeneral ? 'General' : 'Departmental'),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (department ? department.name : 'N/A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => openPositionModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDeletePosition(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Candidate Table columns
  const candidateColumns = [
    { title: 'Candidate Name', dataIndex: ['user', 'name'], key: 'candidate_name' },
    { title: 'Student Number', dataIndex: ['user', 'student_id'], key: 'student_id' },
    { title: 'Email', dataIndex: ['user', 'email'], key: 'email' },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (department ? department.name : 'N/A'),
    },
    { title: 'Election', dataIndex: ['election', 'election_name'], key: 'election' },
    { title: 'Position', dataIndex: ['position', 'name'], key: 'position' },
    { title: 'Party List', dataIndex: ['partylist', 'name'], key: 'partylist' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => openCandidateModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDeleteCandidate(record.id)}>
            Remove
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ marginLeft: 20, paddingRight: 20 }}>
      <h2>Positions and Candidates</h2>

      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => openPositionModal()}>
          Add Position
        </Button>
        <Button type="primary" onClick={() => openCandidateModal()} style={{ marginLeft: 10 }}>
          Add Candidate
        </Button>
        <Button type="primary" onClick={() => openPartylistModal()} style={{ marginLeft: 10 }}>
          Add Party List
        </Button>
      </div>

      <Table
        dataSource={positions}
        columns={positionColumns}
        loading={positionsLoading}
        rowKey="id"
        style={{ marginBottom: 20 }}
      />

      <Table
        dataSource={candidates}
        columns={candidateColumns}
        loading={candidatesLoading}
        rowKey="id"
      />

      {/* Position Modal */}
      <Modal
        title={selectedPosition ? 'Edit Position' : 'Add Position'}
        open={isPositionModalOpen}
        onCancel={closePositionModal}
        footer={null}
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
        title={selectedCandidate ? 'Edit Candidate' : 'Add Candidate'}
        open={isCandidateModalOpen}
        onCancel={closeCandidateModal}
        footer={null}
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
        title={selectedPartylist ? 'Edit Party List' : 'Add Party List'}
        open={isPartylistModalOpen}
        onCancel={closePartylistModal}
        footer={null}
      >
        <PartylistForm
          partylist={selectedPartylist}
          onClose={closePartylistModal}
          //onRefresh={handleRefresh} // Assuming no fetch hook for partylists yet
          token={token}
        />
      </Modal>
    </div>
  );
};

export default PositionsCandidates;