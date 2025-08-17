import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatter';
import Timer from '../Common/Timer';
import './styles/AuctionCard.css'; 

const AuctionCard = ({ auction }) => {
  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);

  const isActive = () => {
    return now >= startTime && now <= endTime;
  };

  const hasEnded = () => {
    return now > endTime;
  };

  const hasStarted = () => {
    return now >= startTime;
  };

  const getStatusBadge = () => {
    if (auction.status === 'completed') {
      return <span className="badge badge-completed">Completed</span>;
    }
    if (auction.status === 'rejected') {
      return <span className="badge badge-rejected">Rejected</span>;
    }
    if (auction.status === 'counter_offer') {
      return <span className="badge badge-counter_offer">Counter Offer</span>;
    }
    if (auction.status === 'cancelled') {
      return <span className="badge badge-cancelled">Cancelled</span>;
    }
    if (hasEnded() || auction.status === 'ended') {
      return <span className="badge badge-ended">Ended</span>;
    }
    if (isActive()) {
      return <span className="badge badge-live">Live</span>;
    }
    // If auction hasn't started yet
    return <span className="badge badge-upcoming">Upcoming</span>;
  };

  return (
    <div className="auction-card">
      <div className="auction-card-content">
        <div className="auction-card-header">
          <h3 className="auction-card-title">{auction.title}</h3>
          {getStatusBadge()}
        </div>

        <p className="auction-card-description">{auction.description}</p>

        <div className="auction-card-info">
          <div className="auction-card-row">
            <span className="auction-card-label">Current Bid:</span>
            <span className="auction-card-value">{formatCurrency(auction.currentBid)}</span>
          </div>
          <div className="auction-card-row">
            <span className="auction-card-label">Starting Price:</span>
            <span>{formatCurrency(auction.startingPrice)}</span>
          </div>
          <div className="auction-card-row">
            <span className="auction-card-label">Seller:</span>
            <span>{auction.seller?.username}</span>
          </div>
        </div>

        {isActive() && (
          <div className="auction-card-timer">
            <Timer endTime={auction.endTime} />
          </div>
        )}

        {!hasStarted() && (
          <div className="auction-card-countdown">
            <span>Starts in: </span>
            <Timer endTime={auction.startTime} />
          </div>
        )}

        <div className="auction-card-footer">
          <span className="auction-card-date">
            {isActive() ? 'Ends: ' : hasStarted() ? 'Ended: ' : 'Starts: '}
            {formatDate(isActive() ? auction.endTime : hasStarted() ? auction.endTime : auction.startTime)}
          </span>
          <Link
            to={`/auction/${auction.id}`}
            className="auction-card-btn"
          >
            {isActive() ? 'Bid Now' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;