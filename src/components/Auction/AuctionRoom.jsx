import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BidForm from './BidForm';
import Timer from '../Common/Timer';
import { formatCurrency, formatDate } from '../../utils/formatter';
import { api } from '../../utils/api';
import './styles/AuctionRoom.css'; 

const AuctionRoom = ({ auction: initialAuction, socket }) => {
  const { user } = useAuth();
  const [auction, setAuction] = useState(initialAuction);
  const [bids, setBids] = useState(initialAuction.bids || []);
  const [showSellerDecision, setShowSellerDecision] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('newBid', (data) => {
        if (data.auctionId === auction.id) {
          setAuction(prev => ({
            ...prev,
            currentBid: data.currentBid
          }));
          setBids(prev => [data.bid, ...prev]);
        }
      });

      socket.on('sellerDecision', (data) => {
        if (data.auctionId === auction.id) {
          setAuction(prev => ({
            ...prev,
            sellerDecision: data.decision,
            status: data.decision === 'accepted' ? 'completed' : prev.status
          }));
          setShowSellerDecision(false);
        }
      });

      return () => {
        socket.off('newBid');
        socket.off('sellerDecision');
      };
    }
  }, [socket, auction.id]);

  const now = new Date();
  const startTime = new Date(auction.startTime);
  const endTime = new Date(auction.endTime);

  const isActive = () => {
    return now >= startTime && now <= endTime;
  };

  const hasStarted = () => {
    return now >= startTime;
  };

  const hasEnded = () => {
    return now > endTime;
  };

  const isOwner = () => {
    return user && auction.sellerId === user.id;
  };

  const handleAuctionEnd = () => {
    if (isOwner() && !auction.sellerDecision) {
      setShowSellerDecision(true);
    }
  };

  const handleSellerDecision = async (decision) => {
    try {
      await api.post(`/auctions/${auction.id}/decision`, { decision });
    } catch (error) {
      console.error('Failed to make decision:', error);
    }
  };

  const getHighestBid = () => {
    return bids.length > 0 ? bids[0] : null;
  };

  const getAuctionStatus = () => {
    if (auction.status === 'completed') {
      return { message: '🎉 Auction completed!', class: 'auction-completed' };
    }
    if (auction.status === 'rejected') {
      return { message: '❌ Auction rejected', class: 'auction-rejected' };
    }
    if (hasEnded()) {
      return { message: 'Auction has ended', class: 'auction-ended' };
    }
    if (!hasStarted()) {
      return { message: 'Auction has not started yet', class: 'auction-not-started' };
    }
    return null;
  };

  const statusInfo = getAuctionStatus();

  return (
    <div className="auction-room">
      <div className="auction-card">
        <div className="auction-header">
          <div>
            <h1 className="auction-title">{auction.title}</h1>
            <p className="auction-seller">by {auction.seller?.username}</p>
          </div>
          <div className="auction-bid-summary">
            <div className="auction-current-bid">{formatCurrency(auction.currentBid)}</div>
            <div className="auction-current-bid-label">Current Bid</div>
          </div>
        </div>

        <p className="auction-description">{auction.description}</p>

        <div className="auction-stats">
          <div>
            <div className="auction-stat-label">Starting Price</div>
            <div className="auction-stat-value">{formatCurrency(auction.startingPrice)}</div>
          </div>
          <div>
            <div className="auction-stat-label">Bid Increment</div>
            <div className="auction-stat-value">{formatCurrency(auction.bidIncrement)}</div>
          </div>
          <div>
            <div className="auction-stat-label">Total Bids</div>
            <div className="auction-stat-value">{bids.length}</div>
          </div>
        </div>

        {isActive() && (
          <div className="auction-timer">
            <span>Ends in: </span>
            <Timer endTime={auction.endTime} onEnd={handleAuctionEnd} />
          </div>
        )}

        {!hasStarted() && (
          <div className="auction-countdown">
            <span>Starts in: </span>
            <Timer endTime={auction.startTime} />
          </div>
        )}

        {statusInfo && (
          <div className={statusInfo.class}>
            {statusInfo.message}
            {auction.status === 'completed' && getHighestBid() && (
              <span> Winner: {getHighestBid()?.bidder?.username}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="auction-content">
        <div className="auction-bidding">
          {isActive() && user && !isOwner() && (
            <BidForm auction={auction} />
          )}

          {!user && isActive() && (
            <div className="auction-warning">Please log in to place a bid.</div>
          )}

          {isOwner() && isActive() && (
            <div className="auction-info">This is your auction. You cannot bid on your own items.</div>
          )}

          {!hasStarted() && (
            <div className="auction-info">
              Auction starts at {formatDate(auction.startTime)}
            </div>
          )}

          {showSellerDecision && isOwner() && (
            <div className="seller-decision-panel">
              <h3 className="seller-decision-title">Make Your Decision</h3>
              <p className="seller-decision-subtitle">
                Highest bid: {formatCurrency(auction.currentBid)} by {getHighestBid()?.bidder?.username}
              </p>
              <div className="seller-decision-actions">
                <button onClick={() => handleSellerDecision('accepted')} className="btn-accept">Accept</button>
                <button onClick={() => handleSellerDecision('rejected')} className="btn-reject">Reject</button>
                <button onClick={() => handleSellerDecision('counter_offer')} className="btn-counter">Counter Offer</button>
              </div>
            </div>
          )}
        </div>
      </div>

       <div className="auction-history">
          <div className="auction-card">
            <h3 className="auction-history-title">Bid History</h3>
            <div className="auction-history-list">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <div key={bid.id} className="bid-item">
                    <div>
                      <div className="bid-amount">{formatCurrency(bid.amount)}</div>
                      <div className="bidder-name">{bid.bidder?.username}</div>
                    </div>
                    <div className="bid-time">{formatDate(bid.createdAt)}</div>
                  </div>
                ))
              ) : (
                <div className="no-bids">No bids yet</div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default AuctionRoom;