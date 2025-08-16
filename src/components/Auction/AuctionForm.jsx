import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './styles/AuctionForm.css'; 

const AuctionForm = () => {
  const navigate = useNavigate();
  const { apiFetch, user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    bidIncrement: '1.00',
    startTime: '',
    duration: '1440' // Default to 24 hours (in minutes)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const localDate = new Date(formData.startTime);
      
      console.log('Local time selected:', formData.startTime);
      console.log('Local Date object:', localDate.toString());
      console.log('UTC ISO string:', localDate.toISOString());

      const data = await apiFetch('/auctions', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          startingPrice: parseFloat(formData.startingPrice),
          bidIncrement: parseFloat(formData.bidIncrement),
          duration: parseInt(formData.duration),
          startTime: localDate.toISOString() 
        })
      });

      navigate(`/auction/${data.id}`);
    } catch (error) {
      setError(error.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocalDateTime = () => {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localTime.toISOString().slice(0, 16);
  };

  return (
    <div className="auction-form-container">
      <h2 className="auction-form-title">Create New Auction</h2>

      <form onSubmit={handleSubmit} className="auction-form">
        <div>
          <label className="auction-form-label">Item Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="auction-form-input"
            required
          />
        </div>

        <div>
          <label className="auction-form-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            className="auction-form-textarea"
            required
          />
        </div>

        <div className="auction-form-grid">
          <div>
            <label className="auction-form-label">Starting Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.startingPrice}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
              className="auction-form-input"
              required
            />
          </div>

          <div>
            <label className="auction-form-label">Bid Increment ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.bidIncrement}
              onChange={(e) => setFormData({ ...formData, bidIncrement: e.target.value })}
              className="auction-form-input"
              required
            />
          </div>
        </div>

        <div className="auction-form-grid">
          <div>
            <label className="auction-form-label">Start Time (Local)</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              min={getCurrentLocalDateTime()}
              className="auction-form-input"
              required
            />
          </div>

          <div>
            <label className="auction-form-label">Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="auction-form-select"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
              <option value="240">4 hours</option>
              <option value="720">12 hours</option>
              <option value="1440">24 hours</option>
              <option value="2880">48 hours</option>
              <option value="4320">72 hours</option>
            </select>
          </div>
        </div>

        {error && <div className="auction-form-error">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="auction-form-btn"
        >
          {loading ? 'Creating Auction...' : 'Create Auction'}
        </button>
      </form>
    </div>
  );
};

export default AuctionForm;