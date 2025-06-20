'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { io, Socket } from 'socket.io-client';

// A simple Card component for structure - can be replaced with shadcn/ui Card later
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    <h2 className="text-xl font-semibold text-gray-700 mb-3">{title}</h2>
    <div>{children}</div>
  </div>
);

let socket: Socket | null = null; // Keep socket instance outside component to avoid re-creation on re-renders

export default function AdminDashboardPage() {
  const { t } = useTranslation('common');
  const [isConnected, setIsConnected] = useState(false);
  const [serverMessages, setServerMessages] = useState<string[]>([]);

  useEffect(() => {
    // Function to initialize Socket.IO connection
    const initializeSocket = async () => {
      // First, ensure the server-side handler is initialized by making a fetch request.
      // This is a common pattern for Next.js when using this type of Socket.IO setup.
      await fetch('/api/socketio_handler');

      // Connect to the Socket.IO server using the custom path
      socket = io({
        path: '/api/socketio_endpoint',
        addTrailingSlash: false,
      });

      socket.on('connect', () => {
        console.log('Socket.IO: Connected to server!');
        setIsConnected(true);
        setServerMessages(prev => [...prev, 'Successfully connected to Socket.IO server.']);
        // Example: send a message to the server after connection
        socket?.emit('clientMessage', { message: 'Hello from Admin Dashboard!' });
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO: Disconnected from server. Reason:', reason);
        setIsConnected(false);
        setServerMessages(prev => [...prev, `Disconnected from Socket.IO server: ${reason}`]);
      });

      socket.on('serverMessage', (data: { message: string }) => {
        console.log('Socket.IO: Message from server:', data);
        setServerMessages(prev => [...prev, `Server: ${data.message}`]);
      });

      // Error handling for connection
      socket.on('connect_error', (error) => {
        console.error('Socket.IO: Connection Error:', error.message, error.cause);
        setServerMessages(prev => [...prev, `Connection Error: ${error.message}`]);
        setIsConnected(false);
      });
    };

    if (!socket?.connected) { // Initialize only if not already connected
        initializeSocket();
    }

    // Cleanup on component unmount
    return () => {
      if (socket?.connected) {
        console.log('Socket.IO: Disconnecting socket...');
        socket.disconnect();
      }
      // It's also good practice to remove listeners to prevent memory leaks,
      // though disconnecting usually handles this for built-in events.
      // socket?.off('connect');
      // socket?.off('disconnect');
      // socket?.off('serverMessage');
      // socket?.off('connect_error');
      // Setting socket to null here can be problematic if other components share the instance
      // and expect it to persist across navigations (if not unmounting fully).
      // For a page like this, disconnecting is usually sufficient.
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  // Placeholder data - replace with actual data fetching later
  const placeholderStats = {
    totalReviews: "1,234",
    averageRating: "8.5 / 10",
  };

  const recentActivities = [
    { id: 1, text: t('newReviewNotification', { roomNumber: '101' }) },
    { id: 2, text: t('userRegisteredNotification', { username: 'Jane Doe' }) },
    { id: 3, text: "Voting session 'Poolside Bar Options' created." }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('adminDashboard')}</h1>
      <p className="text-gray-600 mb-8">
        Welcome to your central hub for managing hotel operations and guest feedback.
        Socket.IO Status: <span className={isConnected ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </p>

      {/* Socket.IO Messages Display */}
      <Card title="Socket.IO Log" className="mb-8 col-span-1 md:col-span-2 lg:col-span-3">
        <div className="max-h-40 overflow-y-auto text-sm">
          {serverMessages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
          {serverMessages.map((msg, index) => (
            <p key={index} className="mb-1 p-1 bg-gray-100 rounded">{msg}</p>
          ))}
        </div>
      </Card>

      {/* Reporting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card title={t('totalReviews')}>
          <p className="text-3xl font-bold text-indigo-600">{placeholderStats.totalReviews}</p>
        </Card>
        <Card title={t('averageRating')}>
          <p className="text-3xl font-bold text-purple-600">{placeholderStats.averageRating}</p>
        </Card>
        <Card title="Active Voting Sessions">
            <p className="text-3xl font-bold text-teal-600">3</p>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card title={t('recentActivity')} className="col-span-1 md:col-span-2 lg:col-span-3">
        {recentActivities.length > 0 ? (
          <ul className="space-y-3">
            {recentActivities.map(activity => (
              <li key={activity.id} className="text-gray-600 border-b border-gray-200 pb-2 last:border-b-0">
                {activity.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t('noRecentActivity')}</p>
        )}
      </Card>
    </div>
  );
}
