import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatter';
import './styles/BidForm.css';

const BidForm = ({ auction, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiFetch } = useAuth();

  const minBid = parseFloat(auction.currentBid) + parseFloat(auction.bidIncrement);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/bids', {
        method: 'POST',
        body: JSON.stringify({
          auctionId: auction.id,
          amount: parseFloat(bidAmount)
        })
      });

      setBidAmount('');
      if (onBidPlaced) {
        onBidPlaced(data);
      }
    } catch (error) {
      setError(error.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bid-form-container">
      <h3 className="bid-form-title">Place a Bid</h3>
      
      <div className="bid-info">
        <p className="bid-text">
          Current Bid: <span className="bid-value">{formatCurrency(auction.currentBid)}</span>
        </p>
        <p className="bid-text">
          Minimum Bid: <span className="bid-value">{formatCurrency(minBid)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bid-form">
        <div>
          <label className="bid-label">
            Your Bid ($)
          </label>
          <input
            type="number"
            step="0.01"
            min={minBid}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="bid-input"
            placeholder={`Enter at least ${formatCurrency(minBid)}`}
            required
          />
        </div>

        {error && (
          <div className="bid-error">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !bidAmount || parseFloat(bidAmount) < minBid}
          className="bid-button"
        >
          {loading ? 'Placing Bid...' : 'Place Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;
