import { Server } from 'socket.io';

const io = new Server(4001, {
  cors: { origin: '*' },
});

console.log('📢 Announcement Socket.IO server running on port 4001');

// Broadcast announcement to all clients
function broadcastAnnouncement(announcement) {
  io.emit('announcement', announcement);
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
}); 