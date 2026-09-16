import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
const statusMessages = {
  pending:   { icon: '⏳', title: 'Order Placed',  desc: 'Waiting for confirmation' },
  confirmed: { icon: '✅', title: 'Confirmed',      desc: 'Restaurant confirmed your order' },
  preparing: { icon: '👨‍🍳', title: 'Preparing',     desc: 'Your food is being prepared' },
  ready:     { icon: '🎉', title: 'Ready',          desc: 'Your order is ready for pickup' },
  delivered: { icon: '🚚', title: 'Delivered',      desc: 'Order delivered successfully' },
};
const STATUS_COLOR = {
  pending: '#F5C842', confirmed: '#5B9BD5', preparing: '#FF6B35', ready: '#A78BFA', delivered: '#2ECC71',
};
const PLACEHOLDER = 'https://placehold.co/80x80/1A1710/F5C842?text=Food';

function FoodImage({ src, alt, style }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);
  useEffect(() => { setImgSrc(src || PLACEHOLDER); }, [src]);
  return <img src={imgSrc} alt={alt || 'Food'} style={style} onError={() => setImgSrc(PLACEHOLDER)} />;
}

const S = {
  root: { minHeight: '100vh', background: '#0D0D0D', color: '#F5F0E8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '3rem 2rem', paddingBottom: '5rem' },
  inner: { maxWidth: '820px', margin: '0 auto' },
  tag: { display: 'inline-block', background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.4)', color: '#F5C842', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: '100px', marginBottom: '0.8rem' },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.3rem' },
  titleAccent: { color: '#F5C842', fontStyle: 'italic' },
  subtitle: { color: '#C8BEB4', fontSize: '0.9rem', marginBottom: '2rem' },
  actionBar: { display: 'flex', gap: '0.7rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' },
  clearDeliveredBtn: { padding: '0.5rem 1.1rem', background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ECC71', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' },
  clearAllBtn: { padding: '0.5rem 1.1rem', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' },
  orderCountBadge: { marginLeft: 'auto', fontSize: '0.75rem', color: '#A09080', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '100px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  dialog: { background: '#1A1710', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', padding: '2rem', maxWidth: '380px', width: '100%', textAlign: 'center' },
  dialogIcon: { fontSize: '2.8rem', marginBottom: '0.8rem' },
  dialogTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' },
  dialogDesc: { color: '#C8BEB4', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 },
  dialogBtns: { display: 'flex', gap: '0.8rem', justifyContent: 'center' },
  dialogCancel: { padding: '0.6rem 1.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#C8BEB4', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' },
  dialogConfirm: { padding: '0.6rem 1.5rem', background: '#FF6B35', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem' },
  emptyBox: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.4rem' },
  emptyDesc: { color: '#C8BEB4', fontSize: '0.9rem', marginBottom: '1.5rem' },
  browseBtn: { display: 'inline-block', background: '#F5C842', color: '#0D0D0D', padding: '0.7rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' },
  orderCard: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', overflow: 'hidden', marginBottom: '1.5rem' },
  orderHeader: { padding: '1.3rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  thumbsWrap: { display: 'flex', position: 'relative', height: '44px', flexShrink: 0 },
  orderInfo: { flex: 1, marginLeft: '1rem' },
  orderNum: { fontSize: '0.72rem', color: '#C8BEB4', letterSpacing: '0.5px' },
  orderStatus: { fontSize: '1rem', fontWeight: 700, marginTop: '2px' },
  orderRight: { textAlign: 'right', flexShrink: 0 },
  orderAmount: { fontSize: '1rem', fontWeight: 700, color: '#F5C842' },
  orderDate: { fontSize: '0.72rem', color: '#C8BEB4', marginTop: '2px' },
  toggleHint: { fontSize: '0.68rem', color: '#A09080', marginTop: '4px' },
  timelineWrap: { padding: '1.5rem', background: 'rgba(0,0,0,0.25)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  timelineRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' },
  timelineLine: { position: 'absolute', top: '18px', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.1)' },
  timelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 },
  timelineDot: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', position: 'relative', zIndex: 1, border: '2px solid #0D0D0D' },
  timelineLabel: { marginTop: '0.6rem', fontSize: '0.65rem', textAlign: 'center', fontWeight: 600 },
  expandedWrap: { padding: '1.5rem' },
  expandedTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.6rem' },
  itemName: { fontWeight: 700, color: '#FFFFFF', fontSize: '0.9rem', marginBottom: '3px' },
  itemQty: { display: 'inline-block', background: 'rgba(245,200,66,0.15)', color: '#F5C842', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' },
  itemPrice: { fontWeight: 700, color: '#F5C842', fontSize: '0.95rem', flexShrink: 0 },
  totalRow: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)' },
  totalLabel: { color: '#C8BEB4', fontSize: '0.85rem' },
  totalVal: { fontWeight: 800, fontSize: '1.2rem', color: '#F5C842' },
  infoBox: { padding: '0.9rem 1.1rem', borderRadius: '10px', marginTop: '0.8rem', fontSize: '0.82rem' },
  addrBox: { background: 'rgba(91,155,213,0.1)', border: '1px solid rgba(91,155,213,0.25)', color: '#C8BEB4' },
  statusBox: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#C8BEB4' },
  deleteOrderBtn: { marginTop: '1rem', width: '100%', padding: '0.65rem', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)', color: '#FF6B35', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem' },
  toast: { position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1A1710', border: '1px solid rgba(245,200,66,0.3)', color: '#F5C842', padding: '0.7rem 1.5rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#F5C842', flexDirection: 'column', gap: '1rem', background: '#0D0D0D' },
};

export default function Orders() {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [confirm, setConfirm]             = useState(null);
  const [toast, setToast]                 = useState('');
  const [deleting, setDeleting]           = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders/mine')
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleConfirm = async () => {
    if (!confirm || deleting) return;
    setDeleting(true);
    try {
      if (confirm.type === 'single') {
        await api.delete(`/orders/${confirm.orderId}`);
        setOrders(prev => prev.filter(o => o._id !== confirm.orderId));
        setExpandedOrder(null);
        showToast('✓ Order removed');
      } else if (confirm.type === 'delivered') {
        await api.delete('/orders/clear/delivered');
        setOrders(prev => prev.filter(o => o.status !== 'delivered'));
        showToast('✓ Delivered orders cleared');
      } else if (confirm.type === 'all') {
        await api.delete('/orders/clear/all');
        setOrders([]);
        showToast('✓ All orders cleared');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to delete. Try again.');
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const CONFIRM_TEXT = {
    single:    { icon: '🗑️', title: 'Remove this order?',      desc: 'This order will be permanently removed from your history.' },
    delivered: { icon: '🧹', title: 'Clear delivered orders?', desc: `This will remove all ${deliveredCount} delivered order(s) from your history.` },
    all:       { icon: '⚠️', title: 'Clear all orders?',       desc: 'This will permanently delete your entire order history. This cannot be undone.' },
  };

  if (loading) return (
    <div style={S.loading}>
      <div style={{ fontSize: '2.5rem' }}>📦</div>
      <div>Loading your orders...</div>
    </div>
  );

  return (
    <div style={S.root}>
      <div style={S.inner}>
        <div style={S.tag}>📦 Order History</div>
        <h2 style={S.title}>My <span style={S.titleAccent}>Orders</span></h2>
        <p style={S.subtitle}>Track and manage your deliveries</p>

        {orders.length > 0 && (
          <div style={S.actionBar}>
            {deliveredCount > 0 && (
              <button style={S.clearDeliveredBtn} onClick={() => setConfirm({ type: 'delivered' })}>
                🧹 Clear Delivered ({deliveredCount})
              </button>
            )}
            <button style={S.clearAllBtn} onClick={() => setConfirm({ type: 'all' })}>
              🗑️ Clear All
            </button>
            <span style={S.orderCountBadge}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div style={S.emptyBox}>
            <div style={S.emptyIcon}>🍕</div>
            <div style={S.emptyTitle}>No orders yet</div>
            <div style={S.emptyDesc}>Order some delicious food now!</div>
            <a href="/" style={S.browseBtn}>Browse Menu</a>
          </div>
        ) : orders.map(order => {
          const sc = STATUS_COLOR[order.status] || '#F5C842';
          const stepIdx = statusSteps.indexOf(order.status);
          const isExpanded = expandedOrder === order._id;
          return (
            <div key={order._id} style={{ ...S.orderCard, borderColor: isExpanded ? `${sc}44` : 'rgba(255,255,255,0.12)' }}>
              <div style={{ ...S.orderHeader, background: isExpanded ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                <div style={{ ...S.thumbsWrap, width: `${Math.min(order.items?.length, 3) * 28 + 44}px` }}>
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <FoodImage key={idx} src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '2px solid rgba(245,200,66,0.4)', position: 'absolute', left: `${idx * 28}px`, zIndex: 3 - idx }} />
                  ))}
                  {order.items?.length > 3 && (
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(20,16,10,0.85)', border: '2px solid rgba(245,200,66,0.3)', position: 'absolute', left: `${3 * 28}px`, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#F5C842' }}>
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div style={S.orderInfo}>
                  <div style={S.orderNum}>Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div style={{ ...S.orderStatus, color: sc }}>{statusMessages[order.status]?.icon} {statusMessages[order.status]?.title}</div>
                </div>
                <div style={S.orderRight}>
                  <div style={S.orderAmount}>₹{order.totalAmount}</div>
                  <div style={S.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  <div style={S.toggleHint}>{isExpanded ? '▲ Hide' : '▼ Details'}</div>
                </div>
              </div>

              <div style={S.timelineWrap}>
                <div style={S.timelineRow}>
                  <div style={S.timelineLine} />
                  {statusSteps.map((status, idx) => {
                    const done = stepIdx >= idx;
                    const c = STATUS_COLOR[status];
                    return (
                      <div key={status} style={S.timelineStep}>
                        <div style={{ ...S.timelineDot, background: done ? c : 'rgba(255,255,255,0.1)', color: done ? '#0D0D0D' : '#A09080', boxShadow: done ? `0 0 12px ${c}55` : 'none' }}>
                          {done ? '✓' : idx + 1}
                        </div>
                        <div style={{ ...S.timelineLabel, color: done ? '#FFFFFF' : '#A09080' }}>
                          {statusMessages[status]?.title.split(' ')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isExpanded && (
                <div style={S.expandedWrap}>
                  <div style={S.expandedTitle}><span>📋</span> Order Details</div>
                  {order.items.map((item, i) => (
                    <div key={i} style={S.itemRow}>
                      <FoodImage src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={S.itemName}>{item.name}</div>
                        <span style={S.itemQty}>Qty: {item.quantity}</span>
                      </div>
                      <div style={S.itemPrice}>₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                  <div style={S.totalRow}>
                    <span style={S.totalLabel}>Total</span>
                    <span style={S.totalVal}>₹{order.totalAmount}</span>
                  </div>
                  {order.address && (
                    <div style={{ ...S.infoBox, ...S.addrBox }}>
                      <span style={{ color: '#5B9BD5', fontWeight: 600 }}>📍 Delivery Address: </span>{order.address}
                    </div>
                  )}
                  <div style={{ ...S.infoBox, ...S.statusBox }}>
                    <strong style={{ color: '#FFFFFF' }}>Status: </strong>{statusMessages[order.status]?.desc}
                  </div>
                  <button
                    style={S.deleteOrderBtn}
                    onClick={() => setConfirm({ type: 'single', orderId: order._id })}
                  >
                    🗑️ Remove This Order
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {confirm && (
        <div style={S.overlay} onClick={() => setConfirm(null)}>
          <div style={S.dialog} onClick={e => e.stopPropagation()}>
            <div style={S.dialogIcon}>{CONFIRM_TEXT[confirm.type].icon}</div>
            <div style={S.dialogTitle}>{CONFIRM_TEXT[confirm.type].title}</div>
            <div style={S.dialogDesc}>{CONFIRM_TEXT[confirm.type].desc}</div>
            <div style={S.dialogBtns}>
              <button style={S.dialogCancel} onClick={() => setConfirm(null)}>Cancel</button>
              <button style={{ ...S.dialogConfirm, opacity: deleting ? 0.6 : 1 }} onClick={handleConfirm} disabled={deleting}>
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