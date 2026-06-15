# Engagement Invitation Website

قالب دعوة خطوبة HTML / CSS / JS جاهز للتعديل.

## طريقة التشغيل
افتح ملف `index.html` في المتصفح.

## أهم التعديلات
افتح ملف `script.js` وعدّل الجزء ده:

```js
const INVITATION = {
  brideName: "Sara",
  groomName: "Mohamed",
  eventDateISO: "2026-06-20T19:00:00+03:00",
  eventDateText: "20 يونيو 2026",
  eventTimeText: "07:00 مساءً",
  venue: "اكتب اسم القاعة هنا",
  address: "اكتب العنوان التفصيلي هنا",
  mapLink: "https://maps.google.com/?q=Egypt",
  whatsappNumber: "201000000000"
};
```

## الصور والفيديوهات
ضع ملفاتك داخل مجلد `assets` بهذه الأسماء:

- photo1.jpg
- photo2.jpg
- photo3.jpg
- photo4.jpg
- video1.mp4
- video2.mp4
- video3.mp4
- music.mp3

## ملاحظات
- زر RSVP يفتح واتساب برسالة جاهزة.
- زر Calendar ينزل ملف .ics للحفظ في التقويم.
- معرض الصور يفتح Lightbox.
- الموقع Responsive للموبايل.
