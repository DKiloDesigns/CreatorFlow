/**
 * WebSocket API Route
 * Handles Socket.IO connections for real-time notifications
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { notificationWebSocket } from '@/lib/websocket/notification-server';

let io: SocketIOServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log('Socket.IO already running');
    res.end();
    return;
  }

  console.log('Socket.IO is initializing...');
  
  const httpServer: HTTPServer = res.socket.server as any;
  
  // Initialize WebSocket server
  notificationWebSocket.initialize(httpServer);
  
  res.socket.server.io = notificationWebSocket;
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
