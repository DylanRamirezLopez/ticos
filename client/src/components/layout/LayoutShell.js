import React from 'react';
import { useAuth } from '../../context/AuthContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';

const LayoutShell = ({ children }) => {
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (!user) return children;

  return (
    <div className="min-h-screen bg-ticos-bg dark:bg-ticos-dark-bg">
      <Navbar />
      <main className={`${isMobile ? 'pb-20' : 'pb-8'}`}>
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default LayoutShell;
