import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gifts from './pages/Gifts';
import DrinkingWater from './pages/DrinkingWater';
import IndustrialAppliances from './pages/IndustrialAppliances';
import DigitalMarketing from './pages/DigitalMarketing';
import ITServices from './pages/ITServices';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import CustomerLogin from './pages/CustomerLogin';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 1. Home (Multi-Vertical Overview) */}
        <Route index element={<Home />} />

        {/* 2. Gift Gallery */}
        <Route path="gifts" element={<Gifts />} />

        {/* 3. Drinking Water Supply */}
        <Route path="water" element={<DrinkingWater />} />
        <Route path="bottles" element={<Navigate to="/water" replace />} />

        {/* 4. Industrial Appliances */}
        <Route path="appliances" element={<IndustrialAppliances />} />
        <Route path="industrial" element={<Navigate to="/appliances" replace />} />

        {/* 5. Digital Marketing */}
        <Route path="marketing" element={<DigitalMarketing />} />

        {/* 6. IT Services */}
        <Route path="it-services" element={<ITServices />} />
        <Route path="services" element={<Navigate to="/it-services" replace />} />

        {/* 7. Cart & Checkout */}
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

        {/* 8. Account & Orders */}
        <Route path="account" element={<Account />} />
        <Route path="login" element={<CustomerLogin />} />
        <Route path="register" element={<CustomerLogin />} />
        <Route path="contact" element={<Contact />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

