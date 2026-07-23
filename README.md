# 🧠 MindHealth

> **AI-powered mental wellness platform for early detection, meaningful support, and lifelong emotional growth.**

MindHealth (awalnya bernama Happify) adalah aplikasi *mental wellness* bergaya modern (Gen-Z friendly) yang dirancang khusus untuk memonitor, mendengarkan, dan membantu meningkatkan kesehatan mental para penggunanya. Dibangun dalam waktu singkat untuk keperluan Hackathon, aplikasi ini mengombinasikan antarmuka yang dinamis dengan kecerdasan buatan (Google Gemini) untuk memberikan dukungan emosional 24/7.

---

## ✨ Fitur Utama

- 📊 **Interactive Dashboard & Mood Tracking:** Lacak perasaanmu setiap hari. Sistem otomatis menganalisis *mood* kamu selama seminggu terakhir dan memberikan *insight* unik.
- 🤖 **AI Chatbot Companion:** Teman curhat AI yang suportif, empatik, dan pengertian (di-tenagai oleh model **Gemini 2.5 Flash**). Memiliki memori sesi untuk percakapan yang mengalir natural.
- 📝 **Smart Journaling + AI Summary:** Tuliskan keluh kesahmu, simpan ke database, dan biarkan AI merangkum kondisi mentalmu sekaligus memberikan saran positif (didukung oleh *Speech-to-Text*).
- 🧘‍♀️ **Interactive Wellness Activities:** Jangan cuma *mockup*! Rasakan animasi interaktif pemandu pernapasan (*Mindful Breathing*), panduan *Stretching*, hingga mode malam (*Sleep Hygiene*).
- 👩‍⚕️ **Professional Help Booking:** Akses cepat ke profesional (*Psikolog*) dengan simulasi fitur pemesanan jadwal yang modern.
- 🎤 **Speech-to-Text (Aksesibilitas):** Malas mengetik? Cukup tekan tombol mikrofon di menu Chat atau Journal, dan berbicaralah. (Memanfaatkan native *Web Speech API*).

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React 19
- **Styling & Animasi:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database:** [Supabase](https://supabase.com/) (Menyimpan riwayat Jurnal & Mood secara real-time)
- **AI Integration:** [Google Gemini AI](https://deepmind.google/technologies/gemini/) (`@google/genai`)
- **Icons & Typography:** Lucide React, Google Fonts

---

## 🚀 Cara Menjalankan di Lokal (Local Setup)

Untuk menjalankan proyek ini di komputermu sendiri, ikuti langkah-langkah berikut:

### 1. Clone Repository
```bash
git clone https://github.com/junikxz/indonesia_next1.git
cd indonesia_next1
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file bernama `.env.local` di *root folder* proyek, lalu salin struktur dari `.env.example` dan masukkan kunci rahasiamu:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup (Supabase)
Jalankan perintah SQL berikut di **SQL Editor** Supabase-mu untuk membuat tabel riwayat data:
```sql
CREATE TABLE IF NOT EXISTS public.history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    description TEXT NOT NULL
);

-- Matikan RLS untuk kemudahan prototipe Hackathon (atau buat policy)
ALTER TABLE public.history DISABLE ROW LEVEL SECURITY;
```

### 5. Jalankan Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser (sangat disarankan menggunakan **Google Chrome** agar fitur *Speech-to-Text* berjalan lancar).

---
*Dibuat dengan ❤️ untuk Hackathon Mental Health.*
