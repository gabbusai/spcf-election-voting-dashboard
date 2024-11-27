import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../utils/AuthContext';
import { useFetchDepartments } from '../../utils/queries';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use `useNavigate` instead of `useHistory`
import { getMakeElection } from '../../utils/api';

function ElectionsCreatePage() {
  const { user, token } = useAuthContext();
  const navigate = useNavigate(); // Initialize the navigate function

  const { data, isLoading, isError } = useFetchDepartments();
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    election_name: '',
    election_type_id: 1,  // default to 'general'
    department_id: '',
    campaign_start_date: '',
    campaign_end_date: '',
    election_start_date: '',
    election_end_date: '',
    status: 'upcoming',
  });

  useEffect(() => {
    if (data && data.departments) {
      setDepartments(data.departments);
    }
  }, [data]);

  const electionTypes = [
    { id: 1, name: 'general' },
    { id: 2, name: 'departmental' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getMakeElection(token, formData); // Await the API call
  
      if (response.success) { // Check for success in the response
        navigate('/elections'); // Redirect if successful
      } else {
        console.error("Election creation failed:", response.message); // Handle failure case
      }
    } catch (error) {
      console.error("There was an error creating the election", error);
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Create New Election</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {/* Election Name */}
          <div className="mb-4">
            <label htmlFor="election_name" className="block text-gray-700">Election Name</label>
            <input 
              type="text" 
              id="election_name" 
              className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
              value={formData.election_name}
              onChange={(e) => setFormData({ ...formData, election_name: e.target.value })}
              required 
            />
          </div>

          {/* Election Type */}
          <div className="mb-4">
            <label htmlFor="election_type_id" className="block text-gray-700">Election Type</label>
            <select
              id="election_type_id"
              className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
              value={formData.election_type_id}
              onChange={(e) => setFormData({ ...formData, election_type_id: parseInt(e.target.value, 10) })}
            >
              <option value="">Select Election Type</option>
              {electionTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          {formData.election_type_id !== 1 && ( // Only display department selection if election type is not 'general'
            <div className="mb-4">
              <label htmlFor="department_id" className="block text-gray-700">Department</label>
              <select
                id="department_id"
                className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
                value={formData.department_id}
                onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value, 10) })}
              >
                <option value="">Select Department</option>
                {data.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Campaign Dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="campaign_start_date" className="block text-gray-700">Campaign Start Date</label>
              <input
                type="datetime-local"
                id="campaign_start_date"
                className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
                value={formData.campaign_start_date}
                onChange={(e) => setFormData({ ...formData, campaign_start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="campaign_end_date" className="block text-gray-700">Campaign End Date</label>
              <input
                type="datetime-local"
                id="campaign_end_date"
                className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
                value={formData.campaign_end_date}
                onChange={(e) => setFormData({ ...formData, campaign_end_date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Election Dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="election_start_date" className="block text-gray-700">Election Start Date</label>
              <input
                type="datetime-local"
                id="election_start_date"
                className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
                value={formData.election_start_date}
                onChange={(e) => setFormData({ ...formData, election_start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="election_end_date" className="block text-gray-700">Election End Date</label>
              <input
                type="datetime-local"
                id="election_end_date"
                className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
                value={formData.election_end_date}
                onChange={(e) => setFormData({ ...formData, election_end_date: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700">Status</label>
            <select
              id="status"
              className="text-[15px] px-3 h-[35px] w-full rounded-xl border border-gray-300"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Create Election
          </button>
        </form>
      </div>
    </div>
  );
}

export default ElectionsCreatePage;
