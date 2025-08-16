import React from 'react';
import Header from './Common/Header';
import NotificationPanel from './Common/NotificationPanel';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <NotificationPanel />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
