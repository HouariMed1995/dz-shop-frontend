// src/components/Footer.jsx
import { Facebook, Instagram, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  // جلبنا socialLinks من السياق لنستخدم الروابط المخزنة
  const { whatsappNumber, socialLinks } = useSettings();

  return (
    <footer className="bg-white border-t border-gray-100 pb-4 pt-8 mt-8 pb-24 md:pb-32 font-cairo">
      
      <div className="container mx-auto px-6 text-center md:flex md:flex-row-reverse md:items-start md:justify-between md:gap-12 md:text-right">
        
        {/* قسم الخريطة */}
        <div className="mb-8 md:mb-0 md:flex-1">
          <div className="flex items-center justify-center gap-2 mb-3 text-gray-500 md:justify-end">
            <span className="text-sm font-bold">موقعنا في تمنراست</span>
            <MapPin size={16} className="text-blue-600" />
          </div>
          
          <div className="relative w-full h-40 md:h-64 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d308.3196680271887!2d5.526828725311299!3d22.79195404476927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12206f0014a2386d%3A0xdf03381803687007!2sG-One%20Getzner!5e1!3m2!1sen!2sdz!4v1770298879535!5m2!1sen!2sdz" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        {/* قسم الأيقونات والحقوق */}
        <div className="md:flex-1 md:flex md:flex-col md:justify-center md:h-64">
          
          <div className="flex justify-center gap-6 mb-6 md:justify-end">
            
            {/* فيسبوك ديناميكي */}
            <a href={socialLinks?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="group">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Facebook size={20} />
              </div>
            </a>

            {/* انستغرام ديناميكي */}
            <a href={socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="group">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-full group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Instagram size={20} />
              </div>
            </a>

            {/* تيك توك ديناميكي */}
            <a href={socialLinks?.tiktok || "#"} target="_blank" rel="noopener noreferrer" className="group">
              <div className="p-3 bg-gray-100 text-gray-800 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </div>
            </a>

            {/* واتساب ديناميكي */}
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="group">
              <div className="p-3 bg-green-50 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Phone size={20} />
              </div>
            </a>
          </div>

          <div className="text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </div>

        </div>

      </div>
    </footer>
  );
}