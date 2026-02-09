// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SettingsProvider } from './context/SettingsContext'
import ReactGA from "react-ga4"; // استيراد المكتبة

// تفعيل الإحصائيات بكودك الخاص
ReactGA.initialize("G-FE1ZSP8RF5");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </SettingsProvider>
  </React.StrictMode>,
)