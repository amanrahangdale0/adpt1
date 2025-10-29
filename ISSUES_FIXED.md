# Setup Changes - How We Got the App Running

This document explains all the changes made to get ADPT Mark 6 running successfully. Perfect for beginners! 🚀

---

## 🔧 Problems We Fixed

### Problem 1: Wrong API Endpoint (Invalid API Key Error)

**What happened?**
The app was showing "Invalid API Key" errors even though we had a valid OpenRouter API key.

**Why did this happen?**
The code was configured to call OpenAI's API (`https://api.openai.com`), but we were using an OpenRouter API key (starts with `sk-or-v1-`). These are two different services with different API endpoints.

**What we changed:**
- Updated all API calls to use OpenRouter's endpoint instead of OpenAI's
- Changed the model format from `gpt-4o-mini` to `openai/gpt-4o-mini` (OpenRouter requires the provider prefix)
- Added required OpenRouter headers (`HTTP-Referer` and `X-Title`)

**Files changed:**
- `server/controllers/aiController.js` - Updated 3 functions
- `server/controllers/goalsController.js` - Updated API endpoint
- `server/controllers/scheduleController.js` - Updated API endpoint
- `server/server.js` - Updated legacy endpoint

**Before:**
```javascript
fetch("https://api.openai.com/v1/chat/completions", {
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages
  })
})
```

**After:**
```javascript
fetch("https://openrouter.ai/api/v1/chat/completions", {
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5001",
    "X-Title": "ADPT Study Planner",
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages
  })
})
```

---

### Problem 2: Wrong Server File Being Used

**What happened?**
The package.json was pointing to `server/server.js`, but there was a better file available.

**Why did this happen?**
The project had two server files:
- `server/server.js` - Incomplete version (only had `/api/ai` routes)
- `server/index.js` - Complete version (had all routes: `/api/ai`, `/api/goals`, `/api/schedule`)

**What we changed:**
- Updated `package.json` to use `server/index.js` instead of `server/server.js`

**Files changed:**
- `package.json` - Changed `"main": "server/server.js"` to `"main": "server/index.js"`
- `package.json` - Changed `"server": "node server/server.js"` to `"server": "node server/index.js"`

---

### Problem 3: Hardcoded API URLs

**What happened?**
API URLs were hardcoded throughout the app, making it difficult to change environments.

**Why this was a problem:**
- Hard to switch between development and production
- Port changes required updating multiple files
- Not following best practices for configuration

**What we changed:**
- Added `VITE_API_URL` environment variable support
- All API calls now read from environment variables with sensible defaults

**Files changed:**
- `.env` - Added `VITE_API_URL=http://localhost:5001`
- `.env.local` - Created with `VITE_API_URL=http://localhost:5001`
- `src/lib/apiConfig.ts` - Now reads `VITE_API_URL` from environment
- `src/pages/AIAssistant.tsx` - Uses `API_URL` constant from environment

**Before:**
```javascript
fetch("http://localhost:5000/api/ai/chat", { ... })
```

**After:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
fetch(`${API_URL}/api/ai/chat`, { ... })
```

---

## 🎯 Quick Troubleshooting

### "Port already in use" error

**Check what's using the port:**
```bash
# macOS/Linux
lsof -i :5001

# Windows PowerShell
netstat -ano | findstr :5001
```

**Solution:** Change `PORT` in `.env` to a different port (e.g., 5002)

### "Cannot connect to backend" error

**Check:**
1. Is the backend server running? Look for "🚀 Server runningg on port 5001"
2. Is `VITE_API_URL` in your `.env` file correct?
3. Are you using the right port?

### "Invalid API Key" error

**Check:**
1. Is your API key in `.env` file correct?
2. Does your API key start with `sk-or-v1-`? (OpenRouter) or `sk-`? (OpenAI)
3. If using OpenRouter, make sure the code points to `openrouter.ai/api/v1`

### Build errors with SWC

If you see "Failed to load native binding" errors:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📝 Summary of Key Files

| File | Purpose | What Changed |
|------|---------|--------------|
| `.env` | Backend configuration | Port and API key |
| `.env.local` | Frontend configuration | API URL |
| `package.json` | Project scripts | Server entry point |
| `server/index.js` | Main backend server | Now being used |
| `server/controllers/*.js` | API handlers | OpenRouter endpoints |
| `src/lib/apiConfig.ts` | API configuration | Environment variable support |
| `src/pages/AIAssistant.tsx` | AI chat page | Dynamic API URL |

---

## 🎓 What You Learned

1. **API Providers:** OpenAI and OpenRouter have different endpoints and formats
2. **Environment Variables:** Using `.env` files for configuration instead of hardcoding
3. **Project Structure:** Understanding which files are entry points
4. **Debugging:** How to check what's using a port and trace API errors

---

## 🚀 You're All Set!

The app should now be running smoothly. If you encounter any issues, check the troubleshooting section above or review the specific file changes documented here.

Happy studying! 📚✨
