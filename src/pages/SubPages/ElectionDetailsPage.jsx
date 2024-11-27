import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchElectionById } from '../../utils/queries';
import { useAuthContext } from '../../utils/AuthContext';

function ElectionDetailsPage() {
    const { user, token } = useAuthContext();
    const { id } = useParams(); // Get the election ID from the URL

    // Fetch election data using the custom hook
    const { data: election, isLoading, isError } = useFetchElectionById(token, id);
   
    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (isError) {
        return <div>Error fetching election details. Please try again later.</div>;
    }

    // Handle case where election data might not be found
    if (!election) {
        return <div>Election not found.</div>;
    }else{
        console.log(election.election);
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8">{election.election_name}</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <p className="text-gray-600">Status: <span className="font-semibold">{election.election.status}</span></p>
                <p className="text-gray-600">Campaign Start: {new Date(election.election.campaign_start_date).toLocaleString()}</p>
                <p className="text-gray-600">Campaign End: {new Date(election.election.campaign_end_date).toLocaleString()}</p>
                <p className="text-gray-600">Election Start: {new Date(election.election.election_start_date).toLocaleString()}</p>
                <p className="text-gray-600">Election End: {new Date(election.election.election_end_date).toLocaleString()}</p>
                <p className="text-gray-600">Department ID: {election.election.department_id || "N/A"}</p>
                <p className="text-gray-600">Created At: {new Date(election.election.created_at).toLocaleString()}</p>
                <p className="text-gray-600">Updated At: {new Date(election.election.updated_at).toLocaleString()}</p>
            </div>

            {/* Display positions */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Positions</h2>
                <ul>
                    {election.positions.map(position => (
                        <li key={position.id} className="text-gray-600">
                            {position.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Display candidates */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Candidates</h2>
                {election.candidates.map(candidate => (
                    <div key={candidate.id} className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-700">{candidate.user.name}</h3>
                        <p className="text-gray-600">Position: {election.positions.find(position => position.id === candidate.position_id)?.name}</p>
                        <p className="text-gray-600">Department: {candidate.department.name}</p>
                        <p className="text-gray-600">Party List: {candidate.party_list.name}</p>
                        <p className="text-gray-600">Email: {candidate.user.email}</p>
                        <p className="text-gray-600">Contact: {candidate.user.contact_no}</p>
                        <p className="text-gray-600">Section: {candidate.user.section}</p>
                        <p className="text-gray-600">Role: {candidate.user.role_id === 2 ? 'Student' : 'Admin'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ElectionDetailsPage;
