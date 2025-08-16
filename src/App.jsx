import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateAuction from './pages/CreateAuction';
import AuctionDetail from './pages/AuctionDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;