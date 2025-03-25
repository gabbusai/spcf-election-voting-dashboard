import React, { useState } from "react";
import { useAuthContext } from "../utils/AuthContext";
import StatsCard from "../components/StatsCard";
import { useFetchDashboard } from "../utils/queries";
import { FiUsers, FiClipboard, FiShield, FiLock } from "react-icons/fi"; // Added icons for buttons
import { Modal } from "antd";
import AdminPromotionForm from "./SubPages/AdminPromotionForm";
import ResetPasswordForm from "./SubPages/ResetPasswordForm";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function Dashboard() {
  const { user, token } = useAuthContext();
  const [
    { data: electionsData, isLoading: isElectionsLoading },
    { data: registeredData, isLoading: isRegisteredLoading },
    {data: departmentData, isLoading: isDepartmentLoading},

  ] = useFetchDashboard(token);

  console.log(electionsData)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  if (isElectionsLoading || isRegisteredLoading || isDepartmentLoading) {
    return <div>LOADING...</div>;
  }
console.log(departmentData)
  // Transform data to include unregistered students for stacking
const chartData = departmentData.departments.map(dept => ({
  name: dept.department_name,
  registered: dept.registered_students,
  unregistered: dept.total_students - dept.registered_students,
  total: dept.total_students, // For tooltip reference
}));

  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);

  const openResetPasswordModal = () => setIsResetPasswordModalOpen(true);
  const closeResetPasswordModal = () => setIsResetPasswordModalOpen(false);

  const totalStudents = registeredData.total_students || 0;
  const registeredStudents = registeredData.total_registered || 0;
  const turnoutPercentage = Math.round((registeredStudents / totalStudents) * 100);
  // Colors for the pie chart
  const COLORS = ["#00C49F", "#FF8042"];
  // Prepare data for election statistics pie chart
  const dataChart = [
    {
      name: "Registered",
      value: registeredStudents,
      percentage: turnoutPercentage,
    },
    {
      name: "Unregistered",
      value: totalStudents - registeredStudents,
      percentage:
        totalStudents > 0
          ? (
              ((totalStudents - registeredStudents) / totalStudents) *
              100
            ).toFixed(2)
          : 0,
    },
  ].filter((item) => item.value >= 0); // Ensure no negative values

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
          statistic={registeredData?.total_registered || 0}
          icon={<FiUsers />}
          trend="down"
        />
        <StatsCard
          title="Total Students"
          bgColor="#f59e0b"
          color="#fff"
          statistic={registeredData?.total_students || 0}
          icon={<FiUsers />}
          trend="neutral"
        />
      </div>
      <div className="w-[90%] m-auto grid grid-cols-2 place-items-center">
      <div className="w-[70%] bg-slate-200 rounded-xl my-5 shadow-lg">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={dataChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {dataChart.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${
                  dataChart.find((d) => d.name === name)?.percentage
                }%)`,
                name,
              ]}
            />
            <Legend
              formatter={(value) => {
                const entry = dataChart.find((d) => d.name === value);
                return `${value} - ${entry?.percentage}%`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[90%] w-[90%] p-4 rounded-xl bg-zinc-200 shadow-xl">
      <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: 'Departments', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                        formatter={(value, name) => [value, name]}
                        labelFormatter={(label) => `Department: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="registered" stackId="a" fill="#82ca9d" name="Registered Students" />
                    <Bar dataKey="unregistered" stackId="a" fill="#8884d8" name="Unregistered Students" />
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
              
      </div>


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
