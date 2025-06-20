import React from 'react';

export default function UserManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>
      <p className="text-gray-600">Here you can manage user accounts.</p>
      {/* Placeholder content for user management */}
      <div className="mt-8">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Add New User
        </button>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Registered Users</h2>
          <p className="text-gray-600">No users found. Click "Add New User" to create one.</p>
          {/* Example list item:
          <div className="border-b py-2 flex justify-between items-center">
            <div>
              <h3 className="text-lg">admin_user</h3>
              <p className="text-sm text-gray-500">Role: Admin | Active: Yes</p>
            </div>
            <button className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">
              Delete
            </button>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
