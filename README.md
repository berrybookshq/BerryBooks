# BerryBooks 📚

A premium, conversion-focused D2C platform for creating high-end travel photobooks. Built with **Next.js 16**, **Tailwind CSS v4**, **Supabase**, and **Cloudinary**.

## 🚀 Features

- **High-End UI/UX**: Minimalist, dark-themed interface inspired by modern tech platforms (Linear-inspired).
- **Streamlined Order Flow**: 4-step conversion-focused checkout (Product Selection -> Photo Upload -> Delivery Details -> Order Summary).
- **Interactive Product Previews**: Real-time 4-image sliders for A4 and A5 formats.
- **Advanced Coupon System**: Supports percentage-based and flat discounts with book-type restrictions.
- **Cloud curation**: Integrated with Cloudinary for seamless photo uploads and automatic ZIP generation for designers.
- **WhatsApp Integration**: Direct lead generation and support via official WhatsApp API.
- **Admin Dashboard**: Secure management of orders, coupons, and customer leads.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Database/Auth**: Supabase
- **Media Hosting**: Cloudinary
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/your-username/berrybooks.git
cd berrybooks
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and add the following keys (see `.env.example` for reference):

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

### 3. Run Development
```bash
npm run dev
```

## 🔒 Environment Variables
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key (Server-side only) |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret (Server-side only) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Unsigned Upload Preset |

## 📄 License
All rights reserved by BerryBooks.
