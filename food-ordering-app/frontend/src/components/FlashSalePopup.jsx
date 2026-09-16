import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

function useCountdown(endTime) {
  const calc = () => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, expired: false };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [endTime]);
  return time;
}

const pad = (n) => String(n).padStart(2, '0');

export default function FlashSalePopup() {
  const [sale, setSale]       = useState(null);
  const [visible, setVisible] = useState(false);
  const [added, setAdded]     = useState(false);
  const { addToCart }         = useCart();

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=Outfit:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Check if already shown this session
    const shown = sessionStorage.getItem('flashSaleShown');

    api.get('/flashsale/active')
      .then(r => {
        if (r.data && !shown) {
          setSale(r.data);
          setTimeout(() => setVisible(true), 800); // slight delay for effect
          sessionStorage.setItem('flashSaleShown', 'true');
        }
      })
      .catch(console.error);
  }, []);

  const time = useCountdown(sale?.endTime);

  const handleAddToCart = () => {
    if (!sale) return;
    addToCart({
      _id:      sale.menuItem,
      name:     sale.name,
      price:    sale.salePrice,
      image:    sale.image,
      discount: sale.discount,
    });
    setAdded(true);
    setTimeout(() => { setAdded(false); setVisible(false); }, 1200);
  };

  if (!sale || !visible) return null;
  if (time.expired) return null;

  return (
    <>
      <style>{`
        .fsp-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fspFadeIn 0.4s ease;
        }
        @keyframes fspFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fsp-box {
          background: #0C0900;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 22px;
          max-width: 480px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.1);
          animation: fspSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
        }
        @keyframes fspSlideUp {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        .fsp-topbar {
          background: linear-gradient(135deg, #D4AF37, #F0CB5A, #D4AF37);
          padding: 0.6rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fsp-topbar-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #0C0900;
        }
        .fsp-close {
          background: rgba(12,9,0,0.15);
          border: none;
          color: #0C0900;
          width: 26px; height: 26px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
        }
        .fsp-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        .fsp-img-placeholder {
          width: 100%; height: 200px;
          background: #1A1510;
          display: flex; align-items: center; justify-content: center;
          font-size: 5rem;
        }
        .fsp-body { padding: 1.5rem; }
        .fsp-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.4rem;
          line-height: 1.2;
        }
        .fsp-desc {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: #A09880;
          margin-bottom: 1.2rem;
          line-height: 1.5;
        }
        .fsp-price-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.2rem;
        }
        .fsp-sale-price {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #D4AF37;
        }
        .fsp-orig-price {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          color: #5A5248;
          text-decoration: line-through;
        }
        .fsp-discount-badge {
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.3);
          color: #D4AF37;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
        }
        .fsp-countdown-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #5A5248;
          margin-bottom: 0.5rem;
        }
        .fsp-countdown {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.4rem;
        }
        .fsp-time-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.15);
          border-radius: 10px;
          padding: 0.5rem 1rem;
          min-width: 58px;
        }
        .fsp-time-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #D4AF37;
          line-height: 1;
        }
        .fsp-time-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.6rem;
          color: #5A5248;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-top: 3px;
          text-transform: uppercase;
        }
        .fsp-colon {
          font-size: 1.3rem;
          font-weight: 800;
          color: rgba(212,175,55,0.4);
          align-self: center;
          margin-top: -6px;
        }
        .fsp-btn {
          width: 100%;
          padding: 0.95rem;
          background: #D4AF37;
          color: #0C0900;
          border: none;
          border-radius: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.3px;
        }
        .fsp-btn:hover { background: #F0CB5A; }
        .fsp-btn-added { background: #2ECC71 !important; color: #fff !important; }
        .fsp-skip {
          width: 100%;
          margin-top: 0.7rem;
          background: none;
          border: none;
          color: #5A5248;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 0.3rem;
        }
        .fsp-skip:hover { color: #A09880; }
      `}</style>

      <div className="fsp-overlay" onClick={() => setVisible(false)}>
        <div className="fsp-box" onClick={e => e.stopPropagation()}>

          {/* Gold top bar */}
          <div className="fsp-topbar">
            <span className="fsp-topbar-label">⚡ Today's Flash Sale</span>
            <button className="fsp-close" onClick={() => setVisible(false)}>✕</button>
          </div>

          {/* Image */}
          {sale.image ? (
            <img src={sale.image} alt={sale.name} className="fsp-img"
              onError={e => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <div className="fsp-img-placeholder">🍽️</div>
          )}

          {/* Body */}
          <div className="fsp-body">
            <div className="fsp-name">{sale.name}</div>
            {sale.description && <div className="fsp-desc">{sale.description}</div>}

            {/* Price */}
            <div className="fsp-price-row">
              <span className="fsp-sale-price">₹{sale.salePrice}</span>
              <span className="fsp-orig-price">₹{sale.originalPrice}</span>
              <span className="fsp-discount-badge">-{sale.discount}% OFF</span>
            </div>

            {/* Countdown */}
            <div className="fsp-countdown-label">⏳ Offer ends in</div>
            <div className="fsp-countdown">
              <div className="fsp-time-block">
                <span className="fsp-time-val">{pad(time.h)}</span>
                <span className="fsp-time-label">Hours</span>
              </div>
              <span className="fsp-colon">:</span>
              <div className="fsp-time-block">
                <span className="fsp-time-val">{pad(time.m)}</span>
                <span className="fsp-time-label">Mins</span>
              </div>
              <span className="fsp-colon">:</span>
              <div className="fsp-time-block">
                <span className="fsp-time-val">{pad(time.s)}</span>
                <span className="fsp-time-label">Secs</span>
              </div>
            </div>

            {/* Buttons */}
            <button
              className={`fsp-btn${added ? ' fsp-btn-added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Added to Cart!' : '🛒 Grab This Deal'}
            </button>
            <button className="fsp-skip" onClick={() => setVisible(false)}>
              No thanks, skip this offer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}