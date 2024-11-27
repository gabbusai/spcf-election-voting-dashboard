import React from 'react';
import { useAuthContext } from '../utils/AuthContext';
import StatsCard from '../components/StatsCard';
import { useFetchDashboard, useFetchPositions } from '../utils/queries';
import { FiUsers, FiClipboard } from 'react-icons/fi';

function Dashboard() {
  const { user, token } = useAuthContext();
  const [{ data: electionsData, isLoading: isElectionsLoading }, { data: registeredData, isLoading: isRegisteredLoading }] = useFetchDashboard(token);
 
  if (isElectionsLoading || isRegisteredLoading) {
    return <div>LOADING...</div>;
  }


  return (
    <div className="h-screen w-full p-6">
      <p>Hello {user.name}</p>

      <div className="grid grid-cols-4 gap-4">
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
    </div>
  );
}

export default Dashboard;
