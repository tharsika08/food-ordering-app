import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import ReviewModal from '../components/ReviewModal';

const CATEGORY_EMOJI = {
  'Special Offers': '🔥', 'South Indian': '🥘', 'Starters': '🥗',
  'Sides': '🫙', 'Beverages': '🥤', 'Desserts': '🍮',
  'Breads': '🫓', 'Curries': '🍛', 'Rice': '🍚', 'Default': '🍴',
};

const S = {
  root: { minHeight: '100vh', background: '#0D0D0D', color: '#F5F0E8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", paddingBottom: '4rem' },
  heroBg: { position: 'relative', textAlign: 'center', padding: '4rem 2rem 2rem', overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '320px', background: 'radial-gradient(ellipse, rgba(245,200,66,0.10) 0%, transparent 70%)', pointerEvents: 'none' },
  heroTag: { display: 'inline-block', background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.5)', color: '#FF8B55', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '0.35rem 1.1rem', borderRadius: '100px', marginBottom: '1.2rem' },
  heroTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, color: '#FFFFFF', marginBottom: '0.8rem' },
  heroTitleAccent: { color: '#F5C842', fontStyle: 'italic' },
  heroSubtitle: { color: '#C8BEB4', fontSize: '1rem', marginBottom: '2rem' },
  searchWrap: { position: 'relative', maxWidth: '520px', margin: '0 auto 2.5rem' },
  searchInput: { width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.9rem 2.8rem 0.9rem 3rem', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' },
  searchClear: { position: 'absolute', right: '1.1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#C8BEB4', cursor: 'pointer', fontSize: '1.1rem', padding: '2px 6px' },
  catsWrap: { display: 'flex', gap: '0.55rem', padding: '0 2rem 2.5rem', maxWidth: '1140px', margin: '0 auto', overflowX: 'auto', scrollbarWidth: 'none' },
  catBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#D0C8C0', padding: '0.55rem 1.3rem', borderRadius: '100px', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', flexShrink: 0 },
  catBtnActive: { background: '#F5C842', border: '1px solid #F5C842', color: '#0D0D0D', fontWeight: 700 },
  sectionHeader: { maxWidth: '1140px', margin: '0 auto', padding: '0 2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  sectionEmoji: { fontSize: '2rem', lineHeight: 1 },
  sectionTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#FFFFFF' },
  sectionCount: { marginLeft: 'auto', fontSize: '0.76rem', color: '#C8BEB4', fontWeight: 500, letterSpacing: '0.5px', border: '1px solid rgba(255,255,255,0.15)', padding: '0.2rem 0.75rem', borderRadius: '100px' },
  section: { maxWidth: '1140px', margin: '0 auto', padding: '2rem 2rem 2.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.2rem' },
  card: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.22s, border-color 0.22s, background 0.22s', position: 'relative', display: 'flex', flexDirection: 'column' },
  cardImgWrap: { position: 'relative', height: '175px', overflow: 'hidden', background: '#1A1510', flexShrink: 0 },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', display: 'block' },
  cardBadgesWrap: { position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none' },
  badgeLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  badgeSpecial: { background: '#FF6B35', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.5px', padding: '3px 9px', borderRadius: '100px', textTransform: 'uppercase', width: 'fit-content' },
  badgeOff: { background: 'rgba(20,16,10,0.85)', color: '#F5C842', border: '1px solid rgba(245,200,66,0.4)', fontSize: '0.62rem', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', textTransform: 'uppercase', width: 'fit-content' },
  badgeCat: { background: 'rgba(20,16,10,0.75)', color: '#F5F0E8', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.62rem', fontWeight: 600, padding: '3px 9px', borderRadius: '100px' },
  cardBody: { padding: '1rem 1.1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column' },
  cardName: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem', lineHeight: 1.3 },
  starsRow: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.55rem' },
  starFilled: { color: '#F5C842', fontSize: '13px' },
  starEmpty: { color: '#4A4540', fontSize: '13px' },
  ratingText: { fontSize: '0.75rem', color: '#C8BEB4', fontWeight: 600 },
  cardDesc: { color: '#B0A898', fontSize: '0.8rem', lineHeight: 1.55, marginBottom: '0.85rem', flex: 1 },
  cardFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  priceWrap: { display: 'flex', flexDirection: 'column' },
  priceMain: { fontSize: '1.2rem', fontWeight: 700, color: '#F5C842' },
  priceOrig: { fontSize: '0.78rem', color: '#7A7068', textDecoration: 'line-through' },
  btnGroup: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  reviewBtn: { padding: '7px 10px', background: 'rgba(255,255,255,0.1)', color: '#D0C8C0', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'inherit' },
  addBtn: { padding: '8px 16px', background: '#F5C842', color: '#0D0D0D', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: '0.85rem', transition: 'background 0.2s' },
  loadingWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: '#0D0D0D', color: '#F5C842', fontSize: '1.1rem', flexDirection: 'column', gap: '1rem' },
  errorWrap: { padding: '2rem', textAlign: 'center', color: '#FF6B35', fontSize: '1rem', background: '#0D0D0D', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', color: '#C8BEB4', fontSize: '1rem', padding: '4rem 2rem' },
};

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModal, setReviewModal] = useState({ isOpen: false, item: null });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [addedItem, setAddedItem] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    setLoading(true);
    api.get('/menu')
      .then(r => { setItems(r.data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const categories = ['All', 'Special Offers', ...new Set(items.map(i => i.category))];

  const filteredItems = items.filter(item => {
    const matchesCat = filter === 'All' ? true : filter === 'Special Offers' ? (item.discount > 0 || item.isSpecial) : item.category === filter;
    const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItem(item._id);
    setTimeout(() => setAddedItem(null), 1200);
  };

  if (loading) return <div style={S.loadingWrap}><div style={{ fontSize: '2.5rem' }}>🍳</div><div>Loading delicious food...</div></div>;
  if (error) return <div style={S.errorWrap}>❌ Error loading menu: {error}</div>;

  return (
    <>
      <div style={S.root}>
        <div style={S.heroBg}>
          <div style={S.heroGlow} />
          <div style={S.heroTag}>🍽 Today's Menu</div>
          <h2 style={S.heroTitle}>Discover <span style={S.heroTitleAccent}>Authentic</span><br />South Indian Flavours</h2>
          <p style={S.heroSubtitle}>Handpicked recipes from the heart of the kitchen</p>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input type="text" placeholder="Search for food, cuisine, or ingredients..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)} style={S.searchInput}
              onFocus={e => { e.target.style.borderColor = '#F5C842'; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }} />
            {searchTerm && <button style={S.searchClear} onClick={() => setSearchTerm('')}>×</button>}
          </div>
        </div>

        <div style={S.catsWrap}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{ ...S.catBtn, ...(filter === cat ? S.catBtnActive : {}) }}>
              <span>{CATEGORY_EMOJI[cat] || CATEGORY_EMOJI['Default']}</span>{cat}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 && (
          <div style={S.sectionHeader}>
            <span style={S.sectionEmoji}>{CATEGORY_EMOJI[filter] || CATEGORY_EMOJI['Default']}</span>
            <span style={S.sectionTitle}>{filter}</span>
            <span style={S.sectionCount}>{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div style={S.empty}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽</div>No dishes found.</div>
        ) : (
          <div style={S.section}>
            <div style={S.grid}>
              {filteredItems.map(item => {
                const discountedPrice = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
                const isHovered = hoveredCard === item._id;
                const isAdded = addedItem === item._id;
                return (
                  <div key={item._id}
                    style={{ ...S.card, ...(isHovered ? { transform: 'translateY(-5px)', borderColor: 'rgba(245,200,66,0.4)', background: 'rgba(255,255,255,0.1)' } : {}) }}
                    onMouseEnter={() => setHoveredCard(item._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={S.cardImgWrap}>
                      <img src={item.image} alt={item.name}
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/400x300/1A1710/F5C842?text=${encodeURIComponent(item.name)}`; }}
                        style={{ ...S.cardImg, transform: isHovered ? 'scale(1.06)' : 'scale(1)' }} />
                      <div style={S.cardBadgesWrap}>
                        <div style={S.badgeLeft}>
                          {item.isSpecial && <span style={S.badgeSpecial}>🔥 Special</span>}
                          {item.discount > 0 && <span style={S.badgeOff}>-{item.discount}% OFF</span>}
                        </div>
                        <span style={S.badgeCat}>{item.category}</span>
                      </div>
                    </div>
                    <div style={S.cardBody}>
                      <div style={S.cardName}>{item.name}</div>
                      <div style={S.starsRow}>
                        {[1,2,3,4,5].map(s => <span key={s} style={s <= Math.round(item.rating || 4.5) ? S.starFilled : S.starEmpty}>★</span>)}
                        <span style={S.ratingText}>{(item.rating || 4.5).toFixed(1)} ({item.reviews?.length || 0})</span>
                      </div>
                      <p style={S.cardDesc}>{item.description}</p>
                      <div style={S.cardFooter}>
                        <div style={S.priceWrap}>
                          <span style={S.priceMain}>₹{discountedPrice}</span>
                          {item.discount > 0 && <span style={S.priceOrig}>₹{item.price}</span>}
                        </div>
                        <div style={S.btnGroup}>
                          <button onClick={() => setReviewModal({ isOpen: true, item })} style={S.reviewBtn}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>⭐ Reviews</button>
                          <button onClick={() => handleAddToCart(item)}
                            style={{ ...S.addBtn, background: isAdded ? '#2ECC71' : '#F5C842' }}
                            onMouseEnter={e => { if (!isAdded) e.currentTarget.style.background = '#FFD86B'; }}
                            onMouseLeave={e => { if (!isAdded) e.currentTarget.style.background = '#F5C842'; }}>
                            {isAdded ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ReviewModal item={reviewModal.item} isOpen={reviewModal.isOpen} onClose={() => setReviewModal({ isOpen: false, item: null })} />
    </>
  );
}
