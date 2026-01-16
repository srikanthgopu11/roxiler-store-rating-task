import React, { useEffect, useState } from 'react';
import API from '../api';

export default function OwnerDashboard() {
    const [data, setData] = useState(null);
    const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwnerData = () => {
            API.get('/owner/dashboard')
                .then(res => {
                    setData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log("No store assigned yet");
                    setLoading(false);
                });
        };
        fetchOwnerData();
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.patch('/api/auth/update-password', passwords);
            alert("Password updated successfully!");
            setPasswords({ oldPassword: '', newPassword: '' });
        } catch (err) {
            alert(err.response?.data?.message || "Error updating password");
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) return <div className="container">Loading Dashboard...</div>;

    return (
        <div className="container">
            <button className="logout-btn" onClick={logout}>Logout</button>
            <h1>Store Owner Panel</h1>

            {data ? (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>{data.store.name}</h3>
                            <p>Store Name</p>
                        </div>
                        <div className="stat-card">
                            <h3>{data.ratings.length}</h3>
                            <p>Total Reviews</p>
                        </div>
                    </div>

                    <div className="auth-card" style={{ maxWidth: '100%', textAlign: 'left', margin: '20px 0' }}>
                        <h3>Customer Ratings</h3>
                        {data.ratings.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Customer Name</th>
                                        <th>Email</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.ratings.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.User.name}</td>
                                            <td>{r.User.email}</td>
                                            <td><span className="badge">★ {r.rating}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ padding: '20px' }}>No ratings received yet.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="auth-card" style={{ maxWidth: '600px', backgroundColor: '#fff3cd', color: '#856404' }}>
                    <h3>No Store Assigned</h3>
                    <p>An Admin has not assigned a store to you yet.</p>
                </div>
            )}

            <div className="auth-card" style={{ maxWidth: '400px', margin: '20px 0', textAlign: 'left' }}>
                <h3>Update Password</h3>
                <form onSubmit={handlePasswordUpdate}>
                    <input 
                        type="password" 
                        placeholder="Old Password" 
                        value={passwords.oldPassword}
                        onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={passwords.newPassword}
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} 
                        required 
                    />
                    <button type="submit">Update Password</button>
                </form>
            </div>
        </div>
    );
}