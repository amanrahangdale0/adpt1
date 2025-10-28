# 🚀 ADPT Mark 6 - Quick Start Guide

## ⚡ Get Started in 3 Minutes

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Environment
Create a `.env` file in the root directory:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

> **Get your API key:** https://platform.openai.com/api-keys

### 3️⃣ Start the App
```bash
npm run dev:all
```

This starts both:
- ✅ Backend server on http://localhost:5000
- ✅ Frontend app on http://localhost:8080

---

## 📱 Using the Application

### First Time Setup
1. Open http://localhost:8080
2. Complete the onboarding slides
3. Fill in your details (name, course, study preferences)
4. You're ready to go! 🎉

### Main Features

#### 📊 Dashboard
- View your XP, study streaks, and daily goals
- Track your progress

#### 🤖 AI Assistant
- **Chat**: Ask study-related questions
- **Upload Notes**: Upload .txt/.pdf files for AI summarization
- **Generate Goals**: AI creates personalized study goals from your notes
- **Sync Schedule**: Convert goals into a timed study schedule
- **Export Calendar**: Download .ics file for Google Calendar/Outlook
- **Reminders**: Enable browser notifications for study sessions

#### 📅 Schedule
- View AI-generated study schedule
- Export to calendar
- Set up reminders

#### 📚 Subjects
- Add your subjects
- Set difficulty levels
- Track exam dates
- Configure study preferences (hours/day, time preferences)

#### ⚙️ Settings
- Manage your profile
- Adjust preferences
- API key configuration (optional)

---

## 🎯 Example Workflow

### Quick Path (Recommended)
1. **Complete Onboarding** → Enter your name, course, and study hours
2. **Add Subjects** → Go to Subjects page, add courses with difficulty & exam dates
3. **Set Preferences** → Choose study type, time, and hours per day
4. **Generate Schedule** → Click "Generate AI Study Schedule" button ✨
5. **View Schedule** → Automatically redirected to see your 7-day plan
6. **Export & Track** → Download .ics, enable reminders, earn XP!

### Advanced Path (With AI Assistant)
1. **Upload Notes** → Go to AI Assistant, upload your study notes
2. **Generate Goals** → AI creates study goals from your notes
3. **Chat with AI** → Ask questions and get study help
4. **Create Schedule** → Sync goals to schedule for timed sessions

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change the port in .env
PORT=5001
```

### No AI Responses
- Check your OpenAI API key in `.env`
- Verify you have API credits
- Check browser console for errors

### Notifications Not Working
- Grant notification permission when prompted
- Check browser notification settings
- Ensure you're using HTTPS (or localhost)

---

## 📦 Build for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to your hosting service
```

---

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css` - Look for CSS variables:
```css
--primary: 6 182 212;  /* Cyan */
--secondary: 139 92 246;  /* Purple */
```

### Modify AI Prompts
Edit prompts in:
- `src/pages/AIAssistant.tsx`
- `server/controllers/aiController.js`

---

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run dev:all` | Start both (recommended) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## ✅ All Fixed!

✅ 0 TypeScript errors
✅ 0 Build errors  
✅ All dependencies installed
✅ All imports working
✅ Backend endpoints ready
✅ Frontend pages rendering

**Status: PRODUCTION READY** 🎉

---

## 💡 Pro Tips

1. **Offline Mode**: All your data is stored locally - works without internet!
2. **Dark Mode**: Automatically adapts to your system theme
3. **Keyboard Shortcuts**: Press Enter in chat to send messages
4. **Export Everything**: Download schedules as .ics files
5. **Study Timer**: Use the built-in timer for Pomodoro technique

---

## 🆘 Need Help?

- Check `FIXES_SUMMARY.md` for detailed technical info
- Review `README.md` for full documentation
- Check browser console for errors
- Verify `.env` file is properly configured

---

**Happy Studying! 📚✨**
