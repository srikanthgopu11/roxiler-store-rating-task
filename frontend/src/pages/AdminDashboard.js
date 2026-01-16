import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });

    useEffect(() => {
        const loadData = () => {
            API.get('/admin/dashboard').then(res => setStats(res.data));
            API.get('/admin/users').then(res => setUsers(res.data));
        };
        loadData();
    }, []);

    const addStore = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/stores', newStore);
            alert("Store Added!");
            API.get('/admin/dashboard').then(res => setStats(res.data));
            API.get('/admin/users').then(res => setUsers(res.data));
        } catch (err) { alert("Error adding store"); }
    };

    return (
        <div className="container">
            <button className="logout-btn" onClick={() => {localStorage.clear(); window.location.href='/login'}}>Logout</button>
            <h1>Admin Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stat-card"><h3>{stats.users}</h3><p>Users</p></div>
                <div className="stat-card"><h3>{stats.stores}</h3><p>Stores</p></div>
                <div className="stat-card"><h3>{stats.ratings}</h3><p>Ratings</p></div>
            </div>

            <div className="auth-card" style={{maxWidth: '100%', textAlign:'left'}}>
                <h3>Add New Store</h3>
                <form onSubmit={addStore} style={{display:'flex', gap:'10px'}}>
                    <input placeholder="Store Name" onChange={e=>setNewStore({...newStore, name: e.target.value})} required />
                    <input placeholder="Email" onChange={e=>setNewStore({...newStore, email: e.target.value})} required />
                    <select onChange={e=>setNewStore({...newStore, owner_id: e.target.value})} required>
                        <option value="">Select Owner</option>
                        {users.filter(u => u.role === 'owner').map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    <button type="submit" style={{width:'200px'}}>Add Store</button>
                </form>
            </div>

            <h3>System Users</h3>
            <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}