# 🧠 ADPT Mark 6 — The Smarter Study Companion

> **ADPT (Adaptive Productivity Tracker)** is a smart, AI-assisted study companion designed to help students plan, track, and grow — all while staying completely offline.  
> Built with a blend of creativity, logic, and sleek design, **ADPT Mark 6** turns ordinary planning into an adaptive learning experience.

---

## 🚀 Overview

ADPT Mark 6 is your **personalized offline productivity assistant** that helps you:
- Generate logical, AI-based study schedules 🎯  
- Track progress, XP, and motivation levels 📈  
- Manage subjects, goals, and daily plans efficiently 🗓️  
- Switch between **light/dark themes** for comfort 🌙☀️  
- Experience smooth onboarding with **intro slides** (first time only) ✨  

Everything is stored **locally on your device** — no cloud, no login dependency, no data loss.  
Once the API key is added, the app seamlessly integrates AI features like **smart schedule generation** and **study suggestions**.

---

## 🧩 Key Features

### 🎬 Intro Slides (First Time Only)
- Elegant introductory slides appear only on the first launch.  
- Stored flag in `localStorage` ensures returning users skip the intro automatically.

### 🔐 Simple Login System
- Clean login page aligned with the app’s main theme.  
- Offline authentication — credentials stored locally, not on any remote server.  

### 📚 Subject Manager
- Add, edit, and manage subjects easily.  
- Generate a **custom study schedule** based on exam dates and time left.

### 🧠 AI-Powered Schedule Generator
- Uses OpenAI (via backend API) to create intelligent study plans.  
- Avoids illogical scheduling like revising subjects after the exam date.  
- Balances workload across upcoming days.

### 💾 Local Data Storage
- All progress, XP, subjects, and preferences are stored in **LocalStorage**.  
- Works entirely offline — fast and secure.  
- Optionally, allows data export/import for backup.

### 🧑‍💻 Backend Integration
- Express.js backend that binds AI logic and handles API key securely.  
- `.env` used for storing API keys.  
- Frontend communicates with backend via `/api/generate` endpoint.  

### 🎨 Theme System
- Full **Dark/Light mode toggle** in settings.  
- Automatically remembers user’s last theme preference.

### 📊 Dashboard
- Displays XP, goals, and quick performance stats.  
- Redirects correctly to the main dashboard (no longer loops back to intro slides).

### 📱 Fully Responsive
- Works on desktops, tablets, and Android browsers flawlessly.  
- Adaptive layouts ensure smooth interaction across all devices.


