#!/usr/bin/env node

import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { 
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST"]
  },
  path: '/api/socketio',
});

console.log('📢 Announcement Socket.IO server starting on port 4001');

// Broadcast announcement to all clients
function broadcastAnnouncement(announcement) {
  io.emit('announcement', announcement);
  console.log('📢 Broadcasted announcement:', announcement.title);
}

// Listen for messages from parent process (API)
process.on('message', (msg) => {
  if (msg && msg.type === 'broadcastAnnouncement') {
    broadcastAnnouncement(msg.announcement);
  }
});

io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
  
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

httpServer.listen(4001, () => {
  console.log('✅ WebSocket server running on port 4001');
});

// Handle server errors
httpServer.on('error', (error) => {
  console.error('❌ WebSocket server error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down WebSocket server...');
  httpServer.close(() => {
    console.log('✅ WebSocket server stopped');
    process.exit(0);
  });
}); 