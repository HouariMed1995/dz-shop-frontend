// src/pages/ProductDetails.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ArrowRight, Loader, Star, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

// استيراد مكتبة السلايدر
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { whatsappNumber } = useSettings();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sliderRef = useRef(null);

  // العودة لطريقة الجلب القديمة (جلب الكل ثم البحث) لضمان العمل
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dz-shop-api.onrender.com/api/products`);
        const data = await res.json();
        const found = data.find(p => p._id === id);
        setProduct(found);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader className="animate-spin text-blue-600" /></div>;
  if (!product) return <div className="text-center pt-20">المنتج غير موجود</div>;

  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  // إعدادات السلايدر (تم الحفاظ عليها)
  const settings = {
    dots: true,
    infinite: displayImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    touchMove: true,
    beforeChange: (current, next) => setActiveImageIndex(next),
    appendDots: dots => (
        <div style={{ bottom: "-35px" }}>
          <ul style={{ margin: "0px", padding: "0px", display: "flex", justifyContent: "center", gap: "8px" }}> {dots} </ul>
        </div>
      ),
      customPaging: i => (
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}></div>
    ),
  };

  return (
    // md:pb-12: مسافة سفلية للكمبيوتر
    <div className="min-h-screen bg-gray-50 pb-10 md:pb-12 font-cairo">
      
      {/* رأس الصفحة (للهاتف فقط) - يخفى في الكمبيوتر */}
      <div className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md z-20 px-4 py-4 shadow-sm flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100/80 rounded-full hover:bg-gray-200 transition">
          <ArrowRight size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h1>
      </div>

      {/* حاوية مركزية للكمبيوتر */}
      <div className="px-4 pt-6 max-w-6xl mx-auto md:px-8 md:pt-10">
        
        {/* زر الرجوع (للكمبيوتر فقط) */}
        <div className="hidden md:block mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-bold">
                <ArrowRight size={20} />
                العودة للمتجر
            </button>
        </div>

        {/* تخطيط الصفحة: عمودي للهاتف، أفقي (Split View) للكمبيوتر */}
        <div className="flex flex-col md:flex-row md:gap-12 md:bg-white md:p-8 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
            
            {/* القسم الأيمن: معرض الصور */}
            <div className="mb-12 relative w-full md:w-1/2 md:mb-0">
                <div className="rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] bg-white border border-gray-100 z-10 relative md:shadow-none md:border-0">
                    <Slider {...settings} ref={sliderRef}>
                        {displayImages.map((img, idx) => (
                        <div key={idx} className="outline-none">
                            {/* md:h-[500px]: تكبير ارتفاع الصورة في الكمبيوتر */}
                            <div className="w-full h-96 md:h-[500px] flex items-center justify-center bg-white">
                                {img.includes('http') ? (
                                <img src={img} className="w-full h-full object-contain p-4" alt={`product-${idx}`} />
                                ) : (
                                <div className={`w-full h-full ${img}`}></div>
                                )}
                            </div>
                        </div>
                        ))}
                    </Slider>
                </div>

                {/* الصور المصغرة (Thumbnails) */}
                {displayImages.length > 1 && (
                    <div className="flex justify-center gap-3 mt-10 px-4 md:mt-6">
                    {displayImages.map((img, idx) => (
                        <button 
                        key={idx} 
                        onClick={() => sliderRef.current.slickGoTo(idx)}
                        className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-sm md:w-20 md:h-20 md:cursor-pointer ${
                            activeImageIndex === idx ? 'border-blue-600 scale-110 ring-4 ring-blue-50' : 'border-white opacity-50 hover:opacity-100 hover:scale-105'
                        }`}
                        >
                        {img.includes('http') ? <img src={img} className="w-full h-full object-cover" /> : <div className={`w-full h-full ${img}`}></div>}
                        </button>
                    ))}
                    </div>
                )}
            </div>

            {/* القسم الأيسر: المعلومات والطلب */}
            <div className="px-2 md:flex-1 md:flex md:flex-col md:justify-center">
                
                <div className="hidden md:flex justify-between items-start mb-4">
                    <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">{product.category}</span>
                    <button className="text-gray-400 hover:text-red-500 transition"><Share2 size={20} /></button>
                </div>

                <div className="flex justify-between items-center mb-4 md:mb-2">
                    <h2 className="text-2xl font-bold text-gray-800 md:text-4xl">{product.name}</h2>
                    {/* السعر يظهر هنا للهاتف، وتحت للكمبيوتر */}
                    <span className="text-3xl font-extrabold text-blue-600 md:hidden">{product.price} <span className="text-sm font-normal text-gray-500">د.ج</span></span>
                </div>

                {/* تقييم وهمي جمالي للكمبيوتر */}
                <div className="hidden md:flex items-center gap-1 mb-6">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                    <span className="text-sm text-gray-400 mr-2">(4.8 تقييم)</span>
                </div>

                {/* السعر للكمبيوتر */}
                <div className="hidden md:block text-4xl font-extrabold text-blue-600 mb-8">{product.price} د.ج</div>
                
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-8 md:bg-transparent md:border-0 md:shadow-none md:p-0 md:text-base md:mb-10">
                    <h3 className="font-bold text-gray-800 mb-2 text-base md:hidden">تفاصيل المنتج</h3>
                    {product.description || "لا يوجد وصف إضافي لهذا المنتج."}
                </div>

                {/* أزرار الطلب */}
                <div className="flex flex-col gap-3 pb-6 px-2 md:flex-row md:gap-4 md:p-0">
                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-700 hover:shadow-none hover:translate-y-1 transition-all duration-300 md:flex-1 md:text-lg"
                    >
                        <ShoppingCart size={22} />
                        أضف للسلة
                    </button>
                    
                    {/* زر واتساب المحدث: يرسل اسم المنتج ورابط الصفحة */}
                    <button 
                        onClick={() => {
                            const currentUrl = window.location.href;
                            const message = `مرحباً، أريد الاستفسار عن هذا المنتج: ${product.name}\nالرابط: ${currentUrl}`;
                            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)] hover:bg-green-600 hover:shadow-none hover:translate-y-1 transition-all duration-300 md:flex-1 md:text-lg"
                    >
                        <MessageCircle size={22} />
                        اطلب عبر واتساب
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}