import { Server as NetServer, Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

// Define a type for the response that includes our custom io property
// Also, make sure the socket property on res itself is correctly typed.
type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & { // Use net.Socket here
    server: NetServer & { // net.Server
      io?: SocketIOServer;
    };
  };
};

// Disable default body parsing, as we're dealing with a WebSocket upgrade, not typical HTTP body.
export const config = {
  api: {
    bodyParser: false,
  },
};

let ioInstance: SocketIOServer | null = null;

export default async function socketIOHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  // It's important to check if the server is already initialized.
  // The res.socket.server.io pattern is common, but here we use a module-level instance
  // to avoid potential issues if the res object changes or for clearer separation.
  // However, for Next.js, attaching to res.socket.server is the standard way for Pages API routes.
  // Let's stick to the more standard pattern shown in the prompt.

  if (!res.socket.server.io) {
    console.log('* First use, starting Socket.IO server...');

    const httpServer: NetServer = res.socket.server as any; // Cast to any if type conflicts are complex
    const io = new SocketIOServer(httpServer, {
      path: '/api/socketio_endpoint', // Custom path for Socket.IO connections
      addTrailingSlash: false, // Important for path matching
      cors: { // Optional: Configure CORS if your client is on a different domain/port
        origin: "*", // Adjust for production
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Socket.IO: Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Socket.IO: Client disconnected:', socket.id);
      });

      // Example: send a message to the client after connection
      socket.emit('serverMessage', { message: `Welcome, client ${socket.id}! You are connected.` });

      // Example: listen for a message from the client
      socket.on('clientMessage', (data) => {
        console.log(`Socket.IO: Message from client ${socket.id}:`, data);
        // Broadcast to all clients except sender, or emit back, etc.
        socket.emit('serverMessage', { message: `Server received your message: "${data.message}"` });
      });
    });

    // Store the io instance on the server object from the response.
    res.socket.server.io = io;
    console.log('Socket.IO server started and attached to HTTP server.');
  } else {
    console.log('Socket.IO server already running.');
  }

  // End the HTTP request. The WebSocket connection will persist.
  res.end();
}
