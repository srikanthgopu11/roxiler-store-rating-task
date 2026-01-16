import React, { useState } from 'react';
import API from '../api';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); 
        try {
            const { data } = await API.post('/auth/login', form);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userName', data.name);

            window.location.href = `/${data.role}`;
            
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Email or Password");
        }
    };

    return (
        <div className="auth-card">
            <h2>Welcome Back</h2>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={e => setForm({...form, password: e.target.value})} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            <p style={{ marginTop: '15px' }}>
                New here? <a href="/signup">Create an account</a>
            </p>
        </div>
    );
}