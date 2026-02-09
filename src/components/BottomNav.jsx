// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Scissors, ShoppingCart } from 'lucide-react';

export default function BottomNav() {
  return (
    // التغيير هنا: أضفنا z-[100] ليكون فوق كل شيء، وتأكدنا من fixed
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[100]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        
        <NavItem to="/" icon={<Home size={24} />} label="الرئيسية" />
        <NavItem to="/shop" icon={<ShoppingBag size={24} />} label="المتجر" />
        <NavItem to="/tailoring" icon={<Scissors size={24} />} label="خياطة" />
        <NavItem to="/cart" icon={<ShoppingCart size={24} />} label="طلبي" />
        
      </div>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors duration-200 ${
          isActive ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"
        }`
      }
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </NavLink>
  );
}