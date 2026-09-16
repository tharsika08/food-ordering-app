import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const VEHICLE_ICON = { Bike: '🏍', Scooter: '🛵', Bicycle: '🚲', Car: '🚗' };
const STATUS_COLOR = {
  available:   { color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  label: 'Available' },
  on_delivery: { color: '#F5C842', bg: 'rgba(245,200,66,0.12)',  label: 'On Delivery' },
  resting:     { color: '#5B9BD5', bg: 'rgba(91,155,213,0.12)',  label: 'Resting' },
  off_duty:    { color: '#E8E0D5', bg: 'rgba(232,224,213,0.08)', label: 'Off Duty' },
};

const S = {
  root: { minHeight: '100vh', background: '#0D0D0D', color: '#F5F0E8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: '3rem 2rem', paddingBottom: '5rem' },
  inner: { maxWidth: '1040px', margin: '0 auto' },
  tag: { display: 'inline-block', background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.4)', color: '#F5C842', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: '100px', marginBottom: '0.8rem' },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.3rem' },
  titleAccent: { color: '#F5C842', fontStyle: 'italic' },
  subtitle: { color: '#C8BEB4', fontSize: '0.9rem', marginBottom: '2.5rem' },
  emptyWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' },
  emptyIcon: { fontSize: '5rem', marginBottom: '1.2rem' },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' },
  emptyDesc: { color: '#C8BEB4', marginBottom: '2rem' },
  browseBtn: { display: 'inline-block', background: '#F5C842', color: '#0D0D0D', padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' },
  itemsBox: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', overflow: 'hidden' },
  itemsHeader: { padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.6rem' },
  itemsHeaderTitle: { fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' },
  itemsHeaderCount: { marginLeft: 'auto', background: 'rgba(245,200,66,0.15)', color: '#F5C842', fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: '100px' },
  cartItem: { padding: '1.2rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  itemImg: { width: '72px', height: '72px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, background: '#1A1510' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem', marginBottom: '2px' },
  itemUnitPrice: { fontSize: '0.75rem', color: '#C8BEB4', marginBottom: '0.7rem' },
  qtyWrap: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.15)' },
  qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px 12px', fontSize: '1rem', color: '#F5C842', fontWeight: 700, lineHeight: 1 },
  qtyNum: { minWidth: '24px', textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' },
  itemRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' },
  itemTotal: { fontWeight: 700, color: '#F5C842', fontSize: '1rem' },
  removeBtn: { background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'underline', fontFamily: 'inherit' },
  clearWrap: { padding: '1rem 1.5rem', textAlign: 'center' },
  clearBtn: { background: 'none', border: 'none', color: '#FF6B35', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', textDecoration: 'underline' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  box: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.4rem' },
  boxTitle: { fontSize: '0.78rem', color: '#C8BEB4', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', outline: 'none', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' },
  promoRow: { display: 'flex', gap: '0.6rem' },
  promoInput: { flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.65rem 1rem', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' },
  promoBtn: { padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#C8BEB4', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem' },
  summaryLabel: { color: '#C8BEB4' },
  summaryVal: { fontWeight: 600, color: '#FFFFFF' },
  summaryFree: { color: '#2ECC71', fontWeight: 700 },
  totalRowFinal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', marginTop: '0.4rem' },
  totalLabel: { fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' },
  totalVal: { fontSize: '1.3rem', fontWeight: 800, color: '#F5C842' },
  deliveryBox: { background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '14px', padding: '1.2rem 1.4rem' },
  deliveryTitle: { fontWeight: 700, color: '#2ECC71', fontSize: '0.88rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  deliveryTime: { fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' },
  deliveryMins: { fontSize: '0.78rem', color: '#C8BEB4' },
  msgSuccess: { padding: '0.9rem 1.2rem', borderRadius: '10px', background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.3)', color: '#2ECC71', fontSize: '0.88rem', fontWeight: 600, textAlign: 'center' },
  msgError: { padding: '0.9rem 1.2rem', borderRadius: '10px', background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', color: '#FF6B35', fontSize: '0.88rem', fontWeight: 600, textAlign: 'center' },
  placeBtn: { width: '100%', padding: '1rem', background: '#F5C842', color: '#0D0D0D', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 800, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  placeBtnDisabled: { background: 'rgba(255,255,255,0.1)', color: '#7A7068', cursor: 'not-allowed' },

  // Delivery person picker
  dpGrid: { display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '2px' },
  dpCard: { display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' },
  dpCardSelected: { border: '1px solid rgba(245,200,66,0.5)', background: 'rgba(245,200,66,0.07)' },
  dpCardDisabled: { opacity: 0.45, cursor: 'not-allowed' },
  dpAvatar: { width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(245,200,66,0.12)', border: '2px solid rgba(245,200,66,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#F5C842', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" },
  dpInfo: { flex: 1, minWidth: 0 },
  dpName: { fontWeight: 700, color: '#FFFFFF', fontSize: '0.88rem', marginBottom: '2px' },
  dpMeta: { fontSize: '0.72rem', color: '#E8E0D5', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  dpRating: { color: '#F5C842', fontWeight: 700, fontSize: '0.78rem' },
  dpDeliveries: { color: '#C8BEB4', fontSize: '0.72rem' },
  dpStatusBadge: { fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px', width: 'fit-content' },
  dpCheck: { width: '20px', height: '20px', borderRadius: '50%', background: '#F5C842', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#0D0D0D', flexShrink: 0 },
  dpCheckEmpty: { width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 },
  dpLoadingWrap: { padding: '1.5rem', textAlign: 'center', color: '#C8BEB4', fontSize: '0.85rem' },
  dpSortRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: '#C8BEB4' },
  dpSortBtn: { padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#C8BEB4', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 600 },
  dpSortBtnActive: { background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.3)', color: '#F5C842' },
  selectedBar: { padding: '0.7rem 1rem', background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.2)', borderRadius: '10px', fontSize: '0.8rem', color: '#F5C842', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem' },
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Cart() {
  const { cart, removeFromCart, clearCart, total, updateQuantity } = useCart();
  const [address, setAddress]           = useState('');
  const [promo, setPromo]               = useState('');
  const [msg, setMsg]                   = useState('');
  const [loading, setLoading]           = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [dpLoading, setDpLoading]       = useState(true);
  const [selectedDp, setSelectedDp]     = useState(null);
  const [dpSort, setDpSort]             = useState('rating'); // 'rating' | 'deliveries'
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    api.get('/delivery')
      .then(r => { setDeliveryPersons(r.data); setDpLoading(false); })
      .catch(() => setDpLoading(false));
  }, []);

  const subtotal    = total;
  const deliveryFee = subtotal > 0 ? (subtotal > 500 ? 0 : 40) : 0;
  const tax         = Math.round(subtotal * 0.05);
  const finalTotal  = subtotal + deliveryFee + tax;

  const calcDelivery = () => {
    if (cart.length === 0) return null;
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const mins = 15 + totalItems * 2 + 20;
    const time = new Date(Date.now() + mins * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { mins, time };
  };
  const deliveryEst = calcDelivery();

  const sortedPersons = [...deliveryPersons].sort((a, b) =>
    dpSort === 'rating' ? b.rating - a.rating : b.totalDeliveries - a.totalDeliveries
  );

  const placeOrder = async () => {
    if (!address || address.trim().length < 5) { setMsg('❌ Please enter a valid delivery address'); return; }
    setLoading(true);
    try {
      const items = cart.map(i => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image }));
      await api.post('/orders', { items, address, totalAmount: finalTotal, deliveryPerson: selectedDp?._id || null });
      clearCart();
      setMsg('✅ Order placed successfully!');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.msg || 'Failed to place order'));
    } finally { setLoading(false); }
  };

  if (cart.length === 0) return (
    <div style={{ ...S.root, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={S.emptyWrap}>
        <div style={S.emptyIcon}>🛒</div>
        <div style={S.emptyTitle}>Your Cart is <span style={{ color: '#F5C842', fontStyle: 'italic' }}>Empty</span></div>
        <div style={S.emptyDesc}>Add delicious food items to get started!</div>
        <a href="/" style={S.browseBtn}>Browse Menu</a>
      </div>
    </div>
  );

  return (
    <div style={S.root}>
      <div style={S.inner}>
        <div style={S.tag}>🛒 Checkout</div>
        <h2 style={S.title}>Your <span style={S.titleAccent}>Cart</span></h2>
        <p style={S.subtitle}>Review your order before checkout</p>

        <div style={S.grid}>
          {/* Left — Cart Items */}
          <div>
            <div style={S.itemsBox}>
              <div style={S.itemsHeader}>
                <span style={{ fontSize: '1.1rem' }}>🍽</span>
                <span style={S.itemsHeaderTitle}>Order Items</span>
                <span style={S.itemsHeaderCount}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
              </div>
              {cart.map((item, idx) => (
                <div key={item._id} style={{ ...S.cartItem, borderBottom: idx < cart.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <img src={item.image || 'https://placehold.co/72x72/1A1710/F5C842?text=Food'} alt={item.name} style={S.itemImg}
                    onError={e => { e.currentTarget.src = 'https://placehold.co/72x72/1A1710/F5C842?text=Food'; }} />
                  <div style={S.itemInfo}>
                    <div style={S.itemName}>{item.name}</div>
                    <div style={S.itemUnitPrice}>₹{item.price} each</div>
                    <div style={S.qtyWrap}>
                      <button style={S.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span style={S.qtyNum}>{item.quantity}</span>
                      <button style={S.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div style={S.itemRight}>
                    <span style={S.itemTotal}>₹{item.price * item.quantity}</span>
                    <button style={S.removeBtn} onClick={() => removeFromCart(item._id)}>Remove</button>
                  </div>
                </div>
              ))}
              <div style={S.clearWrap}>
                <button style={S.clearBtn} onClick={clearCart}>🗑️ Clear Cart</button>
              </div>
            </div>

            {/* Delivery Person Picker */}
            <div style={{ ...S.box, marginTop: '1.2rem' }}>
              <div style={S.boxTitle}>
                <span>🛵</span> Choose Delivery Person
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#A09080', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>Optional</span>
              </div>

              {/* Sort buttons */}
              <div style={S.dpSortRow}>
                Sort by:
                {['rating', 'deliveries'].map(s => (
                  <button key={s} onClick={() => setDpSort(s)}
                    style={{ ...S.dpSortBtn, ...(dpSort === s ? S.dpSortBtnActive : {}) }}>
                    {s === 'rating' ? '⭐ Rating' : '📦 Deliveries'}
                  </button>
                ))}
              </div>

              {dpLoading ? (
                <div style={S.dpLoadingWrap}>🛵 Loading delivery team...</div>
              ) : deliveryPersons.length === 0 ? (
                <div style={S.dpLoadingWrap}>No delivery persons available</div>
              ) : (
                <div style={S.dpGrid}>
                  {sortedPersons.map(person => {
                    const sc = STATUS_CONFIG[person.status] || STATUS_CONFIG.off_duty;
                    const isSelected = selectedDp?._id === person._id;
                    const isUnavailable = person.status === 'off_duty';
                    return (
                      <div key={person._id}
                        style={{
                          ...S.dpCard,
                          ...(isSelected ? S.dpCardSelected : {}),
                          ...(isUnavailable ? S.dpCardDisabled : {}),
                        }}
                        onClick={() => {
                          if (isUnavailable) return;
                          setSelectedDp(isSelected ? null : person);
                        }}
                      >
                        <div style={S.dpAvatar}>{getInitials(person.name)}</div>
                        <div style={S.dpInfo}>
                          <div style={S.dpName}>{person.name}</div>
                          <div style={S.dpMeta}>
                            <span>{VEHICLE_ICON[person.vehicleType]} {person.vehicleType}</span>
                            <span style={S.dpRating}>⭐ {person.rating}</span>
                            <span style={S.dpDeliveries}>📦 {person.totalDeliveries} deliveries</span>
                          </div>
                          <span style={{ ...S.dpStatusBadge, background: sc.bg, color: sc.color }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.color, display: 'inline-block' }} />
                            {sc.label}
                          </span>
                        </div>
                        <div>{isSelected ? <div style={S.dpCheck}>✓</div> : <div style={S.dpCheckEmpty} />}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedDp && (
                <div style={S.selectedBar}>
                  ✓ {selectedDp.name} selected · ⭐ {selectedDp.rating} · {VEHICLE_ICON[selectedDp.vehicleType]} {selectedDp.vehicleType}
                  <button onClick={() => setSelectedDp(null)}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#A09080', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Right — Summary */}
          <div style={S.rightCol}>
            <div style={S.box}>
              <div style={S.boxTitle}>📍 Delivery Address</div>
              <textarea placeholder="Enter your full delivery address..." value={address}
                onChange={e => setAddress(e.target.value)} style={S.textarea}
                onFocus={e => e.target.style.borderColor = '#F5C842'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
            </div>
            <div style={S.box}>
              <div style={S.boxTitle}>🎟️ Promo Code</div>
              <div style={S.promoRow}>
                <input type="text" placeholder="Enter promo code" value={promo}
                  onChange={e => setPromo(e.target.value)} style={S.promoInput}
                  onFocus={e => e.target.style.borderColor = '#F5C842'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
                <button style={S.promoBtn}>Apply</button>
              </div>
            </div>
            <div style={S.box}>
              <div style={S.boxTitle}>💰 Order Summary</div>
              <div style={S.summaryRow}>
                <span style={S.summaryLabel}>Subtotal</span>
                <span style={S.summaryVal}>₹{subtotal}</span>
              </div>
              <div style={S.summaryRow}>
                <span style={S.summaryLabel}>Delivery Fee {deliveryFee === 0 && <span style={{ color: '#2ECC71', fontSize: '0.7rem' }}>(Free!)</span>}</span>
                <span style={deliveryFee === 0 ? S.summaryFree : S.summaryVal}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div style={S.summaryRow}>
                <span style={S.summaryLabel}>GST (5%)</span>
                <span style={S.summaryVal}>₹{tax}</span>
              </div>
              {selectedDp && (
                <div style={S.summaryRow}>
                  <span style={S.summaryLabel}>🛵 Delivery by</span>
                  <span style={{ fontWeight: 600, color: '#F5C842', fontSize: '0.85rem' }}>{selectedDp.name}</span>
                </div>
              )}
              <div style={S.totalRowFinal}>
                <span style={S.totalLabel}>Total</span>
                <span style={S.totalVal}>₹{finalTotal}</span>
              </div>
            </div>

            {deliveryEst && (
              <div style={S.deliveryBox}>
                <div style={S.deliveryTitle}><span>🚀</span> Estimated Delivery</div>
                <div style={S.deliveryTime}>{deliveryEst.time}</div>
                <div style={S.deliveryMins}>⏱️ Approx {deliveryEst.mins} minutes from now</div>
              </div>
            )}

            {msg && <div style={msg.includes('✅') ? S.msgSuccess : S.msgError}>{msg}</div>}

            <button onClick={placeOrder} disabled={loading || !address || cart.length === 0}
              style={{ ...S.placeBtn, ...(loading || !address ? S.placeBtnDisabled : {}) }}
              onMouseEnter={e => { if (!loading && address) e.currentTarget.style.background = '#FFD86B'; }}
              onMouseLeave={e => { if (!loading && address) e.currentTarget.style.background = '#F5C842'; }}>
              {loading ? '⏳ Placing Order...' : '✓ Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// needs to be defined before component uses it
const STATUS_CONFIG = {
  available:   { color: '#2ECC71', bg: 'rgba(46,204,113,0.12)',  label: 'Available' },
  on_delivery: { color: '#F5C842', bg: 'rgba(245,200,66,0.12)',  label: 'On Delivery' },
  resting:     { color: '#5B9BD5', bg: 'rgba(91,155,213,0.12)',  label: 'Resting' },
  off_duty:    { color: '#E8E0D5', bg: 'rgba(232,224,213,0.08)', label: 'Off Duty' },
};