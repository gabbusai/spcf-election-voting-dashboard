import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchElectionById } from '../../utils/queries';
import { useAuthContext } from '../../utils/AuthContext';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  Users, 
  User, 
  CheckCircle, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ENV_BASE_URL } from '../../../DummyENV';

function ElectionDetailsPage() {
  const { user, token } = useAuthContext();
  const { id } = useParams();
  const { data: election, isLoading, isError, refetch } = useFetchElectionById(token, id);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle status update with loading state
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${ENV_BASE_URL}/api/admin/elections/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refetch(); // Refresh election data
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update election status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle between 'ongoing' and 'completed'
  const handleToggleStatus = () => {
    const currentStatus = election.election.status;
    const newStatus = currentStatus === 'ongoing' ? 'completed' : 'ongoing';
    handleStatusChange(newStatus);
  };

  // Render loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-2xl text-gray-500">Loading Election Details...</div>
      </div>
    );
  }

  if (isError || !election) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50">
        <XCircle className="text-red-500 w-24 h-24 mb-4" />
        <h2 className="text-2xl font-bold text-red-700">Error Fetching Election Details</h2>
        <p className="text-red-600 mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  const isAdmin = user?.role_id === 3;
  const canStart = election.election.status === 'upcoming';
  const canEnd = election.election.status === 'ongoing';

  // Status color mapping
  const statusColors = {
    'upcoming': 'bg-blue-100 text-blue-800',
    'ongoing': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Election Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{election.election_name}</h1>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[election.election.status]}`}>
              {election.election.status.charAt(0).toUpperCase() + election.election.status.slice(1)}
            </div>
          </div>

          {/* Status Change Buttons (Admin Only) */}
          {isAdmin && (
            <div className="flex space-x-3">
              {canStart && (
                <button
                  onClick={() => handleStatusChange('ongoing')}
                  disabled={isUpdating}
                  className="btn btn-primary flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Start Election</span>
                </button>
              )}
              {canEnd && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={isUpdating}
                  className="btn btn-danger flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  <XCircle className="w-5 h-5" />
                  <span>End Election</span>
                </button>
              )}
              <button
                onClick={handleToggleStatus}
                disabled={isUpdating || election.election.status === 'upcoming'}
                className="btn btn-secondary flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Toggle Status</span>
              </button>
            </div>
          )}
        </div>

        {/* Election Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Election Timeline */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="mr-2 text-blue-500" /> Election Timeline
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Campaign Start', date: election.election.campaign_start_date },
                { label: 'Campaign End', date: election.election.campaign_end_date },
                { label: 'Election Start', date: election.election.election_start_date },
                { label: 'Election End', date: election.election.election_end_date }
              ].map((timeline, index) => (
                <div key={index} className="flex items-center">
                  <Clock className="mr-2 text-gray-500 w-5 h-5" />
                  <span className="font-medium text-gray-700">{timeline.label}:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(timeline.date).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Election Info */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-green-500" /> Election Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Department</span>
                <span className="font-medium">{election.election.department_id || 'All Departments'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Created At</span>
                <span className="font-medium">{new Date(election.election.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{new Date(election.election.updated_at).toLocaleString()}</span>
              </div>

                {
                    election.election.status === 'ongoing' &&
                <Link className='btn btn-primary flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition'
                to={`/elections/results/${election.election.id}`}>
                See Results
                </Link>
                }
                {
                    election.election.status === 'completed' &&
                <Link className='btn btn-primary flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition'
                to={`/elections/results/${election.election.id}`}>
                See Results
                </Link>
                }
                
            </div>
          </div>
        </div>

        {/* Positions and Candidates */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Positions */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-purple-500" /> Positions
            </h2>
            <ul className="space-y-2">
              {election.positions.map((position) => (
                <li 
                  key={position.id} 
                  className="bg-gray-100 rounded-md px-4 py-2 flex items-center"
                >
                  <User className="mr-2 text-gray-500" />
                  {position.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Candidates */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-indigo-500" /> Candidates
            </h2>
            <div className="space-y-4">
              {election.candidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="bg-gray-100 rounded-lg p-4 hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{candidate.user.name}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {candidate.party_list.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div><strong>Position:</strong> {election.positions.find((p) => p.id === candidate.position_id)?.name}</div>
                    <div><strong>Department:</strong> {candidate.department.name}</div>
                    <div><strong>Email:</strong> {candidate.user.email}</div>
                    <div><strong>Contact:</strong> {candidate.user.contact_no}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectionDetailsPage;