import React, { useEffect, useState } from 'react';
import API from '../api';

export default function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");

    useEffect(() => {
        const fetchStores = () => {
            API.get(`/user/stores?search=${search}&sort=${sort}`).then(res => setStores(res.data));
        };
        fetchStores();
    }, [search, sort]);

    const rate = (id, val) => {
        API.post('/user/ratings', { store_id: id, rating: val }).then(() => {
            alert("Rating Submitted!");
            API.get(`/user/stores?search=${search}&sort=${sort}`).then(res => setStores(res.data));
        });
    };

    return (
        <div className="container">
            <button className="logout-btn" onClick={() => {localStorage.clear(); window.location.href='/login'}}>Logout</button>
            <h1>All Stores</h1>

            <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                <input placeholder="Search by name or address..." onChange={e => setSearch(e.target.value)} />
                <select style={{width:'200px'}} onChange={e => setSort(e.target.value)}>
                    <option value="name">Sort by Name</option>
                    <option value="rating">Sort by Rating</option>
                </select>
            </div>

            <div className="store-grid">
                {stores.map(s => (
                    <div key={s.id} className="store-card">
                        <h3>{s.name}</h3>
                        <p>{s.address}</p>
                        <div className="badge">★ {s.avgRating ? parseFloat(s.avgRating).toFixed(1) : '0.0'}</div>
                        <div style={{marginTop:'15px'}}>
                            <select onChange={e => rate(s.id, e.target.value)}>
                                <option>Rate this...</option>
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}