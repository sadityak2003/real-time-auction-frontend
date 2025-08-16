import { Link } from 'react-router-dom';
import useSocket from '../../hooks/useSocket';
import useNotifications from '../../hooks/useNotification';
import { formatDate } from '../../utils/formatter';
import './styles/NotificationPanel.css';

const NotificationPanel = () => {
  const { socket } = useSocket();
  const { notifications, removeNotification } = useNotifications(socket);

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-card">
          <div className="notification-content">
            <div className="notification-text">
              <p className="notification-message">{notification.message}</p>
              <p className="notification-time">
                {formatDate(notification.timestamp)}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="notification-close"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
