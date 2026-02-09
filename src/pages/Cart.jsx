// src/pages/Cart.jsx
import { useState } from 'react';
import { Trash2, MapPin, Phone, User, FileText, CheckCircle, ShoppingBag, Loader, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  // استخدام الأسماء الصحيحة من الكود القديم
  const { cartItems, removeFromCart, clearCart, cartTotal, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    city: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      customerName: formData.customerName,
      phone: formData.phone,
      city: formData.city,
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || item.image || '',
        category: item.category,
        measurements: item.measurements || ''
      })),
      totalAmount: cartTotal,
      notes: formData.notes
    };

    try {
      const response = await fetch('https://dz-shop-api.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert('تم إرسال طلبك بنجاح! سنتصل بك قريباً.');
        clearCart();
        navigate('/');
      } else {
        alert('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('فشل الاتصال بالسيرفر.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // حالة السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-gray-500 font-cairo">
        <div className="bg-white p-6 rounded-full shadow-sm mb-4"><ShoppingBag size={64} className="text-gray-300" /></div>
        <p className="text-lg font-bold mb-4">سلتك فارغة حالياً</p>
        <Link to="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    // md:pb-12: مسافة سفلية للكمبيوتر
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50 md:pb-12 max-w-7xl mx-auto font-cairo">
      
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition"><ArrowRight size={20} /></button>
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">سلة المشتريات ({cartItems.length})</h1>
      </div>

      {/* تخطيط الصفحة: فليكس للهاتف، شبكة للكمبيوتر (Split View) */}
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-8 md:items-start">
        
        {/* القسم الأيمن: قائمة المنتجات */}
        <div className="space-y-4 md:col-span-2">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 md:p-6 md:gap-6 items-start">
               {/* الصورة */}
               <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 md:w-32 md:h-32">
                 {(item.images?.[0] || item.image)?.includes('http') ? (
                   <img src={item.images?.[0] || item.image} className="w-full h-full object-cover" alt={item.name} />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">لا صورة</div>
                 )}
               </div>
               
               {/* التفاصيل */}
               <div className="flex-1 flex flex-col justify-between h-full min-h-[80px] md:min-h-[128px]">
                 <div>
                    <h3 className="font-bold text-gray-800 text-sm md:text-xl">{item.name}</h3>
                    <p className="text-blue-600 font-bold text-sm md:text-lg mt-1">{item.price} د.ج</p>
                    {item.category === 'تفصيل وخياطة' && <span className="inline-block mt-1 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full md:text-xs">تفصيل خاص</span>}
                 </div>

                 <div className="flex justify-between items-end mt-2">
                    {/* أزرار الكمية (إذا كانت متوفرة في الكونتكست، وإلا نعرض الكمية فقط) */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                       {updateQuantity && <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 md:w-9 md:h-9"><Minus size={14} /></button>}
                       <span className="font-bold text-sm w-4 text-center md:text-base">{item.quantity}</span>
                       {updateQuantity && <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 md:w-9 md:h-9"><Plus size={14} /></button>}
                    </div>
                    
                    <button onClick={() => removeFromCart(item._id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* القسم الأيسر: النموذج والدفع (مثبت في الكمبيوتر) */}
        <div className="mt-6 md:mt-0 md:col-span-1 md:sticky md:top-8 space-y-4">
            
            {/* تنبيه العربون */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-800 text-sm mb-1 flex items-center gap-2">تنبيه هام حول الدفع</h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  ملاحظة العربون: (لتاكيد الطلبية يرجى دفع عربون، جميع الطلبيات بصفة اخرى لا تؤخذ بعين الاعتبار).
                </p>
            </div>

            {/* صندوق النموذج */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:p-8">
                <h3 className="font-bold text-lg text-gray-800 mb-4 md:text-xl">معلومات التوصيل</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute top-3 right-3 text-gray-400 md:top-4" size={20} />
                        <input name="customerName" required value={formData.customerName} onChange={handleChange} type="text" placeholder="الاسم الكامل" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-blue-500 transition md:py-4" />
                    </div>
                    <div className="relative">
                        <Phone className="absolute top-3 right-3 text-gray-400 md:top-4" size={20} />
                        <input name="phone" required value={formData.phone} onChange={handleChange} type="tel" placeholder="رقم الهاتف" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-blue-500 transition md:py-4" />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute top-3 right-3 text-gray-400 md:top-4" size={20} />
                        <input name="city" required value={formData.city} onChange={handleChange} type="text" placeholder="الولاية / المدينة" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-blue-500 transition md:py-4" />
                    </div>
                    <div className="relative">
                        <FileText className="absolute top-3 right-3 text-gray-400 md:top-4" size={20} />
                        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="ملاحظات إضافية..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 h-24 focus:outline-none focus:border-blue-500 transition resize-none"></textarea>
                    </div>

                    <div className="border-t border-gray-100 mt-4 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 font-bold md:text-lg">المجموع الكلي</span>
                            <span className="text-xl font-bold text-blue-600 md:text-2xl">{cartTotal} د.ج</span>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={`w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition md:text-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {isSubmitting ? <Loader className="animate-spin" /> : <CheckCircle size={20} />}
                            {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                        </button>
                    </div>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
}