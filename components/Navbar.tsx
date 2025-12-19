import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
            Auraweb <span className="text-blue-600">Solution</span>
          </h1>
        </Link>

        <div className="flex gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('admin_token');
              window.location.reload();
            }}
            className="px-5 py-2 text-xs font-bold rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
