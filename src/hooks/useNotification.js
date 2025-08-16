import { useState, useEffect } from 'react';

const useNotifications = (socket) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on('newBid', (data) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'bid',
          message: `New bid of ${data.currentBid} placed on auction`,
          timestamp: new Date()
        }]);
      });

      socket.on('sellerDecision', (data) => {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'decision',
          message: `Seller has ${data.decision} the highest bid`,
          timestamp: new Date()
        }]);
      });

      return () => {
        socket.off('newBid');
        socket.off('sellerDecision');
      };
    }
  }, [socket]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return {
    notifications,
    removeNotification
  };
};

export default useNotifications;