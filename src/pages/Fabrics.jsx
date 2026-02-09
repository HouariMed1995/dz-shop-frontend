// src/pages/Fabrics.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, MessageCircle, Loader, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom'; // ضروري للتنقل
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export default function Fabrics() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customOrder, setCustomOrder] = useState(""); // حالة الطلب الخاص
  
  const { addToCart } = useCart();
  const { whatsappNumber } = useSettings();

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const res = await fetch('https://dz-shop-api.onrender.com/api/products');
        const data = await res.json();
        // تصفية المنتجات لجلب الأقمشة فقط
        const fabricProducts = data.filter(p => p.category === "أقمشة بازان" || p.mainSection === "أقمشة بازان");
        setFabrics(fabricProducts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchFabrics();
  }, []);

  if (loading) return <div className="h-screen flex justify-center items-center text-blue-600"><Loader className="animate-spin" /></div>;

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 md:pb-12 max-w-7xl mx-auto font-cairo">
      
      {/* العنوان */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">الأقمشة غير الجاهزة</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm md:text-base">
           {fabrics.length} منتج
        </span>
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
        {fabrics.length > 0 ? fabrics.map((product) => (
          
          <div key={product._id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-row md:flex-col gap-4 group hover:shadow-lg transition duration-300 relative">
            
            {/* 1. الصورة (داخل رابط لتكون قابلة للضغط) */}
            <Link to={`/product/${product._id}`} className="w-28 h-28 md:w-full md:h-64 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative block">
               {(product.images?.[0] || product.image)?.includes('http') ? (
                 <img src={product.images?.[0] || product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={product.name} />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">لا صورة</div>
               )}
               
               {/* أيقونة مشاركة تظهر فقط في الكمبيوتر */}
               <div className="hidden md:flex absolute top-3 left-3 bg-white/90 p-2 rounded-full text-gray-600 opacity-0 group-hover:opacity-100 transition shadow-sm hover:text-blue-600 z-10">
                  <Share2 size={18} />
               </div>
            </Link>

            {/* 2. المحتوى */}
            <div className="flex-1 flex flex-col justify-between">
               <div className="md:mb-4">
                  {/* الاسم (داخل رابط ليكون قابلاً للضغط) */}
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-gray-800 mb-1 md:text-xl md:mb-2 line-clamp-1 hover:text-blue-600 transition">{product.name}</h3>
                  </Link>
                  
                  <p className="text-blue-600 font-bold text-sm md:text-lg">{product.price} د.ج <span className="text-gray-400 text-xs font-normal md:text-sm">/ للمتر</span></p>
                  
                  {/* الوصف يظهر فقط في الكمبيوتر */}
                  <p className="hidden md:block text-gray-400 text-sm mt-2 line-clamp-2">{product.description || 'قماش عالي الجودة مناسب لجميع التصاميم...'}</p>
               </div>

               {/* الأزرار */}
               <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button 
                    onClick={() => { addToCart(product); alert('تمت الإضافة للسلة'); }}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 md:py-3 md:text-base"
                  >
                     <ShoppingCart size={18} />
                     <span className="md:inline">إضافة للطلب</span>
                  </button>
                  
                  <button 
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=استفسار عن قماش: ${product.name}`, '_blank')}
                    className="bg-green-50 text-green-600 p-2.5 rounded-xl hover:bg-green-100 transition border border-green-100 shadow-sm md:p-3"
                  >
                     <MessageCircle size={20} />
                  </button>
               </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p>لا توجد أقمشة مضافة حالياً</p>
          </div>
        )}
      </div>

      {/* قسم الطلب الخاص (تمت استعادته وتحسينه للكمبيوتر) */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="md:flex md:gap-10 md:items-center">
            <div className="md:w-1/3 mb-4 md:mb-0">
                <h2 className="text-lg font-bold text-gray-800 mb-2 md:text-2xl">لم تجد القماش المناسب؟ 🧐</h2>
                <p className="text-sm text-gray-600 md:text-base leading-relaxed">
                    لا تقلق! يمكنك طلب أي نوع أو لون قماش غير موجود في القائمة. اكتب مواصفات طلبك وسنوفرها لك بإذن الله.
                </p>
            </div>
            
            <div className="md:flex-1 w-full">
                <textarea 
                className="w-full h-32 p-4 rounded-2xl border border-blue-200 mb-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white" 
                placeholder="مثال: أريد قماش بازن درجة أولى لون أزرق ملكي..."
                value={customOrder}
                onChange={(e) => setCustomOrder(e.target.value)}
                ></textarea>
                
                <button 
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customOrder)}`, '_blank')}
                className="w-full md:w-auto md:px-12 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-green-600 hover:-translate-y-1 transition transform"
                >
                <MessageCircle size={20} /> أرسل الطلب عبر واتساب
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}