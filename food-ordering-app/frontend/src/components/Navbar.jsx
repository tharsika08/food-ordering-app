import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  try {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const cartCount = cart?.length || 0;
    const isActive = (path) => location.pathname === path;

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=Outfit:wght@400;500;600;700&display=swap');

          .ss-nav {
            position: sticky;
            top: 0;
            z-index: 999;
            background: #0C0900;
            border-bottom: 1px solid rgba(212,175,55,0.18);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: background 0.3s;
            padding: 0 3rem;
            height: 85px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .ss-nav::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent);
            pointer-events: none;
          }

          .ss-logo {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 2.6rem;
            font-weight: 700;
            font-style: italic;
            color: #D4AF37;
            text-decoration: none;
            letter-spacing: 0.3px;
            flex-shrink: 0;
          }
          .ss-logo span {
            color: #FFFFFF;
            font-style: normal;
          }

          .ss-right {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .ss-divider {
            width: 1px;
            height: 20px;
            background: rgba(212,175,55,0.22);
            margin: 0 4px;
          }

          .ss-link {
            font-family: 'Outfit', sans-serif;
            font-size: 18px;
            font-weight: 500;
            color: rgba(255,240,180,0.6);
            text-decoration: none;
            padding: 0.45rem 0.8rem;
            border-radius: 6px;
            transition: color 0.2s;
            white-space: nowrap;
          }
          .ss-link:hover { color: #D4AF37; }
          .ss-link.active {
            color: #D4AF37;
            font-weight: 600;
          }

          .ss-cart {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(212,175,55,0.08);
            border: 1px solid rgba(212,175,55,0.3);
            color: #D4AF37;
            padding: 10px 24px;
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s, border-color 0.2s;
            white-space: nowrap;
          }
          .ss-cart:hover {
            background: rgba(212,175,55,0.15);
            border-color: rgba(212,175,55,0.5);
          }
          .ss-cart-count {
            background: #D4AF37;
            color: #0C0900;
            border-radius: 5px;
            padding: 1px 7px;
            font-size: 12px;
            font-weight: 800;
            line-height: 20px;
          }

          .ss-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(212,175,55,0.1);
            border: 1.5px solid rgba(212,175,55,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 700;
            color: #D4AF37;
            font-family: 'Outfit', sans-serif;
            flex-shrink: 0;
          }

          .ss-username {
            font-family: 'Outfit', sans-serif;
            font-size: 17px;
            font-weight: 500;
            color: rgba(255,240,180,0.65);
            max-width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .ss-logout {
            background: transparent;
            border: 1px solid rgba(212,175,55,0.2);
            color: rgba(255,240,180,0.45);
            padding: 10px 22px;
            border-radius: 7px;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
          }
          .ss-logout:hover {
            background: rgba(212,175,55,0.08);
            border-color: rgba(212,175,55,0.4);
            color: #D4AF37;
          }

          .ss-login {
            background: #D4AF37;
            color: #0C0900;
            padding: 10px 26px;
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-size: 16px;
            font-weight: 700;
            text-decoration: none;
            transition: background 0.2s;
            white-space: nowrap;
          }
          .ss-login:hover { background: #F0CB5A; }

          .ss-hamburger {
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(212,175,55,0.06);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 8px;
            color: #D4AF37;
            width: 44px;
            height: 44px;
            cursor: pointer;
            font-size: 1.3rem;
            flex-shrink: 0;
          }

          .ss-drawer {
            position: fixed;
            top: 85px; left: 0; right: 0;
            z-index: 998;
            background: rgba(12,9,0,0.98);
            border-bottom: 1px solid rgba(212,175,55,0.15);
            backdrop-filter: blur(16px);
            flex-direction: column;
            padding: 1.4rem 2rem 2rem;
            gap: 0.4rem;
          }

          .ss-drawer-link {
            font-family: 'Outfit', sans-serif;
            font-size: 1.05rem;
            font-weight: 500;
            color: rgba(255,240,180,0.6);
            text-decoration: none;
            padding: 0.75rem 0;
            border-bottom: 1px solid rgba(212,175,55,0.08);
            display: block;
          }
          .ss-drawer-link.active {
            color: #D4AF37;
            font-weight: 600;
          }

          .ss-drawer-logout {
            margin-top: 1rem;
            background: rgba(212,175,55,0.08);
            border: 1px solid rgba(212,175,55,0.22);
            color: #D4AF37;
            padding: 0.75rem;
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
          }

          @media (max-width: 640px) {
            .ss-desktop { display: none !important; }
            .ss-hamburger { display: flex !important; }
            .ss-drawer { display: flex; }
          }
          @media (min-width: 641px) {
            .ss-drawer { display: none !important; }
          }
        `}</style>

        <nav className="ss-nav">
          {/* Logo */}
          <Link to="/" className="ss-logo">
            Speedy<span>Spoon</span>
          </Link>

          {/* Desktop right side */}
          <div className="ss-right ss-desktop">
            <Link to="/" className={`ss-link${isActive('/') ? ' active' : ''}`}>Menu</Link>
            <div className="ss-divider" />
            {user && (
              <>
                <Link to="/orders" className={`ss-link${isActive('/orders') ? ' active' : ''}`}>My Orders</Link>
                <div className="ss-divider" />
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className={`ss-link${isActive('/admin') ? ' active' : ''}`}>Admin</Link>
                <div className="ss-divider" />
              </>
            )}
            {user && (
              <Link to="/cart" className="ss-cart">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="ss-cart-count">{cartCount}</span>
                )}
              </Link>
            )}
            {user ? (
              <>
                <div className="ss-avatar">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="ss-username">{user.name || user.email}</span>
                <button className="ss-logout" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="ss-login">Login</Link>
            )}
          </div>

          {/* Hamburger mobile */}
          <button className="ss-hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="ss-drawer">
            <Link to="/" className={`ss-drawer-link${isActive('/') ? ' active' : ''}`}>🍽 Menu</Link>
            {user && (
              <Link to="/cart" className={`ss-drawer-link${isActive('/cart') ? ' active' : ''}`}>
                🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </Link>
            )}
            {user && (
              <Link to="/orders" className={`ss-drawer-link${isActive('/orders') ? ' active' : ''}`}>
                📋 My Orders
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`ss-drawer-link${isActive('/admin') ? ' active' : ''}`}>
                ⚙️ Admin
              </Link>
            )}
            {user ? (
              <button className="ss-drawer-logout" onClick={logout}>Logout</button>
            ) : (
              <Link to="/login" className="ss-login" style={{ textAlign: 'center', marginTop: '0.8rem', display: 'block' }}>
                Login
              </Link>
            )}
          </div>
        )}
      </>
    );
  } catch (err) {
    console.error('Navbar error:', err);
    return <div style={{ padding: '1rem', background: '#0C0900', color: '#D4AF37' }}>SpeedySpoon</div>;
  }
}