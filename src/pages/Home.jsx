// src/pages/Home.jsx
import { useState, useEffect } from 'react'; // أضفنا useState و useEffect
import { Link } from 'react-router-dom';
import { ShoppingBag, Scissors, ArrowRight, Sparkles, Star, SwatchBook } from 'lucide-react'; 
import Footer from '../components/Footer'; 
import { useSettings } from '../context/SettingsContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const { bannerImages } = useSettings();
  const [newArrivals, setNewArrivals] = useState([]); // حالة لتخزين المنتجات الجديدة

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://dz-shop-api.onrender.com/api/products');
        const data = await res.json();
        // الـ API يعيد المنتجات مرتبة، نأخذ أول 4 فقط
        if (Array.isArray(data)) {
            setNewArrivals(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  const bannerSettings = {
    dots: true, infinite: bannerImages.length > 1, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000, arrows: false, pauseOnHover: true,
    appendDots: dots => (<div style={{ position: "absolute", bottom: "10px", width: "100%" }}><ul style={{ margin: "0", padding: "0", display: "flex", justifyContent: "center", gap: "4px" }}> {dots} </ul></div>),
    customPaging: i => (<div className="w-2 h-2 bg-white/70 rounded-full hover:bg-white transition-all cursor-pointer shadow-sm"></div>)
  };

  return (
    <div className="pb-6 bg-gray-50 min-h-screen font-cairo md:pb-0">
      
      <style>{`
        .slick-slider { margin-bottom: 0 !important; }
        .slick-track { display: flex !important; }
        .slick-slide { height: auto !important; }
        .slick-slide div { display: block !important; line-height: 0; }
      `}</style>

      <div className="max-w-7xl mx-auto w-full">

        {/* 1. البانر العلوي (لم يتم تغييره) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 pt-4 md:px-8 md:pt-8 md:gap-6">
            <div className="md:col-span-4 lg:col-span-3">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden h-full flex flex-col justify-center items-start md:p-8 hover:shadow-md transition">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-50 rounded-full -translate-x-10 -translate-y-10 opacity-50"></div>
                    <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg"><Sparkles size={16} /></span>
                            <h1 className="text-xl font-bold text-gray-800">أناقتك، هويتك</h1>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 pl-4">تصاميم عصرية ولمسات تقليدية.</p>
                        <Link to="/shop" className="flex items-center justify-center w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-gray-200 hover:bg-gray-800 transition transform hover:-translate-y-0.5">
                            تصفح المتجر <ArrowRight size={16} className="mr-2" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
                {bannerImages.length > 0 ? (
                    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 relative group h-full">
                        <Slider {...bannerSettings}>
                            {bannerImages.map((img, index) => (
                                <div key={index} className="outline-none relative h-full">
                                    <div className="relative w-full h-40 md:h-[300px] lg:h-[320px] bg-gray-100">
                                        <img src={img} alt={`Banner ${index}`} className="w-full h-full object-cover block" />
                                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : <div className="rounded-2xl bg-gray-200 h-40 md:h-[300px] flex items-center justify-center text-gray-400">لا توجد صور</div>}
            </div>
        </div>

        {/* 2. الأقسام (لم يتم تغييره) */}
        <div className="px-4 mb-8 mt-8 md:px-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">تصفح الأقسام</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Link to="/shop" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 hover:border-blue-200 hover:shadow-md transition group h-full">
              <div className="bg-purple-50 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition md:shrink-0"><ShoppingBag size={24} className="md:w-6 md:h-6" /></div>
              <div className="text-center md:text-right"><span className="font-bold text-gray-700 text-sm md:text-base block">ملابس جاهزة</span><span className="hidden md:block text-xs text-gray-400 mt-1">تشكيلة واسعة</span></div>
            </Link>
            <Link to="/tailoring" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-3 hover:border-green-200 hover:shadow-md transition group h-full">
              <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition md:shrink-0"><Scissors size={24} className="md:w-6 md:h-6" /></div>
              <div className="text-center md:text-right"><span className="font-bold text-gray-700 text-sm md:text-base block">تفصيل وخياطة</span><span className="hidden md:block text-xs text-gray-400 mt-1">حسب مقاسك</span></div>
            </Link>
            
            <Link to="/fabrics" className="col-span-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between px-6 hover:border-indigo-200 hover:shadow-md transition group h-full">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="bg-indigo-50 p-2.5 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <SwatchBook size={24} className="md:w-6 md:h-6" />
                </div>
                <div className="text-center md:text-right"><span className="font-bold text-gray-800 text-sm md:text-base block">بازان و أقمشة فاخرة</span></div>
              </div>
              <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition md:w-5 md:h-5" />
            </Link>
          </div>
        </div>

        {/* 3. قسم وصل حديثاً (تم ربطه بالبيانات الحقيقية) */}
        <div className="px-4 md:px-8 mb-8">
          <div className="md:flex md:gap-6 md:items-stretch">
             
             {/* العمود 1: العنوان والمعلومات (ثابت) */}
             <div className="mb-4 md:mb-0 md:w-1/4 md:min-w-[250px] md:bg-white md:p-6 md:rounded-2xl md:border md:border-gray-100 md:shadow-sm md:flex md:flex-col md:justify-center">
                 <div className="flex justify-between items-center md:flex-col md:items-start md:gap-2">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        وصل حديثاً <span className="md:hidden">🔥</span>
                    </h2>
                    <p className="hidden md:block text-gray-500 text-sm leading-relaxed mb-4">
                        تصفح أحدث ما وصلنا من منتجات حصرية بجودة عالية.
                    </p>
                    <Link to="/shop" className="text-xs md:text-sm md:bg-blue-600 md:text-white md:px-8 md:py-3 md:rounded-xl md:font-bold md:w-auto md:self-start md:hover:bg-blue-700 transition flex items-center justify-center gap-1 text-gray-500 hover:text-blue-600">
                        <span className="md:hidden">عرض الكل</span>
                        <span className="hidden md:inline">مشاهدة الجميع</span>
                        <ArrowRight size={12} className="md:w-4 md:h-4" />
                    </Link>
                 </div>
             </div>

             {/* العمود 2: المنتجات الحقيقية */}
             <div className="md:flex-1 w-full min-w-0">
                 <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
                    {/* هنا نتحقق إذا كانت هناك منتجات، وإلا نعرض رسالة تحميل أو فراغ */}
                    {newArrivals.length > 0 ? (
                        newArrivals.map((product) => (
                            // استخدام Link لجعل البطاقة قابلة للنقر
                            <Link to={`/product/${product._id}`} key={product._id} className="min-w-[150px] md:min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition cursor-pointer block">
                                <div className="h-36 md:h-48 bg-gray-100 w-full relative">
                                    {/* عرض صورة المنتج الحقيقية */}
                                    {(product.images?.[0] || product.image)?.includes('http') ? (
                                        <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">لا صورة</div>
                                    )}
                                    
                                    <button className="hidden md:flex absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 hover:bg-blue-600 hover:text-white">
                                        <ShoppingBag size={16} />
                                    </button>
                                </div> 
                                <div className="p-3">
                                    <h3 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-blue-600 transition truncate">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-900 font-bold text-sm">{product.price} د.ج</p>
                                        <div className="flex items-center text-yellow-400 text-[10px] md:hidden"><Star size={10} fill="currentColor" /> 4.5</div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        // حالة التحميل أو عدم وجود منتجات (تحافظ على الشكل حتى لا ينهار التصميم)
                        <p className="text-gray-400 text-sm py-10 w-full text-center col-span-4">جاري تحميل المنتجات...</p>
                    )}
                 </div>
             </div>
          </div>
        </div>

      </div> 
      <Footer />
    </div>
  );
}