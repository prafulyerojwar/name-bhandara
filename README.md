# 🪔 Nam Bhandara — भंडारा | Food for All

> **अन्नदान महादान** — Food donation is the greatest charity

A full-stack web app connecting **Bhandara organizers** (festival, temple, wedding) with **NGOs** and **people in need** across Maharashtra.

## ✨ Features

### 👤 Three User Roles
| Role | Who | Can Do |
|------|-----|--------|
| **General User** | Anyone | View public Bhandaras on the live map |
| **Food Donor** | Mandal, Temple, Wedding host | Post food with location, type, quantity & time |
| **NGO / Social Org** | Registered NGOs | View all food (public + private), book & track collection |

### 🗺️ Live Map (Maharashtra)
- All active Bhandaras shown as interactive markers
- Festival 🐘, Temple 🛕, Wedding 💒, Private 🏠 type icons
- Real-time countdown timers
- City-level filter (30 Maharashtra cities)
- Click marker → popup with food details

### 🍛 Bhandara Types
- **Festival Bhandara** — Ganesh Chaturthi, Navratri, Diwali, etc.
- **Temple Prasadam** — Shirdi Sai, Vitthal Mandir, etc.
- **Wedding / Event** — Reception, ceremony leftover food
- **Private** — Any private food distribution

### 🔒 Smart Visibility
- **Public** — Visible on map to all users (general Bhandaras)
- **NGO-only** — Wedding/private food visible only to registered NGOs

### 🤝 Booking System
- NGO sees available food → clicks **Book Now**
- Food marked as booked (others can't book)
- NGO navigates to location → clicks **Mark Collected**
- NGO can **Cancel** to release for other NGOs

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Maps | Leaflet + OpenStreetMap |
| State | Zustand |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Deployment | Vercel |

## 🛠️ Setup

### 1. Clone & Install
```bash
git clone https://github.com/prafulyerojwar/name-bhandara.git
cd name-bhandara
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password + Google
4. Enable **Firestore Database** → Start in test mode
5. Copy config values

### 3. Google Maps API (Optional — uses OpenStreetMap by default)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable **Maps JavaScript API**
3. Create credentials → API Key

### 4. Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

### 5. Firestore Indexes
Create these composite indexes in Firestore:
- `bhandaras`: `isPublic ASC, status ASC, createdAt DESC`
- `bhandaras`: `isPublic ASC, status ASC, city ASC, createdAt DESC`
- `bhandaras`: `donorId ASC, createdAt DESC`
- `bookings`: `ngoId ASC, createdAt DESC`

### 6. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, stats, how-it-works, featured bhandaras |
| `/map` | Live map with all bhandaras + side panel |
| `/auth/login` | Login (email or Google) |
| `/auth/register` | 2-step registration with role selection |
| `/post-bhandara` | 3-step form to post food (Donors only) |
| `/dashboard` | NGO food finder / Donor post manager |
| `/profile` | Edit profile, change city |

## 🗺️ Pilot: Maharashtra

Currently live for 30 cities including:
Mumbai • Pune • Nagpur • Nashik • Aurangabad • Solapur • Kolhapur • Thane • Shirdi • Pandharpur • Nashik • Ahmednagar • Sangli • Satara • and more...

**Expanding pan-India soon!**

## 🙏 Festivals Supported
Ganesh Chaturthi • Navratri • Diwali • Ram Navami • Hanuman Jayanti • Durga Puja • Gudi Padwa • Makar Sankranti • Krishna Janmashtami • Mahashivratri • Temple Prasadam • Weekly/Monthly Bhandara

---

Made with ❤️ for Maharashtra | *अन्नदान महादान*
