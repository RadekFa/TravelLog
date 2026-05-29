import React from 'react';
import '../styles/componentsStyles/AdminStats.scss';

interface AdminStatsProps {
  stats: { totalUsers: number, totalVisits: number };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const avgCountries = stats.totalUsers > 0 ? Math.round(stats.totalVisits / stats.totalUsers) : 0;

  return (
    <div className="admin-stats-row">
      {/* Total Users Card */}
      <div className="stat-card">
        <div className="stat-info">
          <p className="stat-label">Total users</p>
          <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
          <p className="stat-subtext">Registered on the platform</p>
        </div>
        <div className="stat-icon-wrapper">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2bc3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>

      {/* Total Countries Visited */}
      <div className="stat-card">
        <div className="stat-info">
          <p className="stat-label">Total countries visited</p>
          <p className="stat-value">{stats.totalVisits.toLocaleString()}</p>
          <p className="stat-subtext">Across all users</p>
        </div>
        <div className="stat-icon-wrapper">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2bc3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
      </div>

      {/* Avg Countries / User */}
      <div className="stat-card">
        <div className="stat-info">
          <p className="stat-label">Avg. countries/user</p>
          <p className="stat-value">{avgCountries}</p>
          <p className="stat-subtext">Across all users</p>
          
        </div>
        <div className="stat-icon-wrapper">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2bc3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;