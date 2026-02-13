// src/pages/Shop.jsx
import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const categories = ["الكل", "ملابس", "عبايات رجالية", "نعل وأحذية طبية", "جوارب", "شاش", "ساعات يد", "نظارات", "عطور", "ماكينات حلاقة", "ملابس داخلية"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://dz-shop-api.onrender.com/api/products');
        const data = await res.json();
        const shopProducts = data.filter(p => p.category !== "تفصيل وخياطة" && p.category !== "أقمشة بازان");
        setProducts(shopProducts);
        setFilteredProducts(shopProducts);
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== 'الكل') {
      result = result.filter(p => p.category === category || p.subCategory === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [category, searchTerm, products]);

  return (
    // md:pb-12: مسافة سفلية أكبر للكمبيوتر
    // max-w-7xl mx-auto: توسيط المحتوى وعدم تمدده للأطراف في الشاشات العملاقة
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 md:pb-12 max-w-7xl mx-auto">
      
      {/* رأس الصفحة: البحث والفلترة */}
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4 shadow-sm md:static md:shadow-none md:pt-8 md:mb-8">
        <div className="flex gap-2 mb-4 md:max-w-xl md:mx-auto">
          <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 transition md:hidden">
            <Filter size={20} />
          </button>
        </div>

        {/* الفئات: سحب أفقي للهاتف، التفاف (Wrap) للكمبيوتر */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar md:flex-wrap md:justify-center">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition border ${category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة المنتجات */}
      {/* grid-cols-2: للهاتف (كما هو) */}
      {/* md:grid-cols-3 lg:grid-cols-4: للكمبيوتر (3 أو 4 أعمدة) */}
      {/* gap-4 md:gap-6: زيادة المسافات في الكمبيوتر */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition duration-300 md:p-4 group">
            <Link to={`/product/${product._id}`} className="block">
              <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3 md:h-56 relative">
                 {(product.images?.[0] || product.image)?.includes('http') ? (
                   // 👇 التعديل هنا: إضافة خاصية Lazy Loading 👇
                   <img 
                     src={product.images?.[0] || product.image} 
                     className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                     alt={product.name} 
                     loading="lazy"    // تأجيل تحميل الصورة حتى تظهر على الشاشة
                     decoding="async"  // فك تشفير الصورة في الخلفية لعدم تجميد المتصفح
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">لا توجد صورة</div>
                 )}
                 {/* زر سريع للكمبيوتر فقط */}
                 <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition items-center justify-center">
                    <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold text-sm shadow-lg">التفاصيل</span>
                 </div>
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1 md:text-lg">{product.name}</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2 md:text-sm">{product.description}</p>
            </Link>
            
            <div className="mt-auto flex justify-between items-center">
              <span className="font-bold text-blue-600 text-sm md:text-lg">{product.price} د.ج</span>
              <button 
                onClick={() => addToCart(product)}
                className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition md:px-4 md:py-2 md:flex md:items-center md:gap-2"
              >
                <ShoppingCart size={18} />
                <span className="hidden md:inline text-xs font-bold">إضافة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-400">
            <p className="text-lg">لا توجد منتجات مطابقة للبحث</p>
        </div>
      )}
    </div>
  );
}