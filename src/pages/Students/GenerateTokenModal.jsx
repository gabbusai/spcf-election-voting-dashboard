import React from 'react';
import { Modal, Button, message } from 'antd';
import axios from 'axios';

const GenerateTokenModal = ({ visible, student, onClose, token, onRefresh }) => {
  const handleGenerate = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        '/api/admin/token/generate',
        { student_ids: [student.id] },
        config
      );
      const result = response.data.results[student.id];
      if (typeof result === 'string') {
        message.error(result); // e.g., "Student not registered"
      } else {
        message.success(`Token generated: ${result.tokenOTP}, expires at ${result.expires_at}`);
      }
      onClose();
      onRefresh(); // Refetch students to update tokenOTPs
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to generate token');
    }
  };

  return (
    <Modal
      title={`Generate Token for ${student?.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Generate a new OTP token for {student?.name} (ID: {student?.id}). This will create a token valid for 24 hours if the student is registered.
        </p>
        {student?.is_registered ? (
          <p className="text-green-600">Student is registered and eligible for a token.</p>
        ) : (
          <p className="text-red-600">Student is not registered. Token generation will fail.</p>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="rounded-md">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleGenerate}
            className="bg-green-600 hover:bg-green-700 border-none rounded-md"
            disabled={!student?.is_registered} // Disable if not registered
          >
            Generate Token
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateTokenModal;