// دوال مساعدة لدعم الاتجاه من اليمين لليسار (RTL)

/**
 * تحويل التاريخ إلى صيغة عربية
 */
export const formatDateArabic = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory'
  }).format(dateObj);
};

/**
 * تحويل الأرقام إلى أرقام عربية
 */
export const formatNumberArabic = (number: number): string => {
  return new Intl.NumberFormat('ar-SA').format(number);
};

/**
 * تحويل العملة إلى صيغة عربية (ريال سعودي)
 */
export const formatCurrencyArabic = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount);
};

/**
 * تحويل النسبة المئوية إلى صيغة عربية
 */
export const formatPercentageArabic = (percentage: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(percentage / 100);
};

/**
 * ترجمة أيام الأسبوع إلى العربية
 */
export const getArabicDayName = (dayIndex: number): string => {
  const days = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];
  return days[dayIndex] || '';
};

/**
 * ترجمة الشهور إلى العربية
 */
export const getArabicMonthName = (monthIndex: number): string => {
  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
  ];
  return months[monthIndex] || '';
};

/**
 * تحويل النص الإنجليزي للحالة إلى عربي
 */
export const translateStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    // حالات العقود
    'active': 'نشط',
    'expired': 'منتهي',
    'pending': 'معلق',
    'cancelled': 'ملغي',

    // حالات الدفع
    'paid': 'مدفوع',
    'overdue': 'متأخر',

    // حالات الصيانة
    'new': 'جديد',
    'in_progress': 'قيد الصيانة',
    'completed': 'مكتمل',
    'postponed': 'مؤجل',

    // الأولوية
    'urgent': 'عاجل',
    'medium': 'متوسط',
    'low': 'منخفض',

    // حالات الوحدات
    'available': 'متاح',
    'occupied': 'مؤجر',
    'maintenance': 'تحت الصيانة'
  };

  return statusMap[status.toLowerCase()] || status;
};

/**
 * إضافة فئة CSS للاتجاه RTL
 */
export const getRTLClassName = (baseClass: string): string => {
  return `${baseClass} rtl`;
};

/**
 * تحديد ما إذا كان النص يحتوي على أحرف عربية
 */
export const isArabicText = (text: string): boolean => {
  const arabicRegex = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
  return arabicRegex.test(text);
};

/**
 * تقصير النص مع إضافة نقاط
 */
export const truncateArabicText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * تحويل الوقت إلى صيغة عربية
 */
export const formatTimeArabic = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(dateObj);
};

/**
 * تحويل التاريخ والوقت معاً إلى صيغة عربية
 */
export const formatDateTimeArabic = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    calendar: 'gregory'
  }).format(dateObj);
};