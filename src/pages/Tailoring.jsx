// src/pages/Tailoring.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Info, MessageCircle, Loader, ShoppingCart, AlertCircle, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Tailoring() {
  const [selectedType, setSelectedType] = useState(null);
  const [tailoringTypes, setTailoringTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sliderRef = useRef(null);
  const [measurements, setMeasurements] = useState({});
  const [modalImage, setModalImage] = useState(null); 
  const { whatsappNumber } = useSettings();
  const { addToCart } = useCart();

  const measurementFields = [
    { id: 'abayaLength', label: 'طول العباءة', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684541/WhatsApp_Image_2026-02-09_at_4.43.56_PM_tcl8iq.jpg' },
    { id: 'shoulderWidth', label: 'عرض الكتف', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684895/WhatsApp_Image_2026-02-09_at_4.51.20_PM_p8dcvm.jpg' },
    { id: 'sleeveLength', label: 'طول اليد', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684896/WhatsApp_Image_2026-02-09_at_4.51.20_PM_1_xcmb3v.jpg' },
    { id: 'bellyWidth', label: 'عرض البطن', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684895/WhatsApp_Image_2026-02-09_at_4.51.20_PM_2_wrksmb.jpg' },
    { id: 'pantsLength', label: 'طول السروال', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684895/WhatsApp_Image_2026-02-09_at_4.51.20_PM_3_fodzs1.jpg' },
    { id: 'neckCirc', label: 'دورة الرقبة', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684894/WhatsApp_Image_2026-02-09_at_4.51.21_PM_1_nylw0y.jpg' },
    { id: 'wristCirc', label: 'دورة اليد', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684895/WhatsApp_Image_2026-02-09_at_4.51.20_PM_4_r2hgse.jpg' },
    { id: 'thighCirc', label: 'دورة الفخذ', image: 'https://res.cloudinary.com/dzjo2sbfd/image/upload/v1770684895/WhatsApp_Image_2026-02-09_at_4.51.21_PM_rsiz8p.jpg' },
  ];

  useEffect(() => {
    const fetchTailoring = async () => {
      try {
        const response = await fetch('https://dz-shop-api.onrender.com/api/products');
        const data = await response.json();
        setTailoringTypes(data.filter(p => p.category === "تفصيل وخياطة"));
        setLoading(false);
      } catch (error) { setLoading(false); }
    };
    fetchTailoring();
  }, []);

  const sliderSettings = {
    dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, arrows: false, swipe: true,
    beforeChange: (current, next) => setActiveImageIndex(next),
    appendDots: dots => <ul style={{ margin: "0px", padding: "0px", display: "flex", justifyContent: "center", gap: "5px" }}> {dots} </ul>,
    customPaging: i => (<div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}></div>),
  };

  const handleInputChange = (id, value) => setMeasurements(prev => ({ ...prev, [id]: value }));

  const getWhatsAppMessage = () => {
    let msg = `استفسار بخصوص تفصيل: ${selectedType.name}\n--- المقاسات ---\n`;
    measurementFields.forEach(field => { if (measurements[field.id]) msg += `${field.label}: ${measurements[field.id]} سم\n`; });
    return encodeURIComponent(msg);
  };

  const handleAddToCart = () => {
    const measurementsText = measurementFields.map(f => measurements[f.id] ? `${f.label}: ${measurements[f.id]}` : '').filter(Boolean).join(' - ');
    const productWithMeasurements = { ...selectedType, _id: selectedType._id + '-custom-' + Date.now(), category: 'تفصيل وخياطة', image: selectedType.images?.[0] || selectedType.image, images: selectedType.images || [selectedType.image], measurements: measurementsText };
    addToCart(productWithMeasurements);
    alert('تمت إضافة طلب التفصيل للسلة!');
    goBack();
  };

  const goBack = () => { setSelectedType(null); setMeasurements({}); setActiveImageIndex(0); };

  if (loading) return <div className="h-screen flex justify-center items-center text-blue-600"><Loader className="animate-spin" /></div>;

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 md:pb-12 max-w-7xl mx-auto">
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setModalImage(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalImage(null)} className="absolute top-2 right-2 bg-gray-100 p-2 rounded-full hover:bg-red-100 hover:text-red-500 transition z-10"><X size={20} /></button>
            {/* 👇 تعديل صورة المودال 👇 */}
            <div className="p-2 bg-gray-100">
                <img 
                    src={modalImage} 
                    className="w-full h-auto rounded-xl" 
                    alt="توضيح المقاس" 
                    loading="lazy" 
                    decoding="async"
                />
            </div>
            <p className="text-center py-4 font-bold text-gray-700 bg-white">صورة توضيحية لطريقة القياس</p>
          </div>
        </div>
      )}

      {!selectedType ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6 md:text-3xl md:mb-8">تفصيل وخياطة</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {tailoringTypes.length > 0 ? tailoringTypes.map((type) => (
              <button key={type._id} onClick={() => setSelectedType(type)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:border-blue-500 hover:shadow-md transition group">
                <div className={`w-full h-32 md:h-48 rounded-lg bg-gray-100 overflow-hidden mb-2`}>
                   {(type.images?.[0] || type.image)?.includes('http') ? 
                     // 👇 تعديل صورة القائمة الرئيسية 👇
                     <img 
                        src={type.images?.[0] || type.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                        alt={type.name} 
                        loading="lazy" 
                        decoding="async"
                     /> 
                     : <div className={`w-full h-full ${type.image}`}></div>
                   }
                </div>
                <span className="font-bold text-gray-700 md:text-lg">{type.name}</span>
                <span className="text-xs md:text-sm text-blue-600">{type.price} د.ج</span>
              </button>
            )) : <p className="col-span-2 text-center text-gray-400">لا توجد خيارات متاحة حالياً</p>}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4 md:mb-8">
            <button onClick={goBack} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 shadow-sm transition"><ArrowRight size={20} /></button>
            <h2 className="text-xl font-bold text-gray-800 md:text-3xl">{selectedType.name}</h2>
          </div>

          <div className="flex flex-col md:flex-row md:gap-12 md:items-start">
              
              {/* يمين الكمبيوتر: معرض الصور */}
              <div className="w-full md:w-1/3 mb-6 md:mb-0 md:sticky md:top-24">
                  <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="rounded-xl overflow-hidden relative">
                        <Slider {...sliderSettings} ref={sliderRef}>
                            {(selectedType.images && selectedType.images.length > 0 ? selectedType.images : [selectedType.image]).map((img, idx) => (
                                <div key={idx} className="outline-none">
                                    <div className="w-full h-72 md:h-[400px] bg-gray-50 flex items-center justify-center">
                                        {img?.includes('http') ? 
                                            // 👇 تعديل صور السلايدر 👇
                                            <img 
                                                src={img} 
                                                className="w-full h-full object-contain" 
                                                alt="تفصيل" 
                                                loading="lazy" 
                                                decoding="async"
                                            /> 
                                            : <div className={`w-full h-full ${img}`}></div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className="hidden md:flex bg-red-50 border border-red-200 rounded-xl p-4 mt-6 gap-3 items-start shadow-sm">
                    <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
                    <p className="text-sm text-red-800 leading-relaxed font-bold">تنبيه هام: الزبون يتحمل المسؤولية كاملة في حال تقديم قياسات خاطئة.</p>
                </div>
              </div>

              {/* يسار الكمبيوتر: نموذج القياسات */}
              <div className="w-full md:flex-1">
                  <div className="md:hidden bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex gap-3 items-start shadow-sm">
                    <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
                    <p className="text-sm text-red-800 leading-relaxed font-bold">تنبيه هام: الزبون يتحمل المسؤولية كاملة في حال تقديم قياسات خاطئة.</p>
                  </div>

                  <form className="space-y-4 mb-8">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 md:text-xl">
                        أدخل المقاسات (بالسنتمتر)
                        <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">اضغط (!) للمساعدة</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {measurementFields.map((field) => (
                            <div key={field.id} className="relative flex items-center gap-2">
                                <div className="flex-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                                    <label className="block text-xs font-bold text-gray-400 px-3 pt-2">{field.label}</label>
                                    <input type="number" placeholder="0" className="w-full bg-transparent border-none px-3 py-1 text-gray-800 font-bold focus:ring-0" value={measurements[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
                                </div>
                                <button type="button" onClick={() => setModalImage(field.image)} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100 flex-shrink-0"><AlertCircle size={24} /></button>
                            </div>
                        ))}
                    </div>
                  </form>

                  <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                      <button type="button" onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 md:text-lg">
                        <ShoppingCart size={20} /> إضافة للطلب
                      </button>
                      <button type="button" onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`, '_blank')} className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-2 md:text-lg">
                        <MessageCircle size={20} /> استفسار واتساب
                      </button>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}