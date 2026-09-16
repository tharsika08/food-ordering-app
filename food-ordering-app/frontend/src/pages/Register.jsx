import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(245,200,66,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .auth-input::placeholder { color: #6A6058; }
        .auth-link:hover { color: #FFD86B !important; }
      `}</style>

      <div style={{ maxWidth: '440px', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(245,200,66,0.04)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🍽</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.4rem', letterSpacing: '-0.5px' }}>
            Food<span style={{ color: '#F5C842', fontStyle: 'italic' }}>App</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#C8BEB4' }}>Join us and start ordering!</p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div style={{ background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF8B55', padding: '0.9rem 1.1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#C8BEB4', fontSize: '0.78rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required
                className="auth-input"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '0.9rem', color: '#FFFFFF', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#F5C842'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#C8BEB4', fontSize: '0.78rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                className="auth-input"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '0.9rem', color: '#FFFFFF', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#F5C842'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#C8BEB4', fontSize: '0.78rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required
                className="auth-input"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '0.9rem', color: '#FFFFFF', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#F5C842'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
            </div>

            {/* Role */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#C8BEB4', fontSize: '0.78rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Account Type</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ width: '100%', padding: '0.8rem 1rem', background: '#181410', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', fontSize: '0.9rem', color: '#FFFFFF', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#F5C842'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}>
                <option value="customer">👤 Customer</option>
                <option value="admin">👨‍💼 Restaurant Admin</option>
              </select>
            </div>

            {/* Register Button */}
            <button type="submit" style={{ padding: '0.9rem', background: '#F5C842', color: '#0D0D0D', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.4rem' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFD86B'}
              onMouseLeave={e => e.currentTarget.style.background = '#F5C842'}>
              ✨ Create Account
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#A09080', fontSize: '0.85rem' }}>
            Already have an account?{' '}
            <a href="/login" className="auth-link" style={{ color: '#F5C842', fontWeight: 700, textDecoration: 'none' }}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}