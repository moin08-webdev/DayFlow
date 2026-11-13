# DayFlow ⚡

> **A native mobile daily planner with smart timetables, task tracking, day-wise habits, and a personal expense tracker.**  
> Built with **React Native + Expo SDK 58 (TypeScript)**, **Expo Router**, **Reanimated 4**, **SVG charts**, and a modular offline **AsyncStorage** architecture.

---

## 📱 Features

1. **Daily Timetable with Auto-Reset Check-Ins**
   - Add scheduled blocks with start time, end time, and notes (e.g., `06:30 AM - 07:15 AM Morning Yoga`).
   - Interactive pop-animated checkmarks to log steps completed today.
   - **Automatic Daily Reset**: When a new day arrives, checkmarks automatically reset to clean status while keeping your schedule intact.
   - **3D Progress Ring**: Real-time SVG circular progress indicator showing `"X of Y steps done today"` with completion percentages and celebration banners.

2. **Remaining Tasks (Outside Timetable)**
   - Priority tagging: **High** (Rose), **Medium** (Amber), and **Low** (Emerald) with color-coded badges.
   - Due date tracking with quick presets (*Today*, *Tomorrow*, *Next Week*).
   - Category tags (*Work*, *Personal*, *Study*, *Health*, *Finance*, *Home*).
   - Tasks automatically move to an expandable **"Completed"** section with bulk clear support.

3. **Day-Specific Routine (Mon–Sun)**
   - Mon–Sun horizontal selector with current day automatically highlighted and selected by default.
   - Dedicated habits and focus blocks customized per day of the week.
   - **Copy Routine Feature**: Copy any day's routine to other days in one tap (e.g., copy Monday to all weekdays).

4. **Money Tracker (Expenses in ₹)**
   - Log expenses with amount in **₹ (INR)**, category (*Food*, *Travel*, *Study*, *Shopping*, *Other*), notes, and date.
   - **Summary Cards**: Quick 3D cards for **Today's**, **This Week's**, and **This Month's** totals.
   - **SVG Donut Chart**: Proportional category spending visualization with percentage breakdowns.
   - History with edit and delete capabilities.

5. **Premium 3D Mobile Design & Animations**
   - **3D Header**: Hardware-accelerated floating layered shapes and ambient luminous gradients.
   - **Tactile Cards**: Layered cards with depth, top border highlights, soft shadows, and press-scale spring animations.
   - **Light & Dark Mode**: Instant toggle button in header, persistent across launches in local storage, and defaults to your system settings.

6. **Clean Architecture**
   - Storage logic is isolated in `services/storage/` with typed interfaces ready for any remote database (Supabase, Firebase, SQLite, PostgreSQL).

---

## 🚀 Running on Your Phone (Expo Go)

### Prerequisites
1. Install the **Expo Go** app on your phone:
   - [Expo Go for Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Expo Go for iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
2. Ensure your computer and phone are connected to the same Wi-Fi network.

### Start the App
Run Metro dev server:
```bash
npx expo start
```
*Tip: If your phone is on mobile data or a separate Wi-Fi, run with tunnel:*
```bash
npx expo start --tunnel
```

### Connect
- **Android**: Open the **Expo Go** app and tap **"Scan QR code"**, then scan the QR code in your terminal.
- **iOS**: Open the native **Camera** app, point it at the QR code, and tap the Expo notification.

---

## 📦 Building an Installable APK File (EAS Build)

You can build a standalone `.apk` file that installs directly on any Android phone without needing Expo Go or Android Studio.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```
*(Or use `npx eas-cli` without global install)*

### Step 2: Log in to your Expo Account
```bash
npx eas-cli login
```
*(If you don't have an Expo account yet, register for free at [expo.dev/signup](https://expo.dev/signup))*

### Step 3: Verify `eas.json`
`eas.json` is already configured in this repository with APK output:
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Step 4: Run the APK Build
Run:
```bash
npx eas-cli build -p android --profile preview
```

### Step 5: Install on Phone
1. EAS will build the `.apk` in the cloud (takes ~5-10 minutes).
2. When finished, EAS prints a **download link** and a **QR code**.
3. Scan the QR code or open the link on your Android phone to download `DayFlow.apk`.
4. Tap the downloaded file to install DayFlow on your phone!

---

## 🗂️ Project Structure

```text
To-Do_App/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Bottom tab navigation (Today, Tasks, Routine, Money)
│   │   ├── index.tsx        # Timetable with check-ins & progress ring
│   │   ├── tasks.tsx        # Tasks outside timetable & priorities
│   │   ├── routine.tsx      # Day-specific routine (Mon-Sun) & copy tool
│   │   └── money.tsx        # Expense tracker with ₹ totals & SVG chart
│   ├── _layout.tsx          # Root theme provider & gesture handler
│   └── modal.tsx            # Settings & theme selector
├── components/
│   ├── Header3D.tsx         # Layered animated shapes & theme toggle
│   ├── PressableCard3D.tsx  # Tactile spring-animated card with depth
│   ├── ProgressRing.tsx     # Animated SVG circular progress ring
│   ├── CheckmarkPop.tsx     # Pop-animated checkmark with haptics
│   ├── CategoryChart.tsx    # SVG Donut spending chart & legends
│   ├── TimetableStepItem.tsx
│   ├── TaskItem.tsx
│   ├── RoutineItemCard.tsx
│   ├── ExpenseItemCard.tsx
│   ├── AddTimetableModal.tsx
│   ├── AddTaskModal.tsx
│   ├── AddRoutineModal.tsx
│   ├── CopyRoutineModal.tsx
│   └── AddExpenseModal.tsx
├── constants/
│   ├── theme.ts             # Light & dark palette, shadows, borders
│   └── types.ts             # TypeScript definitions
├── hooks/
│   └── useThemeContext.tsx  # Persistent light/dark/system theme hook
├── services/
│   └── storage/
│       ├── asyncStorageClient.ts # Storage wrapper
│       ├── timetableService.ts   # Auto-reset logic & steps
│       ├── taskService.ts        # Task CRUD & completions
│       ├── routineService.ts     # Weekday routines & copy logic
│       ├── expenseService.ts     # ₹ expenses & calculations
│       └── settingsService.ts   # Theme preferences
├── utils/
│   └── dateUtils.ts         # Formatting & date calculations
├── app.json                 # Expo app configuration (com.dayflow.app)
└── eas.json                 # EAS build configuration for Android APK
```
