import React, { useEffect, useState } from 'react';
import API from '../api';

export default function OwnerDashboard() {
    const [data, setData] = useState(null);
    useEffect(() => { API.get('/owner/dashboard').then(res => setData(res.data)); }, []);
    if (!data) return <div className="container">Loading... (Admin must assign a store to you)</div>;

    return (
        <div className="container">
            <h1>My Store: {data.store.name}</h1>
            <button className="logout-btn" onClick={()=> {localStorage.clear(); window.location.href='/login'}}>Logout</button>
            <div className="store-card" style={{marginTop:'20px'}}>
                <h3>Recent Ratings</h3>
                {data.ratings.map(r => (
                    <div key={r.id} style={{padding:'10px', borderBottom:'1px solid #eee'}}>
                        User: {r.User.name} | Rating: <b>{r.rating} / 5</b>
                    </div>
                ))}
            </div>
        </div>
    );
}