import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/signup', form);
            alert("Signup successful! You can now login."); 
            navigate('/login');
        } catch (err) { 
            alert(err.response?.data?.message || "Signup failed. Check your inputs."); 
        }
    };

    return (
        <div className="auth-card">
            <h2>Create Account</h2>
            <form onSubmit={handleSignup}>
                <input 
                    placeholder="Full Name (5-60 chars)" 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password (8-16 chars, 1 Upper, 1 Special)" 
                    onChange={e => setForm({...form, password: e.target.value})} 
                    required 
                />
                <textarea 
                    placeholder="Address (Max 400 chars)" 
                    onChange={e => setForm({...form, address: e.target.value})} 
                />
                
                <label style={{display: 'block', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', marginTop: '10px'}}>
                    Select Your Role:
                </label>
                <select onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="user">Normal User (Rate Stores)</option>
                    <option value="owner">Store Owner (Manage Store)</option>
                    <option value="admin">Administrator (System Manager)</option>
                </select>
                
                <button type="submit" style={{marginTop: '20px'}}>Register</button>
            </form>
            <p style={{marginTop:'15px'}}>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}