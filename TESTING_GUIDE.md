# ADPT Mark 6 - Quick Testing Guide

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
cd "C:\Users\amanr\Downloads\ADPT mark 6"
npm install
```

### 2. Configure Backend
Make sure your `.env` file exists in the root directory with:
```env
PORT=5000
OPENAI_API_KEY=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
CORS_ORIGIN=http://localhost:8080
```

### 3. Start the Application
```powershell
npm run dev:all
```

This starts both:
- Frontend: http://localhost:8080
- Backend: http://localhost:5000

---

## ✅ Testing Checklist

### Test 1: First-Time User Flow
**Goal:** Verify intro slides show only once

1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh page at http://localhost:8080
4. **Expected:** See intro slides
5. Click through all 4 slides
6. Click "Get Started" on final slide
7. **Expected:** Redirected to Login page
8. Fill in email and password (any values work)
9. Click "Log In"
10. **Expected:** Redirected to Onboarding Form
11. Fill in your name and course
12. Click "Complete Setup"
13. **Expected:** Redirected to Dashboard

✅ **Pass Criteria:** Smooth flow without errors

---

### Test 2: Returning User Flow
**Goal:** Verify intro skips for returning users

1. After completing Test 1, close browser
2. Reopen and go to http://localhost:8080
3. **Expected:** Dashboard loads directly (no intro, no login)

✅ **Pass Criteria:** Direct dashboard access

---

### Test 3: Light/Dark Mode
**Goal:** Verify theme switching works

1. On Dashboard, click "Settings" in sidebar
2. Find "Appearance" section
3. Toggle "Dark Mode" switch
4. **Expected:** Theme changes immediately to light mode
5. Toggle again
6. **Expected:** Back to dark mode
7. Refresh page
8. **Expected:** Theme persists

✅ **Pass Criteria:** Smooth transitions, persistence works

---

### Test 4: Mobile Responsive Sidebar
**Goal:** Verify mobile menu works

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or any mobile device
4. **Expected:** Sidebar hidden, hamburger menu visible (top-left)
5. Click hamburger menu
6. **Expected:** Sidebar slides in from left with backdrop
7. Click a navigation item
8. **Expected:** Sidebar closes, page navigates
9. Click outside sidebar (on backdrop)
10. **Expected:** Sidebar closes

✅ **Pass Criteria:** Smooth animations, touch-friendly

---

### Test 5: Schedule Generation (Past Exam Filter)
**Goal:** Verify past exams are excluded

1. Navigate to "Subjects" page
2. Add Subject 1:
   - Name: "Mathematics"
   - Difficulty: Hard
   - Exam Date: Pick a date 2 weeks from today
3. Add Subject 2:
   - Name: "History"
   - Difficulty: Medium
   - Exam Date: Pick a date from LAST WEEK (past date)
4. Add Subject 3:
   - Name: "Physics"
   - Difficulty: Easy
   - Exam Date: Pick a date 1 week from today
5. Click "Generate AI Study Schedule"
6. Navigate to "Schedule" page
7. **Expected:** Only Mathematics and Physics appear in schedule
8. **Expected:** History (past exam) is NOT in the schedule

✅ **Pass Criteria:** No sessions for past-exam subjects

---

### Test 6: Data Backup/Restore
**Goal:** Verify export/import works

1. After completing some tests (add subjects, set preferences)
2. Navigate to Settings
3. Find "Backup & Restore" section
4. Click "Export Data"
5. **Expected:** JSON file downloads (e.g., `adpt-backup-2025-01-25.json`)
6. Open browser console (F12)
7. Run: `localStorage.clear()`
8. Refresh page
9. **Expected:** Back to intro slides (fresh state)
10. Complete login and onboarding again
11. Go to Settings → Backup & Restore
12. Click "Import Data"
13. Select the downloaded JSON file
14. **Expected:** "Data imported successfully! Reloading..." message
15. Page reloads
16. **Expected:** All your subjects, preferences, and data are restored

✅ **Pass Criteria:** Full data export/import cycle works

---

### Test 7: API Status Check
**Goal:** Verify backend API key detection

1. Open http://localhost:5000/api/ai/status in browser
2. **Expected Response:**
```json
{
  "status": "ok",
  "hasApiKey": true,
  "message": "API key configured"
}
```

✅ **Pass Criteria:** API key is detected

---

### Test 8: XP & Progress Tracking
**Goal:** Verify dashboard stats update

1. On Dashboard, note your current XP
2. Navigate to Subjects
3. Add a new subject
4. Generate a schedule
5. Return to Dashboard
6. **Expected:** XP may have increased
7. Check "Today's Progress" bar
8. **Expected:** Stats display correctly

✅ **Pass Criteria:** Stats are persistent and update

---

### Test 9: Navigation & Routing
**Goal:** Verify all pages accessible

1. Test each sidebar link:
   - Dashboard → ✓
   - Schedule → ✓
   - AI Assistant → ✓
   - Subjects → ✓
   - Settings → ✓
2. Use browser back/forward buttons
3. **Expected:** Navigation works smoothly
4. Try accessing `/dashboard` directly in URL
5. **Expected:** Works without redirect loops

✅ **Pass Criteria:** All routes work correctly

---

### Test 10: Logout & Re-login
**Goal:** Verify logout works

1. Open browser console (F12)
2. Run: `localStorage.removeItem('adpt_logged_in')`
3. Refresh page
4. **Expected:** Redirected to Login page
5. Log in again
6. **Expected:** Back to Dashboard with all data intact

✅ **Pass Criteria:** Logout redirects properly, data persists

---

## 🎨 Visual Quality Checks

### Glassmorphism Effects
- [ ] Background blur visible on all panels
- [ ] Border glow on hover works
- [ ] Gradient overlays display correctly

### Animations
- [ ] Fade-in animations on page load
- [ ] Smooth transitions between themes
- [ ] Glow pulse effects on accent elements
- [ ] Sidebar slide animation on mobile

### Typography
- [ ] Gradient text on headings is visible
- [ ] Font sizes appropriate for all screen sizes
- [ ] Text remains readable on both themes

### Colors
- [ ] Primary cyan color: #06B6D4
- [ ] Secondary purple color: #A855F7
- [ ] Consistent color usage across all pages

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend not starting
```bash
Error: EADDRINUSE: address already in use :::5000
```
**Solution:** Port 5000 is in use. Kill the process:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Issue 2: Frontend not loading
```bash
Error: Cannot find module '@/components/...'
```
**Solution:** Restart dev server:
```powershell
npm run dev
```

### Issue 3: API key not working
```bash
Error: Missing API key
```
**Solution:** Check `.env` file:
1. Make sure it exists in project root
2. Verify `OPENAI_API_KEY` is set
3. Restart backend server

### Issue 4: Theme not changing
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors
3. Verify `ThemeProvider` is wrapping app

### Issue 5: Mobile sidebar not working
**Solution:**
1. Make sure window width < 768px
2. Check for JavaScript errors in console
3. Try hard refresh (Ctrl+Shift+R)

---

## 📊 Performance Benchmarks

Expected performance on modern hardware:

- **Initial Load:** < 2 seconds
- **Page Navigation:** < 500ms
- **Theme Switch:** Instant
- **Schedule Generation:** < 1 second
- **Data Export:** Instant
- **Data Import:** < 1 second

---

## 🔍 Browser DevTools Tips

### Check LocalStorage
```javascript
// View all ADPT data
Object.keys(localStorage).forEach(key => {
  if (key.includes('adpt') || ['subjects', 'studyPrefs', 'generatedSchedule'].includes(key)) {
    console.log(key, localStorage.getItem(key));
  }
});
```

### Force Dark Theme
```javascript
localStorage.setItem('adpt-theme', 'dark');
location.reload();
```

### Force Light Theme
```javascript
localStorage.setItem('adpt-theme', 'light');
location.reload();
```

### Reset All Data
```javascript
localStorage.clear();
location.reload();
```

---

## ✨ Success Indicators

Your app is working perfectly if:

1. ✅ First-time users see intro slides once
2. ✅ Returning users go straight to dashboard
3. ✅ Login persists across sessions
4. ✅ Theme switching works instantly
5. ✅ Mobile sidebar is touch-friendly
6. ✅ Past exam subjects excluded from schedule
7. ✅ Data export/import works flawlessly
8. ✅ All pages are responsive
9. ✅ No console errors
10. ✅ Smooth animations throughout

---

## 📝 Testing Report Template

After testing, fill out:

```
ADPT Mark 6 Testing Report
==========================

Date: __________
Tester: __________

Test 1 (First-Time Flow):      [ ] Pass [ ] Fail
Test 2 (Returning User):        [ ] Pass [ ] Fail
Test 3 (Theme Toggle):          [ ] Pass [ ] Fail
Test 4 (Mobile Sidebar):        [ ] Pass [ ] Fail
Test 5 (Schedule Logic):        [ ] Pass [ ] Fail
Test 6 (Data Backup):           [ ] Pass [ ] Fail
Test 7 (API Status):            [ ] Pass [ ] Fail
Test 8 (Progress Tracking):     [ ] Pass [ ] Fail
Test 9 (Navigation):            [ ] Pass [ ] Fail
Test 10 (Logout):               [ ] Pass [ ] Fail

Overall Status: [ ] All Pass [ ] Some Failures

Notes:
_______________________________________
_______________________________________
```

---

## 🎯 Ready for Production?

Before deploying to production, ensure:

- [ ] All 10 tests pass
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices (iOS & Android)
- [ ] API key is secure (not hardcoded)
- [ ] Environment variables properly configured
- [ ] No console errors or warnings
- [ ] Performance is acceptable
- [ ] UI is polished on all screen sizes

---

**Happy Testing! 🚀**
