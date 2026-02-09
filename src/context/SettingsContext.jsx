// src/context/SettingsContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bannerImages, setBannerImages] = useState([]);
  // 1. إضافة حالة روابط التواصل الاجتماعي
  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', tiktok: '' });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('https://dz-shop-api.onrender.com/api/settings');
      const data = await res.json();
      if (data) {
        setWhatsappNumber(data.whatsappNumber || '');
        setBannerImages(data.bannerImages || []);
        // 2. تخزين الروابط القادمة من السيرفر
        setSocialLinks({
            facebook: data.facebookUrl || '',
            instagram: data.instagramUrl || '',
            tiktok: data.tiktokUrl || ''
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // دالة تحديث شاملة (تقبل الرقم، الصور، والروابط)
  const updateSettings = async (newNumber, newImages, newSocialLinks) => {
    try {
      const payload = {};
      if (newNumber !== undefined) payload.whatsappNumber = newNumber;
      if (newImages !== undefined) payload.bannerImages = newImages;
      
      // 3. تجهيز الروابط للإرسال إذا تم تعديلها
      if (newSocialLinks) {
        payload.facebookUrl = newSocialLinks.facebook;
        payload.instagramUrl = newSocialLinks.instagram;
        payload.tiktokUrl = newSocialLinks.tiktok;
      }

      const res = await fetch('https://dz-shop-api.onrender.com/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const data = await res.json();
        setWhatsappNumber(data.whatsappNumber);
        setBannerImages(data.bannerImages);
        // تحديث الحالة المحلية بالبيانات الجديدة
        setSocialLinks({
            facebook: data.facebookUrl || '',
            instagram: data.instagramUrl || '',
            tiktok: data.tiktokUrl || ''
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    // تمرير socialLinks مع القيم
    <SettingsContext.Provider value={{ whatsappNumber, bannerImages, socialLinks, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);