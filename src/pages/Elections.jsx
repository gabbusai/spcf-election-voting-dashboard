import React from 'react';
import { Link } from 'react-router-dom';
import { FaPoll, FaPlusCircle, FaChartBar } from 'react-icons/fa';

function Elections() {
  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Elections Management</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* View All Elections */}
          <Link
            to="/elections/all"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <FaPoll className="text-3xl text-indigo-600 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-800">View All Elections</h3>
            </div>
            <p className="text-gray-600">Browse through the list of all elections. You can view election details and results.</p>
          </Link>

          {/* Create New Election */}
          <Link
            to="/elections/create"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <FaPlusCircle className="text-3xl text-green-600 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-800">Create New Election</h3>
            </div>
            <p className="text-gray-600">Start a new election by setting up election parameters and candidates.</p>
          </Link>

          {/* Election Reports */}
          <Link
            to="/elections/reports-list"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <FaChartBar className="text-3xl text-purple-600 mr-3" />
              <h3 className="text-2xl font-semibold text-gray-800">Election Reports</h3>
            </div>
            <p className="text-gray-600">Generate detailed reports for all elections, including vote counts and results analysis.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Elections;
