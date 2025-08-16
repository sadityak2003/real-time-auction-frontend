import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        setConnected(true);
        console.log('Connected to server');
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  const joinAuction = (auctionId) => {
    if (socket) {
      socket.emit('joinAuction', auctionId);
    }
  };

  const leaveAuction = (auctionId) => {
    if (socket) {
      socket.emit('leaveAuction', auctionId);
    }
  };

  return {
    socket,
    connected,
    joinAuction,
    leaveAuction
  };
};

export default useSocket;