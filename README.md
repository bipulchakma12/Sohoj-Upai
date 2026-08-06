# 🚨 সহজ উপায় (Sohoj Upai) — Hyper-Local Emergency Home Service Platform

**সহজ উপায় (Sohoj Upai)** হলো একটি রিয়েল-টাইম হাইপার-লোকাল জরুরি সার্ভিস প্ল্যাটফর্ম (ইলেকট্রিক, প্লাম্বিং, এসি মেকানিক)। ৩০ মিনিটের মধ্যে আপনার এলাকায় অভিজ্ঞ টেকনিশিয়ান বুকিং দেওয়ার উদ্দেশ্যে অ্যাপটি ডিজাইন করা হয়েছে।

---

## 🛠️ টেক স্ট্যাক (Tech Stack)

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn UI, Lucide React
- **State & Data Fetching**: TanStack React Query v5, React Hook Form, Zod
- **Backend & Database**: Next.js API Routes (Route Handlers), MongoDB Atlas, Mongoose (ODM)
- **Real-Time Communication**: Socket.io & Socket.io-Client (with Web Audio synthesized alert)
- **Image Storage**: Cloudinary (with Next.js image domain optimization)
- **Auth & Security**: JWT (`jsonwebtoken`) & NextAuth.js

---

## 🚀 লোকাল সেটআপ নির্দেশিকা (Local Setup Instructions)

### ১. প্রজেক্ট ক্লোন ও ডিপেন্ডেন্সি ইনস্টল:
```bash
cd "Sohoj Upai"
npm install
```

### ২. এনভায়রনমেন্ট কনফিগারেশন (`.env.local`):
প্রজেক্টের রুট ডিরেক্টরিতে `.env.local` ফাইল তৈরি করুন (বা `.env.example` থেকে কপি করুন) এবং আপনার ক্রেডেনশিয়াল দিন:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ooorkki.mongodb.net/sohoj-upai?retryWrites=true&w=majority

# Auth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMS Gateway Configuration
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=your_sms_sender_id

# Public Client Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### ৩. ডাটাবেজ সীড (Seed Dummy Technicians):
লোকালে টেস্টিং এর জন্য ডাটাবেজে উত্তরা, ধানমন্ডি, গুলশান এলাকার ডামি কারিগর ইনসার্ট করতে চালান:
```bash
npm run seed
```

### ৪. লোকাল সার্ভার রান করা:
```bash
npm run dev
```
ব্রাউজারে **http://localhost:3000** এ প্রবেশ করুন।

---

## 🌐 Vercel-এ ডিপ্লয়মেন্ট গাইড (Deployment Steps on Vercel)

1. আপনার কোড **GitHub / GitLab** রিপোজিটরিতে পুষ্প (Push) করুন।
2. [Vercel Dashboard](https://vercel.com) এ লগইন করে **"Add New Project"** সিলেক্ট করুন।
3. আপনার `Sohoj Upai` রিপোজিটরিটি ইম্পোর্ট করুন।
4. **Environment Variables** সেকশনে `.env.local` এর সব ভ্যারিয়েবল (`MONGODB_URI`, `NEXTAUTH_SECRET`, `JWT_SECRET`, `CLOUDINARY_*` ইত্যাদি) যুক্ত করুন।
5. **Deploy** বাটনে চাপুন। Vercel অটোমেটিক Next.js App Router অ্যাপটি বিল্ড ও হোস্ট করে দেবে।

---

## 📑 API Endpoints Reference

- **POST** `/api/auth/register-or-login` — OTP রেজিস্ট্রেশন ও JWT টোকেন জেনারেটর
- **GET / POST** `/api/bookings` — কাস্টমার বুকিং লিস্ট ও নতুন বুকিং ইনসার্ট (`SOS-1001` format)
- **GET** `/api/bookings/[id]` — একক বুকিং ট্র্যাকিং ডিটেইলস
- **PATCH** `/api/bookings/[id]/assign` — টেকনিশিয়ান অ্যাসাইনমেন্ট
- **PATCH** `/api/bookings/[id]/status` — স্ট্যাটাস আপডেট (`on_the_way`, `completed`, `cancelled`)
- **GET / POST** `/api/technicians` — এলাকাভিত্তিক টেকনিশিয়ান ফিল্টারিং ও অনবোর্ডিং
- **PATCH** `/api/technicians/[id]` — কারিগর অনলাইন/অফলাইনAvailability টগল
- **POST** `/api/upload` — Cloudinary ফটো আপলোড
