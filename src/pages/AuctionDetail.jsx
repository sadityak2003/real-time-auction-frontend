import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';
import AuctionRoom from '../components/Auction/AuctionRoom';
import './styles/AuctionDetail.css'; // import css

const AuctionDetail = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { apiFetch } = useAuth();
  const { socket, joinAuction, leaveAuction } = useSocket();

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const data = await apiFetch(`/auctions/${id}`);
        setAuction(data);
      } catch (error) {
        setError(error.message || 'Auction not found');
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, apiFetch]);

  useEffect(() => {
    if (auction && socket) {
      joinAuction(auction.id);
      return () => leaveAuction(auction.id);
    }
  }, [auction, socket, joinAuction, leaveAuction]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <AuctionRoom auction={auction} socket={socket} />
    </div>
  );
};

export default AuctionDetail;
