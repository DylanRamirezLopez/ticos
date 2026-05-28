import React, { useState, useEffect } from 'react';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setAdmin({ _id: payload.id });
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch {
        localStorage.removeItem('admin_token');
      }
    }
  }, []);

  if (admin) {
    return <AdminDashboard admin={admin} onLogout={() => setAdmin(null)} />;
  }

  return <AdminLoginPage onLogin={(a) => setAdmin(a)} />;
};

export default AdminPage;
