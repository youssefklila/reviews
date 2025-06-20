import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome to the admin dashboard. Select an option from the sidebar to get started.</p>
      {/* Placeholder content for the dashboard */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Quick Stats</h2>
          <p className="text-gray-600">Users: 120</p>
          <p className="text-gray-600">Reviews: 340</p>
          <p className="text-gray-600">Voting Sessions: 15</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Recent Activity</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>New user registered: John Doe</li>
            <li>Review submitted for Room 101</li>
            <li>Voting session "Best Amenities" ended</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
