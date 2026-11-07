import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

function AdminLayout() {
  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <main className="admin-content d-flex flex-column justify-content-between">
        <div>
          <AdminTopbar />
          <div className="container-fluid p-4">
            <Outlet />
          </div>
        </div>
        <footer className="py-3 px-4 text-center text-muted border-top bg-white small">
          LogisTrack &copy; {new Date().getFullYear()} — Panel Administrativo Duoc UC
        </footer>
      </main>
    </div>
  );
}

export default AdminLayout;
