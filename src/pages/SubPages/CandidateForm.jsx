import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { useFetchElections, useFetchPartyList, useFetchPositions } from '../../utils/queries';
import { useAuthContext } from '../../utils/AuthContext';
import { ENV_BASE_URL } from '../../../DummyENV';

const { Option } = Select;

const CandidateForm = ({ onClose, onRefresh, candidate = null }) => {
  const [form] = Form.useForm();
  const { token } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  // Fetch data using custom hooks
  const { data: positions, isLoading: positionsLoading } = useFetchPositions();
  const { data: electionsData, isLoading: electionsLoading } = useFetchElections(token);
  const { data: partylist, isLoading: partylistLoading } = useFetchPartyList(token);

  // State for processed election data and filtered positions
  const [elections, setElections] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);

  // Update elections state when data changes
  useEffect(() => {
    if (electionsData?.elections) {
      setElections(electionsData.elections);
    }
  }, [electionsData]);

  // Filter positions based on selected election
  useEffect(() => {
    if (selectedElectionId && positions) {
      const selectedElection = elections.find(e => e.id === selectedElectionId);
      if (selectedElection) {
        const electionDeptId = selectedElection.department_id;
        setFilteredPositions(
          positions.filter(position => {
            // For general elections (department_id null), show only general positions
            if (!electionDeptId) {
              return position.is_general === 1;
            }
            // For departmental elections, show only positions matching the department
            return position.department_id === electionDeptId && position.is_general === 0;
          })
        );
      }
    } else {
      setFilteredPositions([]);
    }
  }, [selectedElectionId, positions, elections]);

  // Set form values when editing existing candidate
  useEffect(() => {
    if (candidate) {
      form.setFieldsValue({
        student_id: candidate.student_id,
        election_id: candidate.election_id,
        position_id: candidate.position_id,
        party_list_id: candidate.party_list_id,
      });
      setSelectedElectionId(candidate.election_id); // Set initial election for edit mode
    } else {
      form.resetFields();
      setSelectedElectionId(null);
    }
  }, [candidate, form]);

  // Handle election selection change
  const handleElectionChange = (value) => {
    setSelectedElectionId(value);
    form.setFieldsValue({ position_id: null }); // Reset position when election changes
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (candidate) {
        await axios.put(`${ENV_BASE_URL}/api/edit-candidate`, values, config);
        message.success('Candidate updated successfully');
      } else {
        await axios.post(`${ENV_BASE_URL}/api/file-candidate`, values, config);
        message.success('Candidacy filed successfully');
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving candidate:', error);
      message.error(error.response?.data?.message || 'Error saving candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (positionsLoading || electionsLoading || partylistLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        student_id: null,
        election_id: null,
        position_id: null,
        party_list_id: null,
      }}
    >
      <Form.Item
        label="Student ID"
        name="student_id"
        rules={[{ required: true, message: 'Please enter the student ID' }]}
      >
        <Input 
          placeholder="Enter student ID" 
          type="number" 
          disabled={!!candidate} // Disable when editing
        />
      </Form.Item>

      <Form.Item
        label="Election"
        name="election_id"
        rules={[{ required: true, message: 'Please select an election' }]}
      >
        <Select 
          placeholder="Select election" 
          loading={electionsLoading}
          onChange={handleElectionChange}
        >
          {elections?.map((election) => (
            <Option key={election.id} value={election.id}>
              {election.election_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Position"
        name="position_id"
        rules={[{ required: true, message: 'Please select a position' }]}
      >
        <Select 
          placeholder="Select position" 
          loading={positionsLoading}
          disabled={!selectedElectionId} // Disable until election is selected
        >
          {filteredPositions.map((position) => (
            <Option key={position.id} value={position.id}>
              {position.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Party List"
        name="party_list_id"
        rules={[{ required: true, message: 'Please select a party list' }]}
      >
        <Select placeholder="Select party list" loading={partylistLoading}>
          {partylist?.map((party) => (
            <Option key={party.id} value={party.id}>
              {party.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isSubmitting} 
          style={{ marginRight: 10 }}
        >
          {candidate ? 'Update Candidate' : 'Add Candidate'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};

export default CandidateForm;