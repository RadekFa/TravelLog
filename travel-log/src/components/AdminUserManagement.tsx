import React, { useEffect, useState } from 'react';
import { Mail, Calendar, Globe, Trash2, Search, UserMinus, UserPlus } from 'lucide-react';
// 1. IMPORT NOVÉHO KONTEXTU
import { useAlertToast } from '../context/AlertToastContext'; 
import '../styles/componentsStyles/AdminUserManagement.scss';

interface AdminUserManagementProps {
    token: string | null;
    currentUser: any;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ token, currentUser }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    
    // 2. VYTÁHNUTÍ FUNKCE PRO ZOBRAZENÍ ALERTU
    const { showAlert } = useAlertToast();

    const fetchUsers = async () => {
        const url = `http://localhost:8080/api/users${searchQuery ? `?search=${searchQuery}` : ''}`;
        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, searchQuery, currentUser]);

    const getInitials = (name: string) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleDeleteConfirm = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setDeleteConfirmId(null);
                fetchUsers();
                // 3. ÚSPĚŠNÝ ALERT PO SMAZÁNÍ
                showAlert('User has been successfully deleted.', 'success');
            } else {
                showAlert('Failed to delete user.', 'error');
            }
        } catch (error) {
            showAlert('Could not connect to the server.', 'error');
        }
    };

    const toggleRole = async (id: number, currentRole: string) => {
        try {
            const newRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
            const response = await fetch(`http://localhost:8080/api/users/${id}/role`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });
            
            if (response.ok) {
                fetchUsers();
                // 4. ÚSPĚŠNÝ ALERT PO ZMĚNĚ ROLE
                showAlert(`User role has been updated to ${newRole === 'ROLE_ADMIN' ? 'Admin' : 'User'}.`, 'success');
            } else {
                showAlert('Failed to update user role.', 'error');
            }
        } catch (error) {
            showAlert('Could not connect to the server.', 'error');
        }
    };

    const renderCountriesCount = (u: any) => {
        const val = u.visitedCountriesCount ?? u.visitedCountries;
        if (Array.isArray(val)) return val.length;
        if (typeof val === 'number') return val;
        return 0;
    };

    const isCurrentUser = (userId: number) => {
        if (!currentUser) return false;
        const currentId = currentUser.id ?? currentUser.userId;
        return String(userId) === String(currentId);
    };

    if (!token || !currentUser) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading administration...</div>;
    }

    return (
        <div className="admin-user-management">
            <div className="management-card">
                <div className="card-header">
                    <div className="header-info">
                        <h2>All Users</h2>
                        <p>Showing {users.length} registered members</p>
                    </div>
                    <div className="search-box">
                        <Search className="search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th className="centerTh">Joined</th>
                                <th className="centerTh">Countries</th>
                                <th className="centerTh">Role</th>
                                <th className="centerTh">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(u => {
                                    const isMe = isCurrentUser(u.id);
                                    return (
                                        <tr key={u.id} className={isMe ? 'row-me' : ''}>
                                            <td>
                                                <div className="user-profile">
                                                    <div className="avatar">{getInitials(u.fullName)}</div>
                                                    <div className="details">
                                                        <span className="name">{u.fullName}</span>
                                                        <span className="email"><Mail size={12} /> {u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="centerTh">
                                                <div className="icon-text" style={{ justifyContent: 'center' }}>
                                                    <Calendar size={14} />
                                                    <span>{u.registrationYear || 2024}</span>
                                                </div>
                                            </td>
                                            <td className="centerTh">
                                                <div className="icon-text" style={{ justifyContent: 'center' }}>
                                                    <Globe size={14} className="icon-blue" />
                                                    <span className="count">{renderCountriesCount(u)}</span>
                                                </div>
                                            </td>
                                            <td className="centerTh">
                                                <span className={`role-badge ${u.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                                                    {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn-promote"
                                                        onClick={() => toggleRole(u.id, u.role)}
                                                        disabled={isMe}
                                                        title={isMe ? "You cannot change your own role" : ""}
                                                    >
                                                        {u.role === 'ROLE_ADMIN' ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                                        <span>{u.role === 'ROLE_ADMIN' ? 'Demote' : 'Promote'}</span>
                                                    </button>
                                                    
                                                    <div className="delete-popover-container">
                                                        <button 
                                                            className={`btn-delete ${deleteConfirmId === u.id ? "active" : ""}`}
                                                            onClick={() => setDeleteConfirmId(deleteConfirmId === u.id ? null : u.id)}
                                                            disabled={isMe}
                                                        >
                                                            <Trash2 size={16} />
                                                            <span>Delete</span>
                                                        </button>

                                                        {deleteConfirmId === u.id && (
                                                            <div className="inline-delete-popover">
                                                                <p>Delete user?</p>
                                                                <div className="popover-btns">
                                                                    <button className="btn-yes" onClick={() => handleDeleteConfirm(u.id)}>Yes</button>
                                                                    <button className="btn-no" onClick={() => setDeleteConfirmId(null)}>No</button>
                                                                </div>
                                                                <div className="popover-arrow"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                        No matching users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagement;