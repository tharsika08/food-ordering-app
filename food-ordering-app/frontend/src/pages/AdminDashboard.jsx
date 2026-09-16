import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
const STATUS_COLOR = {
  pending:   { color: '#F5C842', bg: 'rgba(245,200,66,0.12)'  },
  confirmed: { color: '#5B9BD5', bg: 'rgba(91,155,213,0.12)' },
  preparing: { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  ready:     { color: '#A78BFA', bg: 'rgba(167,139,250,0.12)'},
  delivered: { color: '#2ECC71', bg: 'rgba(46,204,113,0.12)' },
};
const DP_STATUS_COLOR = {
  available:   '#2ECC71',
  on_delivery: '#F5C842',
  resting:     '#5B9BD5',
  off_duty:    '#E8E0D5',
};

const S = {
  root: { minHeight: '100vh', background: '#0D0D0D', color: '#F5F0E8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", paddingBottom: '4rem' },
  header: { padding: '3rem 2rem 2rem', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' },
  tag: { display: 'inline-block', background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.4)', color: '#F5C842', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: '100px', marginBottom: '0.8rem' },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1, marginBottom: '0.3rem' },
  titleAccent: { color: '#F5C842', fontStyle: 'italic' },
  subtitle: { color: '#C8BEB4', fontSize: '0.9rem' },
  quickActions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto 2.5rem', padding: '0 2rem' },
  actionCard: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.4rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  actionIcon: { fontSize: '1.8rem' },
  actionLabel: { fontSize: '0.95rem', fontWeight: 700 },
  actionDesc: { fontSize: '0.78rem', color: '#C8BEB4' },
  section: { maxWidth: '1200px', margin: '0 auto 2.5rem', padding: '0 2rem' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' },
  addBox: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' },
  inputRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '1rem' },
  input: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.7rem 1rem', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  addBtn: { background: '#F5C842', color: '#0D0D0D', border: 'none', borderRadius: '10px', padding: '0.7rem 1.8rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' },
  successMsg: { color: '#2ECC71', fontSize: '0.85rem', marginTop: '0.5rem' },
  errorMsg: { color: '#FF6B35', fontSize: '0.85rem', marginTop: '0.5rem' },
  orderCard: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '1.2rem 1.4rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  orderUser: { fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' },
  orderEmail: { fontSize: '0.78rem', color: '#C8BEB4', marginTop: '2px' },
  orderMeta: { fontSize: '0.75rem', color: '#A09890', marginTop: '4px' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', marginTop: '6px' },
  select: { background: '#1A1410', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '0.5rem 0.9rem', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', outline: 'none', cursor: 'pointer' },
  empty: { color: '#C8BEB4', fontSize: '0.9rem', padding: '2rem 0' },
  ordersActionBar: { display: 'flex', gap: '0.7rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' },
  clearDeliveredBtn: { padding: '0.5rem 1.1rem', background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ECC71', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' },
  clearAllBtn: { padding: '0.5rem 1.1rem', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' },
  deleteBtn: { padding: '0.45rem 0.9rem', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF6B35', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'inherit' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  dialog: { background: '#1A1710', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', padding: '2rem', maxWidth: '380px', width: '100%', textAlign: 'center' },
  dialogIcon: { fontSize: '2.8rem', marginBottom: '0.8rem' },
  dialogTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' },
  dialogDesc: { color: '#C8BEB4', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 },
  dialogBtns: { display: 'flex', gap: '0.8rem', justifyContent: 'center' },
  dialogCancel: { padding: '0.6rem 1.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#C8BEB4', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' },
  dialogConfirm: { padding: '0.6rem 1.5rem', background: '#FF6B35', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem' },
  toast: { position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1A1710', border: '1px solid rgba(245,200,66,0.3)', color: '#F5C842', padding: '0.7rem 1.5rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
  dpSection: { maxWidth: '1200px', margin: '0 auto 2.5rem', padding: '0 2rem' },
  dpGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  dpCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.2rem' },
  dpTop: { display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' },
  dpAvatar: { width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(245,200,66,0.1)', border: '2px solid rgba(245,200,66,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#F5C842', fontSize: '1rem', flexShrink: 0 },
  dpName: { fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem' },
  dpMeta: { fontSize: '0.72rem', color: '#E8E0D5', marginTop: '2px' },
  dpStatusDot: { width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block', marginRight: '4px' },
  dpClockBtns: { display: 'flex', gap: '0.5rem' },
  clockInBtn: { flex: 1, padding: '0.5rem', background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ECC71', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700 },
  clockOutBtn: { flex: 1, padding: '0.5rem', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 700 },
  dpStats: { display: 'flex', gap: '1rem', marginBottom: '0.9rem', paddingBottom: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  dpStat: { display: 'flex', flexDirection: 'column', gap: '1px' },
  dpStatVal: { fontSize: '1rem', fontWeight: 700, color: '#F5F0E8' },
  dpStatLabel: { fontSize: '0.65rem', color: '#E8E0D5' },
  sessionsList: { marginBottom: '0.9rem' },
  sessionItem: { display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#B8B0A0' },
  sessionHours: { color: '#F5C842', fontWeight: 700 },

  // Flash sale styles
  flashActiveBox: { background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '14px', padding: '1.2rem 1.4rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  flashActiveName: { fontWeight: 700, color: '#FFFFFF', fontSize: '1rem', marginBottom: '4px' },
  flashActiveMeta: { fontSize: '0.78rem', color: '#A09880' },
  flashActiveExpiry: { fontSize: '0.72rem', color: '#5A5248', marginTop: '3px' },
  flashEndBtn: { padding: '0.5rem 1.2rem', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.82rem' },
  flashLaunchBtn: { background: '#D4AF37', color: '#0D0D0D', border: 'none', borderRadius: '10px', padding: '0.7rem 1.8rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' },
};

export default function AdminDashboard() {
  const [orders, setOrders]               = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [newItem, setNewItem]             = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [msg, setMsg]                     = useState('');
  const [confirm, setConfirm]             = useState(null);
  const [deleting, setDeleting]           = useState(false);
  const [toast, setToast]                 = useState('');
  const [clockLoading, setClockLoading]   = useState({});

  // Flash sale state
  const [flashSale, setFlashSale]         = useState(null);
  const [flashForm, setFlashForm]         = useState({ name: '', description: '', image: '', originalPrice: '', salePrice: '' });
  const [flashMsg, setFlashMsg]           = useState('');
  const [flashLoading, setFlashLoading]   = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    api.get('/orders').then(r => setOrders(r.data)).catch(console.error);
    api.get('/delivery').then(r => setDeliveryPersons(r.data)).catch(console.error);
    api.get('/flashsale/active').then(r => setFlashSale(r.data)).catch(console.error);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}`, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    if (status === 'delivered') {
      api.get('/delivery').then(r => setDeliveryPersons(r.data)).catch(console.error);
      showToast('✅ Order delivered! Delivery count updated.');
    }
  };

  const handleClockIn = async (personId) => {
    setClockLoading(prev => ({ ...prev, [personId]: true }));
    try {
      const res = await api.patch(`/delivery/${personId}/clockin`);
      setDeliveryPersons(prev => prev.map(p => p._id === personId ? res.data : p));
      showToast('✅ Clocked in successfully!');
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.error || 'Clock in failed'));
    } finally {
      setClockLoading(prev => ({ ...prev, [personId]: false }));
    }
  };

  const handleClockOut = async (personId) => {
    setClockLoading(prev => ({ ...prev, [personId]: true }));
    try {
      const res = await api.patch(`/delivery/${personId}/clockout`);
      setDeliveryPersons(prev => prev.map(p => p._id === personId ? res.data : p));
      showToast('✅ Clocked out successfully!');
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.error || 'Clock out failed'));
    } finally {
      setClockLoading(prev => ({ ...prev, [personId]: false }));
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.price) { setMsg('❌ Name and price are required'); return; }
    try {
      await api.post('/menu', { ...newItem, price: Number(newItem.price) });
      setMsg('✅ Item added successfully!');
      setNewItem({ name: '', description: '', price: '', category: '', image: '' });
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Failed to add item'); }
  };

  const handleConfirm = async () => {
    if (!confirm || deleting) return;
    setDeleting(true);
    try {
      if (confirm.type === 'single') {
        await api.delete(`/orders/admin/${confirm.orderId}`);
        setOrders(prev => prev.filter(o => o._id !== confirm.orderId));
        showToast('✓ Order removed');
      } else if (confirm.type === 'delivered') {
        await api.delete('/orders/admin/clear/delivered');
        setOrders(prev => prev.filter(o => o.status !== 'delivered'));
        showToast('✓ Delivered orders cleared');
      } else if (confirm.type === 'all') {
        await api.delete('/orders/admin/clear/all');
        setOrders([]);
        showToast('✓ All orders cleared');
      }
    } catch {
      showToast('❌ Failed to delete. Try again.');
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  // ── Flash Sale handlers ──────────────────────────────────
  const createFlashSale = async () => {
    if (!flashForm.name || !flashForm.originalPrice || !flashForm.salePrice) {
      setFlashMsg('❌ Name, original price and sale price are required');
      return;
    }
    if (Number(flashForm.salePrice) >= Number(flashForm.originalPrice)) {
      setFlashMsg('❌ Sale price must be less than original price');
      return;
    }
    setFlashLoading(true);
    try {
      const res = await api.post('/flashsale', {
        name:          flashForm.name,
        description:   flashForm.description,
        image:         flashForm.image,
        originalPrice: Number(flashForm.originalPrice),
        salePrice:     Number(flashForm.salePrice),
        menuItemId:    null,
      });
      setFlashSale(res.data);
      setFlashMsg('✅ Flash sale launched! Customers will see it on next visit.');
      setFlashForm({ name: '', description: '', image: '', originalPrice: '', salePrice: '' });
      setTimeout(() => setFlashMsg(''), 4000);
    } catch {
      setFlashMsg('❌ Failed to create flash sale');
    } finally {
      setFlashLoading(false);
    }
  };

  const endFlashSale = async () => {
    if (!flashSale) return;
    try {
      await api.delete(`/flashsale/${flashSale._id}`);
      setFlashSale(null);
      showToast('✅ Flash sale ended.');
    } catch {
      showToast('❌ Failed to end sale');
    }
  };

  const getInitials      = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getTodaySession  = (person) => {
    const today = new Date().toISOString().split('T')[0];
    return person.workSessions?.find(s => s.date === today);
  };
  const getRecentSessions = (sessions) =>
    [...(sessions || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  const pendingCount   = orders.filter(o => o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const CONFIRM_TEXT = {
    single:    { icon: '🗑️', title: 'Delete this order?',      desc: 'This order will be permanently deleted.' },
    delivered: { icon: '🧹', title: 'Clear delivered orders?', desc: `This will delete all ${deliveredCount} delivered order(s).` },
    all:       { icon: '⚠️', title: 'Clear ALL orders?',       desc: 'This deletes every order from every user. Cannot be undone.' },
  };

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.tag}>⚙️ Admin Panel</div>
        <h1 style={S.title}>Admin <span style={S.titleAccent}>Dashboard</span></h1>
        <p style={S.subtitle}>Manage orders, menu items, and delivery team</p>
      </div>

      {/* Quick Stats */}
      <div style={S.quickActions}>
        {[
          { icon: '🛵', label: 'Delivery Team',  desc: 'View & manage delivery staff',   color: '#F5C842', path: '/admin/delivery' },
          { icon: '📦', label: 'Total Orders',   desc: `${orders.length} orders placed`,  color: '#5B9BD5', path: null },
          { icon: '⏳', label: 'Pending Orders', desc: `${pendingCount} awaiting action`, color: '#FF6B35', path: null },
          { icon: '✅', label: 'Delivered',       desc: `${deliveredCount} completed`,    color: '#2ECC71', path: null },
        ].map(a => (
          <div key={a.label}
            style={{ ...S.actionCard, borderColor: a.path ? `${a.color}66` : 'rgba(255,255,255,0.12)' }}
            onClick={() => a.path && navigate(a.path)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}>
            <span style={S.actionIcon}>{a.icon}</span>
            <span style={{ ...S.actionLabel, color: a.color }}>{a.label}</span>
            <span style={S.actionDesc}>{a.desc}</span>
            {a.path && <span style={{ fontSize: '0.72rem', color: a.color, fontWeight: 600 }}>Click to open →</span>}
          </div>
        ))}
      </div>

      {/* ── Delivery Team Work Sessions ── */}
      <div style={S.dpSection}>
        <div style={S.sectionTitle}>
          <span>🛵</span> Delivery Team — Work Sessions
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#C8BEB4', fontWeight: 400, border: '1px solid rgba(255,255,255,0.12)', padding: '0.2rem 0.75rem', borderRadius: '100px' }}>
            {deliveryPersons.length} staff
          </span>
        </div>
        <div style={S.dpGrid}>
          {deliveryPersons.map(person => {
            const todaySession   = getTodaySession(person);
            const isClockedIn    = todaySession && !todaySession.clockOut;
            const isLoading      = clockLoading[person._id];
            const recentSessions = getRecentSessions(person.workSessions);
            const statusColor    = DP_STATUS_COLOR[person.status] || '#E8E0D5';
            return (
              <div key={person._id} style={S.dpCard}>
                <div style={S.dpTop}>
                  <div style={S.dpAvatar}>{getInitials(person.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={S.dpName}>{person.name}</div>
                    <div style={S.dpMeta}>
                      <span style={{ ...S.dpStatusDot, background: statusColor }} />
                      {person.status.replace('_', ' ')} · ⭐ {person.rating}
                    </div>
                  </div>
                </div>
                <div style={S.dpStats}>
                  <div style={S.dpStat}>
                    <span style={S.dpStatVal}>{person.totalDeliveries}</span>
                    <span style={S.dpStatLabel}>Deliveries</span>
                  </div>
                  <div style={S.dpStat}>
                    <span style={S.dpStatVal}>{person.totalHoursWorked}h</span>
                    <span style={S.dpStatLabel}>Total Hrs</span>
                  </div>
                  <div style={S.dpStat}>
                    <span style={{ ...S.dpStatVal, color: isClockedIn ? '#2ECC71' : '#A09080' }}>
                      {isClockedIn ? `🟢 ${todaySession.clockIn}` : 'Not in'}
                    </span>
                    <span style={S.dpStatLabel}>Today</span>
                  </div>
                </div>
                {recentSessions.length > 0 && (
                  <div style={S.sessionsList}>
                    {recentSessions.map((s, i) => (
                      <div key={i} style={S.sessionItem}>
                        <span>{s.date}</span>
                        <span>{s.clockIn}{s.clockOut ? ` → ${s.clockOut}` : ' → Active'}</span>
                        <span style={S.sessionHours}>{s.clockOut ? `${s.hoursWorked}h` : '🟢 Now'}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={S.dpClockBtns}>
                  <button
                    style={{ ...S.clockInBtn, opacity: isClockedIn || isLoading ? 0.45 : 1, cursor: isClockedIn ? 'not-allowed' : 'pointer' }}
                    onClick={() => !isClockedIn && !isLoading && handleClockIn(person._id)}
                    disabled={isClockedIn || isLoading}>
                    {isLoading ? '...' : '🟢 Clock In'}
                  </button>
                  <button
                    style={{ ...S.clockOutBtn, opacity: !isClockedIn || isLoading ? 0.45 : 1, cursor: !isClockedIn ? 'not-allowed' : 'pointer' }}
                    onClick={() => isClockedIn && !isLoading && handleClockOut(person._id)}
                    disabled={!isClockedIn || isLoading}>
                    {isLoading ? '...' : '🔴 Clock Out'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Flash Sale Section ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}><span>⚡</span> Today's Flash Sale</div>

        {/* Active sale display */}
        {flashSale && (
          <div style={S.flashActiveBox}>
            <div>
              <div style={S.flashActiveName}>⚡ {flashSale.name}</div>
              <div style={S.flashActiveMeta}>
                ₹{flashSale.salePrice}{' '}
                <span style={{ textDecoration: 'line-through', color: '#5A5248' }}>₹{flashSale.originalPrice}</span>
                <span style={{ marginLeft: '8px', color: '#D4AF37', fontWeight: 700 }}>-{flashSale.discount}% OFF</span>
              </div>
              <div style={S.flashActiveExpiry}>
                ⏳ Ends: {new Date(flashSale.endTime).toLocaleString()}
              </div>
            </div>
            <button style={S.flashEndBtn} onClick={endFlashSale}>🛑 End Sale</button>
          </div>
        )}

        {/* Create new flash sale form */}
        <div style={S.addBox}>
          <div style={{ fontSize: '0.78rem', color: '#C8BEB4', marginBottom: '1rem', fontWeight: 500 }}>
            {flashSale
              ? '⚠️ Creating a new sale will replace the current one.'
              : '🕐 Sale runs for 24 hours from launch. Customers see it as a popup when they open the app.'}
          </div>
          <div style={S.inputRow}>
            {[
              { key: 'name',          placeholder: 'Item Name *' },
              { key: 'description',   placeholder: 'Short Description' },
              { key: 'originalPrice', placeholder: 'Original Price ₹ *' },
              { key: 'salePrice',     placeholder: 'Sale Price ₹ *' },
              { key: 'image',         placeholder: 'Image URL (optional)' },
            ].map(f => (
              <input
                key={f.key}
                placeholder={f.placeholder}
                value={flashForm[f.key]}
                onChange={e => setFlashForm({ ...flashForm, [f.key]: e.target.value })}
                style={S.input}
                onFocus={e => e.target.style.borderColor = '#D4AF37'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
            ))}
          </div>
          <button
            style={{ ...S.flashLaunchBtn, opacity: flashLoading ? 0.6 : 1 }}
            onClick={createFlashSale}
            disabled={flashLoading}
            onMouseEnter={e => e.currentTarget.style.background = '#F0CB5A'}
            onMouseLeave={e => e.currentTarget.style.background = '#D4AF37'}>
            {flashLoading ? '⏳ Launching...' : '⚡ Launch Flash Sale'}
          </button>
          {flashMsg && (
            <p style={flashMsg.startsWith('✅') ? S.successMsg : S.errorMsg}>{flashMsg}</p>
          )}
        </div>
      </div>

      {/* ── Add Menu Item ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}><span>🍽</span> Add Menu Item</div>
        <div style={S.addBox}>
          <div style={S.inputRow}>
            {[
              { key: 'name',        placeholder: 'Item Name *' },
              { key: 'description', placeholder: 'Description' },
              { key: 'price',       placeholder: 'Price (₹) *' },
              { key: 'category',    placeholder: 'Category' },
              { key: 'image',       placeholder: 'Image URL' },
            ].map(f => (
              <input key={f.key} placeholder={f.placeholder} value={newItem[f.key]}
                onChange={e => setNewItem({ ...newItem, [f.key]: e.target.value })}
                style={S.input}
                onFocus={e => e.target.style.borderColor = '#F5C842'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
            ))}
          </div>
          <button style={S.addBtn} onClick={addItem}
            onMouseEnter={e => e.currentTarget.style.background = '#FFD86B'}
            onMouseLeave={e => e.currentTarget.style.background = '#F5C842'}>
            ＋ Add Item
          </button>
          {msg && <p style={msg.startsWith('✅') ? S.successMsg : S.errorMsg}>{msg}</p>}
        </div>
      </div>

      {/* ── All Orders ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>
          <span>📋</span> All Orders
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#C8BEB4', fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)', padding: '0.2rem 0.75rem', borderRadius: '100px' }}>
            {orders.length} total
          </span>
        </div>
        {orders.length > 0 && (
          <div style={S.ordersActionBar}>
            {deliveredCount > 0 && (
              <button style={S.clearDeliveredBtn}
                onClick={() => setConfirm({ type: 'delivered' })}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(46,204,113,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(46,204,113,0.12)'}>
                🧹 Clear Delivered ({deliveredCount})
              </button>
            )}
            <button style={S.clearAllBtn}
              onClick={() => setConfirm({ type: 'all' })}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,53,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,53,0.12)'}>
              🗑️ Clear All Orders
            </button>
          </div>
        )}
        {orders.length === 0 ? (
          <div style={S.empty}>No orders yet.</div>
        ) : orders.map(order => {
          const sc = STATUS_COLOR[order.status] || STATUS_COLOR.pending;
          return (
            <div key={order._id} style={S.orderCard}>
              <div>
                <div style={S.orderUser}>{order.user?.name || 'Unknown'}</div>
                <div style={S.orderEmail}>{order.user?.email}</div>
                <div style={S.orderMeta}>
                  #{order._id.slice(-6).toUpperCase()} · ₹{order.totalAmount}
                  {order.deliveryPerson && (
                    <span style={{ marginLeft: '0.5rem', color: '#F5C842' }}>
                      🛵 {deliveryPersons.find(p => p._id === order.deliveryPerson)?.name || 'Assigned'}
                    </span>
                  )}
                </div>
                <span style={{ ...S.statusBadge, background: sc.bg, color: sc.color }}>● {order.status}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={S.select}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button style={S.deleteBtn}
                  onClick={() => setConfirm({ type: 'single', orderId: order._id })}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,53,0.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,53,0.1)'}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      {confirm && (
        <div style={S.overlay} onClick={() => setConfirm(null)}>
          <div style={S.dialog} onClick={e => e.stopPropagation()}>
            <div style={S.dialogIcon}>{CONFIRM_TEXT[confirm.type].icon}</div>
            <div style={S.dialogTitle}>{CONFIRM_TEXT[confirm.type].title}</div>
            <div style={S.dialogDesc}>{CONFIRM_TEXT[confirm.type].desc}</div>
            <div style={S.dialogBtns}>
              <button style={S.dialogCancel} onClick={() => setConfirm(null)}>Cancel</button>
              <button style={{ ...S.dialogConfirm, opacity: deleting ? 0.6 : 1 }}
                onClick={handleConfirm} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}