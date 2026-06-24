# Civio - Premium Dark Civic Social Web App

A production-ready React 18 + TypeScript + Vite conversion of the Civio citizen reporting screens. Emphasizing hyperlocal discoverability, application resilience, accessibility, and decoupled architectures, this codebase is pre-engineered for seamless MongoDB Atlas + Express.js backend integrations.

---

## 🚀 Technology Stack

- **Core Framework:** React 18 & TypeScript
- **Bundler & Dev Server:** Vite
- **Styling:** Tailwind CSS (Strictly adhering to premium glassmorphism dark tokens in `DESIGN.md`)
- **Routing:** React Router DOM v6 (With Route-Level Code Splitting)
- **Server State Management:** TanStack Query v5 (React Query)
- **API Client:** Axios (Configured client with automatic JWT authorization headers interceptors)
- **Form Validation:** React Hook Form & Zod schemas resolver
- **Icons:** Google Material Symbols Outlined (with native fill transitions)

---

## 📁 Folder Structure

```
c:\Users\ACER\Downloads\antigravity civio\
├── public/                 # Static assets, map files, placeholders
├── src/
│   ├── components/         # Reusable design components
│   │   ├── BottomNavbar.tsx      # Sticky glass tab navigation
│   │   ├── ErrorBoundary.tsx     # Full React error boundary screen wrapper
│   │   ├── LanguageSwitcher.tsx  # Toggle EN | हिं | मर route translator
│   │   ├── PostCard.tsx          # Card with location labels, status badges, and comments drawer
│   │   ├── ProfileHeader.tsx     # Resident achievements header
│   │   ├── Skeletons.tsx         # Pulse loading layouts (post, profile, notifications, map)
│   │   ├── StoryCategory.tsx     # Active warning alerts story bubbles
│   │   └── SupportButton.tsx     # Amber-Orange pill button ("Support Issue")
│   ├── hooks/              # Custom TanStack Query hooks
│   │   ├── useNotifications.ts   # Notification inbox queries & read mutations
│   │   ├── usePosts.ts           # Post lists queries, comments, and post submission mutations
│   │   ├── useSupport.ts         # Support & upvote state toggling
│   │   └── useUser.ts            # User session management, profile updating
│   ├── pages/              # Lazy-loaded page layouts
│   │   ├── CreatePost.tsx        # Report form with GPS coordinates & uploader
│   │   ├── Feed.tsx              # English feed & live alerts
│   │   ├── HindiFeed.tsx         # Hindi feed & translated strings
│   │   ├── JoinCommunity.tsx     # Registration form (Google / Email Login only)
│   │   ├── NearbyIssues.tsx      # Local Map overlay and nearby issue grids
│   │   ├── Notifications.tsx     # Inbox notifications drawer
│   │   ├── Onboarding.tsx        # Swipeable carousel introduction
│   │   ├── Profile.tsx           # Achievement summaries & posts history tabs
│   │   └── Trending.tsx          # Sorted trending lists ( 🔥, 📈, 🏆 )
│   ├── services/           # Decoupled business logic ready for Axios replacement
│   │   ├── apiClient.ts          # Axios setup with auth header interceptors
│   │   ├── mockApi.ts            # LocalStorage emulated DB with 300ms network delay
│   │   ├── uploadService.ts      # Cloudinary-ready file upload mock
│   │   ├── authService.ts        # Mock JWT authorization session validation
│   │   ├── commentService.ts     # Post comment CRUD handlers
│   │   ├── postService.ts        # Post listings with Haversine geospatial filters
│   │   └── supportService.ts     # Upvoting and support scoring metrics
│   ├── App.tsx             # Routing & React Query Client initialization
│   ├── main.tsx            # DOM mounting
│   ├── types.ts            # Shared Mongoose-compatible TS interfaces
│   └── index.css           # Tailwind base styles and custom blur filters
├── tailwind.config.js      # Theme configurations (stat-lg, display-lg sizes)
├── tsconfig.json           # Compiler rules
└── vite.config.ts          # Server setups
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
The app will run on `http://localhost:3000` and automatically open in your default browser.

### 3. Build & Compile Checks
```bash
npm run build
```
Generates production-optimized chunks under `dist/` with absolute type safety.

---

## 🛠️ Architecture Details

### 1. MongoDB Atlas GeoJSON Point Compatibility
The `Post` model in `src/types.ts` is structured for native geospatial indexing:
- `location: { latitude: number, longitude: number }`: Used by front-end maps.
- `geoLocation: { type: "Point", coordinates: [longitude, latitude] }`: Matches the MongoDB GeoJSON schema. Ready for `$near` query operators and geospatial queries without schema changes.

### 2. Decoupled Service Layer
All data accesses pass through `src/services/` modules, which consume `src/services/mockApi.ts`. To replace the local database mock with your Express API backend:
1. Open `src/services/apiClient.ts` to confirm base configurations and interceptors are correct.
2. Swap out `mockApi.ts` endpoints inside `postService.ts`, `commentService.ts`, `supportService.ts`, and `authService.ts` to use `apiClient.get()`, `apiClient.post()`, etc.

### 3. Community Impact Score Metrics
User engagement scores update automatically in local state upon interactions:
- **`+10` points:** Reporting an issue (`CreatePost.tsx`).
- **`+2` points:** Supporting an issue (`PostCard.tsx` click "Support Issue").
- **`+25` points:** Mark an issue as "Resolved" (Select Resolved status from a PostCard's more options menu).

### 4. Accessibility & Keyboard Navigation
- **Semantics:** Landmark tags (`<main>`, `<header>`, `<nav>`, `<article>`) isolate layout scopes.
- **Icon Buttons:** Focus outlines (`focus-visible:ring-2`) and descriptive `aria-labels` added to interactive tags.
- **Drawer Controls:** Listeners bound to `Escape` key close popup dialog drawers automatically.

---

## 📈 Backend Integration Roadmap

When preparing to write the Express + MongoDB Atlas + Cloudinary backend:

1. **MongoDB Atlas Schemas:**
   - Create a `Post` Schema with a index `geoLocation: "2dsphere"`.
   - Set up `User` Schema storing `impactScore`, `issuesReported`, and `issuesSupported`.

2. **Cloudinary Integration:**
   - Inside `uploadService.ts`, replace `URL.createObjectURL(file)` with a request sending a `FormData` object to your Express backend upload endpoint:
     ```ts
     const formData = new FormData();
     formData.append('image', file);
     const res = await apiClient.post('/upload', formData, {
       headers: { 'Content-Type': 'multipart/form-data' }
     });
     return res.data.secure_url;
     ```

3. **TanStack Query Refactors:**
   - Because components fetch data using the custom hooks in `src/hooks/`, no modifications are required in UI files when transitioning to your live backend. Simply edit the functions in `/services` and let React Query handle the caching, loaders, and refetches automatically.
