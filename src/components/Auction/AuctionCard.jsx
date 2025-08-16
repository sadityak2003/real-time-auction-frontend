import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatter';
import Timer from '../Common/Timer';
import './styles/AuctionCard.css'; 

const AuctionCard = ({ auction }) => {
  const isActive = () => {
    const now = new Date();
    return now >= new Date(auction.startTime) && now <= new Date(auction.endTime);
  };

  const getStatusBadge = () => {
    if (auction.status === 'completed') {
      return <span className="badge badge-completed">Completed</span>;
    }
    if (auction.status === 'ended') {
      return <span className="badge badge-ended">Ended</span>;
    }
    if (isActive()) {
      return <span className="badge badge-live">Live</span>;
    }
    return <span className="badge badge-upcoming">Ended</span>;
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

        <div className="auction-card-footer">
          <span className="auction-card-date">
            {isActive() ? 'Ends: ' : 'Starts: '}
            {formatDate(isActive() ? auction.endTime : auction.startTime)}
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
