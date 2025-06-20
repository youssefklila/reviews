import Link from 'next/link';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-semibold hover:text-gray-300 cursor-pointer">Admin Panel</h1>
          </Link>
        </div>
        <nav>
          <ul>
            <li className="mb-3">
              <Link href="/admin/dashboard" className="hover:text-gray-300 block py-2 px-1 rounded transition duration-200">
                Dashboard
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/admin/voting-sessions" className="hover:text-gray-300 block py-2 px-1 rounded transition duration-200">
                Voting Sessions
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/admin/reviews" className="hover:text-gray-300 block py-2 px-1 rounded transition duration-200">
                Reviews Management
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/admin/users" className="hover:text-gray-300 block py-2 px-1 rounded transition duration-200">
                User Management
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
        <div className="mt-auto pt-6">
            <Link href="/" className="hover:text-gray-300 block py-2 px-1 rounded transition duration-200">
                Back to Main Site
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
