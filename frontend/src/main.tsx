import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// تعيين الاتجاه RTL للصفحة
document.dir = 'rtl';
document.documentElement.lang = 'ar';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div dir="rtl" className="rtl">
      <App />
    </div>
  </React.StrictMode>,
)