import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_CONFIG = {
  available:   { label: 'Available',    color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  dot: '#2ECC71' },
  on_delivery: { label: 'On Delivery',  color: '#F5C842', bg: 'rgba(245,200,66,0.12)',  dot: '#F5C842' },
  resting:     { label: 'Resting',      color: '#5B9BD5', bg: 'rgba(91,155,213,0.12)',  dot: '#5B9BD5' },
  off_duty:    { label: 'Off Duty',     color: '#E8E0D5', bg: 'rgba(232,224,213,0.08)', dot: '#E8E0D5' },
};

const VEHICLE_ICON = { Bike: '🏍', Scooter: '🛵', Bicycle: '🚲', Car: '🚗' };

const S = {
  root: { minHeight: '100vh', background: '#0D0D0D', color: '#F5F0E8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", paddingBottom: '4rem' },
  header: { padding: '3rem 2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '2rem' },
  headerTop: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  tag: { display: 'inline-block', background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.25)', color: '#F5C842', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: '100px', marginBottom: '0.8rem' },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#F5F0E8', lineHeight: 1.1, marginBottom: '0.4rem' },
  titleAccent: { color: '#F5C842', fontStyle: 'italic' },
  subtitle: { color: '#E8E0D5', fontSize: '0.9rem' },
  addBtn: { background: '#F5C842', color: '#0D0D0D', border: 'none', borderRadius: '10px', padding: '0.65rem 1.4rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto 2.5rem', padding: '0 2rem' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  statNum: { fontSize: '2rem', fontWeight: 800, fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: '0.75rem', color: '#E8E0D5', fontWeight: 500, letterSpacing: '0.3px' },
  tabs: { display: 'flex', gap: '0.5rem', padding: '0 2rem 2rem', maxWidth: '1200px', margin: '0 auto', overflowX: 'auto', scrollbarWidth: 'none' },
  tab: { padding: '0.5rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#B8B0A0', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 },
  tabActive: { background: '#F5C842', border: '1px solid #F5C842', color: '#0D0D0D', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' },
  cardTop: { padding: '1.3rem 1.3rem 1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  avatar: { width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, background: 'rgba(245,200,66,0.1)', border: '2px solid rgba(245,200,66,0.2)', fontWeight: 700, color: '#F5C842', fontFamily: "'DM Sans', sans-serif" },
  cardInfo: { flex: 1, minWidth: 0 },
  cardName: { fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#F5F0E8', marginBottom: '0.2rem' },
  cardPhone: { fontSize: '0.78rem', color: '#E8E0D5', marginBottom: '0.5rem' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '100px' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  cardDivider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 1.3rem' },
  cardStats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '1rem 1.3rem', gap: '0.5rem' },
  miniStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  miniStatVal: { fontSize: '1rem', fontWeight: 700, color: '#F5F0E8' },
  miniStatLabel: { fontSize: '0.68rem', color: '#E8E0D5', fontWeight: 500 },
  sessionsWrap: { padding: '1rem 1.3rem' },
  sessionsTitle: { fontSize: '0.72rem', color: '#E8E0D5', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  sessionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.78rem' },
  sessionDate: { color: '#B8B0A0' },
  sessionTime: { color: '#E8E0D5', fontSize: '0.72rem' },
  sessionHours: { color: '#F5C842', fontWeight: 700 },
  cardActions: { display: 'flex', gap: '0.5rem', padding: '0.8rem 1.3rem', flexWrap: 'wrap' },
  actionBtn: { flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#B8B0A0', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' },
  clearSessionsBtn: { width: '100%', margin: '0 1.3rem 1.2rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,107,53,0.25)', background: 'rgba(255,107,53,0.08)', color: '#FF6B35', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center', boxSizing: 'border-box' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { background: '#181410', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#F5F0E8', marginBottom: '1.5rem' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.78rem', color: '#5A5248', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.7rem 1rem', color: '#F5F0E8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', background: '#181410', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.7rem 1rem', color: '#F5F0E8', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  modalBtns: { display: 'flex', gap: '0.75rem', marginTop: '1.5rem' },
  btnPrimary: { flex: 1, padding: '0.7rem', background: '#F5C842', color: '#0D0D0D', border: 'none', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' },
  btnSecondary: { flex: 1, padding: '0.7rem', background: 'transparent', color: '#B8B0A0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  // Confirm dialog
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  dialog: { background: '#1A1710', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', padding: '2rem', maxWidth: '360px', width: '100%', textAlign: 'center' },
  dialogIcon: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  dialogTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' },
  dialogDesc: { color: '#C8BEB4', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.6 },
  dialogBtns: { display: 'flex', gap: '0.8rem', justifyContent: 'center' },
  dialogCancel: { padding: '0.6rem 1.4rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#C8BEB4', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' },
  dialogConfirm: { padding: '0.6rem 1.4rem', background: '#FF6B35', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem' },
  toast: { position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1A1710', border: '1px solid rgba(245,200,66,0.3)', color: '#F5C842', padding: '0.7rem 1.5rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, zIndex: 3000, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', color: '#3A3530', padding: '4rem 2rem', fontSize: '1rem' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#F5C842', flexDirection: 'column', gap: '1rem' },
};

export default function DeliveryManagement() {
  const [persons, setPersons]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ name: '', phone: '', email: '', vehicleType: 'Bike', vehicleNumber: '' });
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null); // person id to clear sessions
  const [clearing, setClearing]   = useState(false);
  const [toast, setToast]         = useState('');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery');
      setPersons(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/delivery/${id}/status`, { status });
      setPersons(prev => prev.map(p => p._id === id ? { ...p, status } : p));
    } catch (err) { console.error(err); }
  };

  const handleAddPerson = async () => {
    if (!form.name || !form.phone) return;
    try {
      setSaving(true);
      const res = await api.post('/delivery', form);
      setPersons(prev => [res.data, ...prev]);
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', vehicleType: 'Bike', vehicleNumber: '' });
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ── NEW: Clear sessions handler ──────────────────────────
  const handleClearSessions = async () => {
    if (!confirmId || clearing) return;
    setClearing(true);
    try {
      const res = await api.patch(`/delivery/${confirmId}/clearsessions`);
      setPersons(prev => prev.map(p => p._id === confirmId ? res.data : p));
      showToast('✓ Work sessions cleared');
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to clear sessions');
    } finally {
      setClearing(false);
      setConfirmId(null);
    }
  };

  const filtered = filter === 'all' ? persons : persons.filter(p => p.status === filter);

  const stats = {
    total:       persons.length,
    available:   persons.filter(p => p.status === 'available').length,
    on_delivery: persons.filter(p => p.status === 'on_delivery').length,
    resting:     persons.filter(p => p.status === 'resting').length,
    off_duty:    persons.filter(p => p.status === 'off_duty').length,
  };

  const getInitials      = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getRecentSessions = (sessions) => [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  if (loading) return (
    <div style={S.loading}>
      <div style={{ fontSize: '2.5rem' }}>🛵</div>
      <div>Loading delivery team...</div>
    </div>
  );

  const confirmPerson = persons.find(p => p._id === confirmId);

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.headerTop}>
          <div>
            <div style={S.tag}>🛵 Delivery Team</div>
            <h1 style={S.title}>Delivery <span style={S.titleAccent}>Personnel</span></h1>
            <p style={S.subtitle}>Track availability, working hours, and delivery status</p>
          </div>
          <button style={S.addBtn} onClick={() => setShowModal(true)}>＋ Add Person</button>
        </div>
      </div>

      <div style={S.statsRow}>
        {[
          { label: 'Total Staff',  val: stats.total,       color: '#F5F0E8' },
          { label: 'Available',    val: stats.available,   color: '#2ECC71' },
          { label: 'On Delivery',  val: stats.on_delivery, color: '#F5C842' },
          { label: 'Resting',      val: stats.resting,     color: '#5B9BD5' },
          { label: 'Off Duty',     val: stats.off_duty,    color: '#E8E0D5' },
        ].map(s => (
          <div key={s.label} style={S.statCard}>
            <span style={{ ...S.statNum, color: s.color }}>{s.val}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={S.tabs}>
        {[
          { key: 'all',         label: 'All',         emoji: '👥' },
          { key: 'available',   label: 'Available',   emoji: '🟢' },
          { key: 'on_delivery', label: 'On Delivery', emoji: '🟡' },
          { key: 'resting',     label: 'Resting',     emoji: '🔵' },
          { key: 'off_duty',    label: 'Off Duty',    emoji: '⚫' },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{ ...S.tab, ...(filter === t.key ? S.tabActive : {}) }}>
            <span>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛵</div>
          No delivery persons in this category.
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map(person => {
            const sc = STATUS_CONFIG[person.status] || STATUS_CONFIG.off_duty;
            const recentSessions = getRecentSessions(person.workSessions || []);
            return (
              <div key={person._id} style={S.card}>
                <div style={S.cardTop}>
                  <div style={S.avatar}>{getInitials(person.name)}</div>
                  <div style={S.cardInfo}>
                    <div style={S.cardName}>{person.name}</div>
                    <div style={S.cardPhone}>📞 {person.phone} · {VEHICLE_ICON[person.vehicleType]} {person.vehicleType}</div>
                    <span style={{ ...S.statusBadge, background: sc.bg, color: sc.color }}>
                      <span style={{ ...S.statusDot, background: sc.dot }} />
                      {sc.label}
                    </span>
                  </div>
                </div>

                <div style={S.cardDivider} />

                <div style={S.cardStats}>
                  <div style={S.miniStat}>
                    <span style={S.miniStatVal}>{person.totalDeliveries}</span>
                    <span style={S.miniStatLabel}>Deliveries</span>
                  </div>
                  <div style={S.miniStat}>
                    <span style={S.miniStatVal}>{person.totalHoursWorked}h</span>
                    <span style={S.miniStatLabel}>Total Hrs</span>
                  </div>
                  <div style={S.miniStat}>
                    <span style={{ ...S.miniStatVal, color: '#F5C842' }}>⭐ {person.rating}</span>
                    <span style={S.miniStatLabel}>Rating</span>
                  </div>
                </div>

                <div style={S.cardDivider} />

                <div style={S.sessionsWrap}>
                  {/* Sessions title + clear button side by side */}
                  <div style={S.sessionsTitle}>
                    <span>Recent Work Sessions</span>
                    {recentSessions.length > 0 && (
                      <button
                        onClick={() => setConfirmId(person._id)}
                        style={{ background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'inherit', padding: '0', textDecoration: 'underline' }}
                      >
                        🗑️ Clear
                      </button>
                    )}
                  </div>
                  {recentSessions.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: '#3A3530' }}>No sessions recorded</div>
                  ) : recentSessions.map((s, i) => (
                    <div key={i} style={S.sessionRow}>
                      <span style={S.sessionDate}>{s.date}</span>
                      <span style={S.sessionTime}>{s.clockIn} {s.clockOut ? `→ ${s.clockOut}` : '→ Active'}</span>
                      <span style={S.sessionHours}>{s.clockOut ? `${s.hoursWorked}h` : '🟢 Now'}</span>
                    </div>
                  ))}
                </div>

                <div style={S.cardActions}>
                  {['available', 'on_delivery', 'resting', 'off_duty']
                    .filter(s => s !== person.status)
                    .map(s => (
                      <button key={s}
                        style={{ ...S.actionBtn, color: STATUS_CONFIG[s].color, borderColor: `${STATUS_CONFIG[s].color}33` }}
                        onClick={() => updateStatus(person._id, s)}
                        onMouseEnter={e => e.currentTarget.style.background = STATUS_CONFIG[s].bg}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Person Modal — unchanged */}
      {showModal && (
        <div style={S.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>Add Delivery Person</div>
            {[
              { key: 'name',          label: 'Full Name *',     placeholder: 'e.g. Arun Kumar',    type: 'text' },
              { key: 'phone',         label: 'Phone *',         placeholder: 'e.g. 9876543210',    type: 'text' },
              { key: 'email',         label: 'Email',           placeholder: 'e.g. arun@email.com',type: 'email' },
              { key: 'vehicleNumber', label: 'Vehicle Number',  placeholder: 'e.g. TN 01 AB 1234', type: 'text' },
            ].map(f => (
              <div key={f.key} style={S.formGroup}>
                <label style={S.label}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={S.input} />
              </div>
            ))}
            <div style={S.formGroup}>
              <label style={S.label}>Vehicle Type</label>
              <select value={form.vehicleType} onChange={e => setForm(p => ({ ...p, vehicleType: e.target.value }))} style={S.select}>
                {['Bike', 'Scooter', 'Bicycle', 'Car'].map(v => (
                  <option key={v} value={v}>{VEHICLE_ICON[v]} {v}</option>
                ))}
              </select>
            </div>
            <div style={S.modalBtns}>
              <button style={S.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={S.btnPrimary} onClick={handleAddPerson} disabled={saving}>
                {saving ? 'Saving...' : 'Add Person'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW: Confirm Clear Sessions Dialog ── */}
      {confirmId && (
        <div style={S.overlay} onClick={() => setConfirmId(null)}>
          <div style={S.dialog} onClick={e => e.stopPropagation()}>
            <div style={S.dialogIcon}>🗑️</div>
            <div style={S.dialogTitle}>Clear Work Sessions?</div>
            <div style={S.dialogDesc}>
              This will permanently delete all work session history for <strong style={{ color: '#FFFFFF' }}>{confirmPerson?.name}</strong>. This cannot be undone.
            </div>
            <div style={S.dialogBtns}>
              <button style={S.dialogCancel} onClick={() => setConfirmId(null)}>Cancel</button>
              <button
                style={{ ...S.dialogConfirm, opacity: clearing ? 0.6 : 1 }}
                onClick={handleClearSessions}
                disabled={clearing}
              >
                {clearing ? 'Clearing...' : 'Yes, Clear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}