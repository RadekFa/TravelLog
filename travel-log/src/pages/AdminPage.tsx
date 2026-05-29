import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AdminUserManagement from '../components/AdminUserManagement';
import AdminStats from '../components/AdminStats';
import AdminChart from '../components/AdminChart';

import '../styles/pagesStyles/AdminPage.scss';

const AdminPage = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalVisits: 0 });
    const [chartData, setChartData] = useState([]);
    const { token, logout, user: currentUser } = useAuth();
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            const statsRes = await fetch('http://localhost:8080/api/users/stats/summary', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsRes.ok) {
                const resData = await statsRes.json();
                setStats({ totalUsers: resData.totalUsers, totalVisits: resData.totalVisits });
                setChartData(resData.history);
            }
        } catch (error) {
            console.error("Error fetching admin stats:", error);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
    }, [token]);

    const handleSignOut = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div className="header-left">
                    <h1>Administration</h1>
                    <p>System management and user overview</p>
                </div>
                <div className="header-right">
                    <button className="admin-logout-btn" onClick={handleSignOut}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="admin-main-content">
                <div className="admin-container-stack">
                    {/* Horní sekce: Statistiky (3 karty vedle sebe) */}
                    <section className="stats-section">
                        <AdminStats stats={stats} />
                    </section>

                    {/* Střední sekce: Grafy (2 grafy vedle sebe) */}
                    <section className="charts-section">
                        <AdminChart data={chartData} />
                    </section>

                    {/* Dolní sekce: Správa uživatelů (Full width) */}
                    <section className="management-section">
                        <AdminUserManagement 
                            token={token} 
                            currentUser={currentUser} 
                        />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;