import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { useFetchCandidates, useFetchPositions } from '../utils/queries';
import PositionForm from './SubPages/PositionForm'; 
import CandidateForm from './SubPages/CandidateForm';

const PositionsCandidates = () => {
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // Fetching positions and candidates data using custom hooks
  const { data: positions, isLoading: positionsLoading } = useFetchPositions();
  const { data: candidates, isLoading: candidatesLoading } = useFetchCandidates();

  if (candidates) {
    console.log(candidates);
  }

  // Handlers for modal visibility
  const openPositionModal = (position = null) => {
    setSelectedPosition(position);
    setIsPositionModalOpen(true);
  };

  const closePositionModal = () => {
    setSelectedPosition(null);
    setIsPositionModalOpen(false);
  };

  const openCandidateModal = () => setIsCandidateModalOpen(true);
  const closeCandidateModal = () => setIsCandidateModalOpen(false);

  // Table columns
  const positionColumns = [
    {
      title: 'Position Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Election Type',
      dataIndex: 'is_general',
      key: 'is_general',
      render: (isGeneral) => (isGeneral ? 'General' : 'Departmental'),
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department_id',
    },
  ];

  const candidateColumns = [
    {
      title: 'Candidate Name',
      dataIndex: ['user', 'name'], // Accessing name inside the user object
      key: 'candidate_name',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'], // Accessing email inside the user object
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: ['user', 'department_id'], // Accessing department_id inside the user object
      key: 'department',
      render: (departmentId) => {
        return departmentId ? `Department ${departmentId}` : 'N/A'; // Example render
      },
    },
    {
      title: 'Election',
      dataIndex: ['election', 'election_name'], // Accessing election_name inside the election object
      key: 'election',
    },
  ];

  return (
    <div>
      <h2>Positions and Candidates</h2>

      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => openPositionModal()}>Add Position</Button>
        <Button type="primary" onClick={openCandidateModal} style={{ marginLeft: 10 }}>Add Candidate</Button>
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
        />
      </Modal>

      {/* Candidate Modal */}
      <Modal
        title="Add Candidate"
        open={isCandidateModalOpen}
        onCancel={closeCandidateModal}
        footer={null}
      >
        <CandidateForm
          onClose={closeCandidateModal}
        />
      </Modal>
    </div>
  );
};

export default PositionsCandidates;
