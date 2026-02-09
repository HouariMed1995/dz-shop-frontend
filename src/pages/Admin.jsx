// src/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { Phone, Clock, Trash2, Edit, Plus, Save, Upload, Loader, X, LogOut, RefreshCw, Eye, Check, Image as ImageIcon, Globe } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );
  
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); 
  const [orderFilter, setOrderFilter] = useState('ملابس جاهزة');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  // 1. جلب socialLinks من السياق
  const { whatsappNumber, bannerImages, socialLinks, updateSettings } = useSettings();
  
  const [newPhone, setNewPhone] = useState('');
  const [newBannerImages, setNewBannerImages] = useState([]);

  // 2. حالات محلية للروابط الجديدة
  const [newFacebook, setNewFacebook] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newTiktok, setNewTiktok] = useState('');

  const initialProductState = { name: '', price: '', images: [], description: '', mainSection: 'ملابس جاهزة', subCategory: 'ملابس' };
  const [productForm, setProductForm] = useState(initialProductState);
  const [isEditing, setIsEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const mainSections = ["ملابس جاهزة", "تفصيل وخياطة", "أقمشة بازان"];
  const subCategories = ["ملابس", "عبايات رجالية", "نعل وأحذية طبية", "جوارب", "شاش", "ساعات يد", "نظارات", "عطور", "ماكينات حلاقة", "ملابس داخلية"];

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();   
      fetchProducts(); 
      setNewPhone(whatsappNumber || '');
      setNewBannerImages(bannerImages || []);
      
      // 3. تعبئة حقول الروابط عند التحميل
      setNewFacebook(socialLinks?.facebook || '');
      setNewInstagram(socialLinks?.instagram || '');
      setNewTiktok(socialLinks?.tiktok || '');

      const interval = setInterval(() => { fetchOrders(); }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, whatsappNumber, bannerImages, socialLinks]);

  const handleLogin = () => {
    if (password === '0665165410abd@') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else { alert('كلمة المرور خاطئة!'); }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    window.location.reload();
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://dz-shop-api.onrender.com/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) { console.error(err); }
  };
  
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://dz-shop-api.onrender.com/api/products');
      setProducts(await res.json());
    } catch (err) { console.error(err); }
  };

  const getOrderType = (order) => {
    if (!order.items || order.items.length === 0) return "غير محدد";
    const category = order.items[0].category;
    if (category === "تفصيل وخياطة") return "تفصيل وخياطة";
    if (category === "أقمشة بازان") return "أقمشة بازان";
    return "ملابس جاهزة"; 
  };

  const markAsRead = async (id) => {
    try {
        await fetch(`https://dz-shop-api.onrender.com/api/orders/${id}/read`, { method: 'PUT' });
        setOrders(orders.map(o => o._id === id ? { ...o, isRead: true } : o));
    } catch (err) { console.error(err); }
  };

  const getUnreadCount = (filterType) => {
    return orders.filter(o => 
        !o.isRead && 
        (filterType === 'الكل' || getOrderType(o) === filterType)
    ).length;
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    try {
        await fetch(`https://dz-shop-api.onrender.com/api/orders/${id}`, { method: 'DELETE' });
        setOrders(orders.filter(o => o._id !== id)); 
        alert("تم حذف الطلب");
    } catch (err) { alert("حدث خطأ أثناء الحذف"); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await fetch(`https://dz-shop-api.onrender.com/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) { alert("فشل الحذف"); }
  };

  const uploadFileHandler = async (e, mode = 'product') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.append('images', files[i]); }
    
    setUploading(true);
    try {
      const res = await fetch('https://dz-shop-api.onrender.com/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const imageUrls = await res.json();
        
        if (mode === 'product') {
            setProductForm((prev) => ({ ...prev, images: [...prev.images, ...imageUrls] }));
        } else if (mode === 'banner') {
            setNewBannerImages((prev) => [...prev, ...imageUrls]);
        }
        setUploading(false);
      } else { alert('فشل رفع الصور'); setUploading(false); }
    } catch (error) { console.error(error); setUploading(false); alert('حدث خطأ'); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return alert("انتظر التحميل");
    const finalCategory = productForm.mainSection === 'ملابس جاهزة' ? productForm.subCategory : productForm.mainSection;
    const payload = { ...productForm, category: finalCategory, image: productForm.images[0] || '' };
    const url = isEditing ? `https://dz-shop-api.onrender.com/api/products/${isEditing}` : 'https://dz-shop-api.onrender.com/api/products';
    const method = isEditing ? 'PUT' : 'POST';
    try {
      await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      alert(isEditing ? "تم التعديل" : "تمت الإضافة");
      setProductForm(initialProductState); setIsEditing(null); fetchProducts();
    } catch (err) { alert("حدث خطأ"); }
  };

  const startEdit = (product) => {
    const isSub = subCategories.includes(product.category);
    setProductForm({
      name: product.name, price: product.price,
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      description: product.description || '', mainSection: isSub ? 'ملابس جاهزة' : product.category,
      subCategory: isSub ? product.category : subCategories[0]
    });
    setIsEditing(product._id); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSettings = async () => {
    // 4. إرسال الروابط الجديدة مع دالة التحديث
    const success = await updateSettings(
      newPhone, 
      newBannerImages,
      { facebook: newFacebook, instagram: newInstagram, tiktok: newTiktok }
    );
    if (success) alert("تم حفظ الإعدادات بنجاح! ✅");
    else alert("حدث خطأ أثناء الحفظ ❌");
  };

  if (!isAuthenticated) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4 font-cairo">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم 🔒</h1>
        <input type="password" placeholder="كلمة المرور" className="w-full border p-3 rounded-lg mb-4 focus:outline-blue-500" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">دخول</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 p-4 md:p-8 font-cairo" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">لوحة الإدارة</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition font-bold text-sm"><LogOut size={18} /> خروج</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm overflow-x-auto md:justify-center md:gap-4 md:p-3">
            <button onClick={() => setActiveTab('orders')} className={`flex-1 md:flex-none md:w-40 py-3 px-4 whitespace-nowrap rounded-lg font-bold transition relative ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            📦 الطلبات
            {getUnreadCount('الكل') > 0 && <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{getUnreadCount('الكل')}</span>}
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex-1 md:flex-none md:w-40 py-3 px-4 whitespace-nowrap rounded-lg font-bold transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>👕 المنتجات</button>
            <button onClick={() => setActiveTab('settings')} className={`flex-1 md:flex-none md:w-40 py-3 px-4 whitespace-nowrap rounded-lg font-bold transition ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>⚙️ الإعدادات</button>
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
            <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 overflow-x-auto pt-4 pb-2 hide-scrollbar w-full md:justify-center md:flex-wrap">
                    {["الكل", "ملابس جاهزة", "تفصيل وخياطة", "أقمشة بازان"].map(filter => (
                    <button 
                        key={filter} 
                        onClick={() => setOrderFilter(filter)} 
                        className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-bold border whitespace-nowrap ${orderFilter === filter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                    >
                        {filter}
                        {getUnreadCount(filter) > 0 && (
                            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                                {getUnreadCount(filter)}
                            </span>
                        )}
                    </button>
                    ))}
                </div>
                <button onClick={fetchOrders} className="bg-gray-100 p-2 rounded-full text-gray-600 mr-2 hover:bg-gray-200 hover:rotate-180 transition duration-500 mt-2"><RefreshCw size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {orders
                .filter(order => {
                    if (orderFilter === 'الكل') return true;
                    return getOrderType(order) === orderFilter;
                })
                .map((order) => (
                <div key={order._id} className={`rounded-xl shadow-sm border overflow-hidden relative transition-all duration-300 h-full flex flex-col ${!order.isRead ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-200'}`}>
                    
                    <button onClick={() => deleteOrder(order._id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600 bg-white p-1 rounded-full shadow-sm z-10"><Trash2 size={18} /></button>
                    
                    {!order.isRead && (
                        <button onClick={() => markAsRead(order._id)} className="absolute top-4 left-14 bg-blue-600 text-white p-1 rounded-full shadow-sm z-10 hover:bg-blue-700 flex items-center gap-1 px-3">
                            <Eye size={16} /> <span className="text-xs">جديد</span>
                        </button>
                    )}
                    {order.isRead && <div className="absolute top-4 left-14 text-gray-300 z-10"><Check size={20} /></div>}

                    <div className={`p-4 ${!order.isRead ? 'bg-blue-100/50' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-start pr-8">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                                <span className="text-gray-500 text-xs font-normal ml-1 block">الزبون:</span>
                                {order.customerName}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1"><Clock size={12} />{new Date(order.createdAt).toLocaleDateString('ar-EG')}</div>
                        </div>
                        <span className="bg-white text-blue-600 text-[10px] px-2 py-1 rounded-full border border-blue-100 font-bold whitespace-nowrap">{getOrderType(order)}</span>
                        </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 text-gray-600 text-sm bg-gray-50 w-fit px-3 py-1 rounded-full"><Phone size={14} />{order.phone}</div>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-4 flex-1">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                            <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                                {item.image && item.image.includes('http') ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">لا صورة</div>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-bold text-gray-800">{item.name} <span className="text-gray-400 text-xs font-normal">x{item.quantity}</span></span>
                                    <span className="font-bold text-blue-600">{item.price} د.ج</span>
                                </div>
                                {item.measurements && (
                                    <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100 mt-1">
                                        <span className="font-bold block mb-1">📏 المقاسات:</span>{item.measurements}
                                    </div>
                                )}
                            </div>
                            </div>
                        ))}
                        </div>
                        
                        {order.notes && <div className="mt-3 text-xs text-gray-500 bg-gray-100 p-2 rounded border border-gray-200"><span className="font-bold text-gray-700">ملاحظات:</span> {order.notes}</div>}

                        <div className="mt-3 pt-3 border-t flex justify-between items-center font-bold text-blue-600">
                        <span>الإجمالي</span>
                        <span>{order.totalAmount} د.ج</span>
                        </div>
                    </div>
                </div>
                ))}
                {orders.length === 0 && <p className="col-span-full text-center text-gray-400 py-10">لا توجد طلبات</p>}
            </div>
            </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 max-w-4xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">{isEditing ? <Edit size={20} /> : <Plus size={20} />} {isEditing ? 'تعديل منتج' : 'إضافة منتج'}</h2>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="الاسم" required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
                    <input type="number" placeholder="السعر" required className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                </div>
                <textarea placeholder="وصف المنتج (اختياري)" className="w-full border p-3 rounded-lg bg-gray-50 h-24 resize-none focus:bg-white transition outline-none" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})}></textarea>
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">القسم الرئيسي</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                    {mainSections.map((section) => (
                        <button type="button" key={section} onClick={() => setProductForm({...productForm, mainSection: section})} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${productForm.mainSection === section ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>{section}</button>
                    ))}
                    </div>
                </div>
                {productForm.mainSection === 'ملابس جاهزة' && (
                    <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-gray-600 mb-2">نوع الملابس</label>
                    <select className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition outline-none" value={productForm.subCategory} onChange={(e) => setProductForm({...productForm, subCategory: e.target.value})}>{subCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
                    </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {productForm.images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X size={12} /></button>
                        </div>
                    ))}
                    </div>
                    <label className="cursor-pointer flex flex-col items-center justify-center py-4 text-gray-500 hover:text-blue-600 transition">
                    {uploading ? <Loader className="animate-spin mb-2" /> : <Upload size={32} className="mb-2" />}
                    <span className="text-sm font-bold">{uploading ? 'جاري رفع الصور...' : 'اضغط لإضافة صور'}</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadFileHandler(e, 'product')} />
                    </label>
                </div>
                <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={uploading} className={`flex-1 text-white py-3 rounded-xl font-bold transition ${uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>{isEditing ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
                    {isEditing && <button type="button" onClick={() => { setIsEditing(null); setProductForm(initialProductState); }} className="px-4 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300">إلغاء</button>}
                </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {products.map((product) => (
                <div key={product._id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">{(product.images?.[0] || product.image)?.includes('http') ? <img src={product.images?.[0] || product.image} className="w-full h-full object-cover"/> : <span className="text-xs">صورة</span>}</div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-800 truncate">{product.name}</h4>
                        <span className="text-xs text-blue-600 font-bold">{product.price} د.ج</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEdit(product)} className="p-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit size={16} /></button>
                        <button onClick={() => deleteProduct(product._id)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-12 md:items-start">
            
                {/* 1. التواصل (Whatsapp + Social) */}
                <div className="md:border-l md:border-gray-100 md:pl-12 space-y-8">
                    
                    {/* Whatsapp */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Phone size={20} className="text-green-600" /> إعدادات الواتساب
                        </h2>
                        <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-600">رقم واتساب المحل</label>
                        <input type="text" className="w-full border p-4 rounded-xl bg-gray-50 text-lg tracking-wider text-left focus:outline-none focus:bg-white transition" dir="ltr" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Social Media Links */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Globe size={20} className="text-purple-600" /> روابط التواصل الاجتماعي
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">رابط Facebook</label>
                                <input type="text" dir="ltr" placeholder="https://facebook.com/..." className="w-full border p-3 rounded-xl bg-gray-50 text-left focus:outline-none focus:bg-white transition text-sm" value={newFacebook} onChange={(e) => setNewFacebook(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">رابط Instagram</label>
                                <input type="text" dir="ltr" placeholder="https://instagram.com/..." className="w-full border p-3 rounded-xl bg-gray-50 text-left focus:outline-none focus:bg-white transition text-sm" value={newInstagram} onChange={(e) => setNewInstagram(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">رابط TikTok</label>
                                <input type="text" dir="ltr" placeholder="https://tiktok.com/..." className="w-full border p-3 rounded-xl bg-gray-50 text-left focus:outline-none focus:bg-white transition text-sm" value={newTiktok} onChange={(e) => setNewTiktok(e.target.value)} />
                            </div>
                        </div>
                    </div>

                </div>

                <hr className="border-gray-100 md:hidden" />

                {/* 2. Banner Settings */}
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-blue-600" /> البانر الإعلاني (الصفحة الرئيسية)
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                    {newBannerImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 h-24">
                        <img src={img} alt="Banner" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => {
                            const updatedImages = newBannerImages.filter((_, i) => i !== idx);
                            setNewBannerImages(updatedImages);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md opacity-90 hover:opacity-100 transition"
                        >
                            <X size={14} />
                        </button>
                        </div>
                    ))}
                    </div>

                    {newBannerImages.length < 5 ? (
                    <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition bg-gray-50">
                        {uploading ? <Loader className="animate-spin mb-2" /> : <Upload size={24} className="mb-2" />}
                        <span className="text-sm font-bold">
                        {uploading ? 'جاري الرفع...' : `اضغط لإضافة صورة (${newBannerImages.length}/5)`}
                        </span>
                        <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                        onChange={(e) => uploadFileHandler(e, 'banner')} 
                        />
                    </label>
                    ) : (
                    <p className="text-xs text-red-500 font-bold text-center bg-red-50 p-2 rounded-lg">تم الوصول للحد الأقصى (5 صور)</p>
                    )}
                </div>

                {/* Save Button (Full Width on Desktop) */}
                <div className="md:col-span-2 pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleSaveSettings} 
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-200"
                    >
                        <Save size={20} /> حفظ جميع التغييرات
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}