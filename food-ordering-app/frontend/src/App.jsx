import FlashSalePopup from './components/FlashSalePopup';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Order';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryManagement from './pages/DeliveryManagement';
function PrivateRoute({ children, adminOnly }) {
  try {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
    return children;
  } catch (err) {
    console.error('PrivateRoute error:', err);
    return <Navigate to="/login" />;
  }
}

function AppContent() {
  return (
   <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0D0D0D' }}>
    <FlashSalePopup /> 
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"         element={<Menu />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/admin"    element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/delivery" element={<PrivateRoute adminOnly><DeliveryManagement /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  console.log('App component rendering...');
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}