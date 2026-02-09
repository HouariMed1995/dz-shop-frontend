// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from "react-ga4";

import BottomNav from './components/BottomNav'; // استيراد الشريط السفلي

import Home from './pages/Home';
import Shop from './pages/Shop';
import Tailoring from './pages/Tailoring';
import Fabrics from './pages/Fabrics';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';

function App() {
  const location = useLocation();

  useEffect(() => {
    // إرسال مشاهدة الصفحة لجوجل
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return (
    // --- التصحيح هنا: أضفنا dir="rtl" لقلب الموقع لليمين ---
    <div dir="rtl" className="min-h-screen bg-gray-50 text-right font-cairo">
       
       {/* المحتوى (الصفحات) */}
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/tailoring" element={<Tailoring />} />
          <Route path="/fabrics" element={<Fabrics />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetails />} />
       </Routes>

       {/* عرض الشريط السفلي في كل الصفحات ما عدا الأدمن */}
       {location.pathname !== '/admin' && <BottomNav />}

    </div>
  );
}

export default App;