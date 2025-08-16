import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuctionCard from '../components/Auction/AuctionCard';
import './styles/Home.css'; // Assuming you have a CSS file for styles

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { apiFetch } = useAuth();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await apiFetch('/auctions');
        setAuctions(data);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [apiFetch]);

  const filteredAuctions = auctions.filter(auction => {
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);

    switch (filter) {
      case 'active':
        return now >= startTime && now <= endTime;
      case 'upcoming':
        return now < startTime;
      case 'ended':
        return now > endTime;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="home-container">
        <h1 className="home-title">Welcome to StarPawns</h1>
        <p className="home-subtitle">Discover amazing deals and unique items</p>
      </div>

      <div className="filter-tabs">
        <div className="filter-group">
          {[
            { key: 'all', label: 'All Auctions' },
            { key: 'active', label: 'Live Now' },
            { key: 'upcoming', label: 'Coming Soon' },
            { key: 'ended', label: 'Ended' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`filter-button ${filter === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredAuctions.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredAuctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="no-auctions">No auctions found for this filter</div>
      )}
    </div>
  );
};

export default Home;
