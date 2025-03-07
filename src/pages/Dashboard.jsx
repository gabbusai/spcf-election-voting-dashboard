import React, { useState } from 'react';
import { useAuthContext } from '../utils/AuthContext';
import StatsCard from '../components/StatsCard';
import { useFetchDashboard } from '../utils/queries';
import { FiUsers, FiClipboard, FiShield, FiLock } from 'react-icons/fi'; // Added icons for buttons
import { Modal } from 'antd';
import AdminPromotionForm from './SubPages/AdminPromotionForm';
import ResetPasswordForm from './SubPages/ResetPasswordForm';

function Dashboard() {
  const { user, token } = useAuthContext();
  const [{ data: electionsData, isLoading: isElectionsLoading }, { data: registeredData, isLoading: isRegisteredLoading }] = useFetchDashboard(token);
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  if (isElectionsLoading || isRegisteredLoading) {
    return <div>LOADING...</div>;
  }

  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);

  const openResetPasswordModal = () => setIsResetPasswordModalOpen(true);
  const closeResetPasswordModal = () => setIsResetPasswordModalOpen(false);

  return (
    <div className="h-screen w-full p-6">
      <p>Hello {user.name}</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Elections"
          bgColor="#6366f1"
          color="#fff"
          statistic={electionsData?.elections_count || 0}
          icon={<FiClipboard />}
        />
        <StatsCard
          title="Active Elections"
          bgColor="#6366f1"
          color="#fff"
          statistic={electionsData?.active_elections_count || 0}
          icon={<FiClipboard />}
          trend="up"
        />
        <StatsCard
          title="Total Registered"
          bgColor="#34d399"
          color="#fff"
          statistic={registeredData?.registered_count || 0}
          icon={<FiUsers />}
          trend="down"
        />
        <StatsCard
          title="Total Students"
          bgColor="#f59e0b"
          color="#fff"
          statistic={registeredData?.students_count || 0}
          icon={<FiUsers />}
          trend="neutral"
        />
      </div>

      {/* Admin Tools */}
      <div className="mb-6 flex space-x-4">
        {user.role_id === 3 && (
          <button
            onClick={openAdminModal}
            className="w-64 h-24 flex items-center px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
          >
            <FiShield className="mr-2" />
            Promote Admin
          </button>
        )}
        <button
          onClick={openResetPasswordModal}
          className="flex items-center px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-teal-500 text-white font-semibold hover:bg-teal-600"
        >
          <FiLock className="mr-2" />
          Change My Password
        </button>
      </div>

      {/* Admin Promotion Modal */}
      <Modal
        title="Promote User to Admin"
        open={isAdminModalOpen}
        onCancel={closeAdminModal}
        footer={null}
      >
        <AdminPromotionForm onClose={closeAdminModal} token={token} />
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title="Change Password"
        open={isResetPasswordModalOpen}
        onCancel={closeResetPasswordModal}
        footer={null}
      >
        <ResetPasswordForm onClose={closeResetPasswordModal} token={token} />
      </Modal>
    </div>
  );
}

export default Dashboard;