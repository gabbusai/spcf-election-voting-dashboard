import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchElections } from '../../utils/queries';
import { useAuthContext } from '../../utils/AuthContext';

function ElectionsListPage() {
  const { user, token } = useAuthContext();
  const { data: elections, isLoading, isError } = useFetchElections(token);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading elections. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">All Elections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections && elections.elections.length > 0 ? (
          elections.elections.map((election) => (
            <div
              key={election.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{election.election_name}</h3>
              <p className="text-gray-600">
                Status: <span className="font-semibold">{election.status}</span>
              </p>
              <p className="text-gray-600">
                Campaign Start: {new Date(election.campaign_start_date).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Campaign End: {new Date(election.campaign_end_date).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Election Start: {new Date(election.election_start_date).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Election End: {new Date(election.election_end_date).toLocaleString()}
              </p>
              <div className="mt-4 w-full grid grid-cols-2 place-items-center">
                <Link
                  to={`/elections/${election.id}`}
                  className="w-[70%] h-18 text-center bg-indigo-600 text-white py-2 px-0 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Details
                </Link>

                <Link
                  to={`/elections/voters/${election.id}`}
                  className="w-[70%] h-18 text-center bg-indigo-600 text-white py-2 px-0 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Voter Status
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No elections available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default ElectionsListPage;
