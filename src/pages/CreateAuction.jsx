import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuctionForm from '../components/Auction/AuctionForm';

const CreateAuction = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AuctionForm />
    </div>
  );
};

export default CreateAuction;