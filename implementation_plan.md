# Memory Vault — Full Feature Implementation Plan

## Background

The existing codebase has:
- **Backend**: Express + Prisma + Supabase (PostgreSQL), layered architecture (controllers/services/routes), auth flow (OTP-based registration + login), nodemailer email, JWT auth
- **Frontend**: React + Vite + TypeScript + Tailwind CSS 3.4, framer-motion, lucide-react, react-router-dom. Pages: Home (landing), Login, Register, Dashboard (static mockup with Sidebar)
- **Color theme**: Vintage/warm palette — `#e8ded2` (bg), `#8b3a3a` (accent/CTA), `#fdfaf6` (paper), serif typography

This plan adds all requested features while preserving the existing theme and architecture.

---

## User Review Required

> [!IMPORTANT]
> **Deezer API for Song Search**: We'll use the Deezer API (free, no API key required for search) to search songs and play 30-second previews. This avoids API key management. If you want full song playback, you'd need Spotify OAuth (much more complex). Is the Deezer 30-second preview approach acceptable?

> [!IMPORTANT]
> **Cloudinary Configuration**: Your `.env` already has Cloudinary credentials (`dr5mbaqyd`). We'll use these. Make sure the Cloudinary account is active and has sufficient storage.

> [!WARNING]
> **SMTP Configuration**: Your `.env` still has placeholder SMTP credentials (`your_email@gmail.com`). The forgot password flow requires working SMTP. Please update these before testing.

> [!IMPORTANT]
> **User profile photo**: Will be stored on Cloudinary. The User model currently only has `email` and `password`. We'll add `name`, `avatarUrl`, and `bio` fields.

---

## Proposed Changes

### Phase 1: Database Schema — Prisma

#### [MODIFY] [schema.prisma](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/prisma/schema.prisma)

Extend the schema with all needed models:

```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  name         String?
  avatarUrl    String?
  bio          String?
  password     String?
  otp          String?
  otpExpiry    DateTime?
  isVerified   Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  albums       Album[]
}

model Album {
  id           String    @id @default(uuid())
  title        String
  description  String?
  date         DateTime?
  songUrl      String?      // Deezer preview URL
  songTitle    String?
  songArtist   String?
  isFavorite   Boolean   @default(false)
  isDeleted    Boolean   @default(false)
  deletedAt    DateTime?    // For 30-day auto-purge
  coverUrl     String?      // First image or user-chosen cover
  templateId   String?      // Reference to template layout used

  userId       String
  user         User      @relation(fields: [userId], references: [id])

  images       Image[]

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Image {
  id           String    @id @default(uuid())
  url          String       // Cloudinary URL
  publicId     String       // Cloudinary public_id for deletion
  caption      String?
  order        Int       @default(0)

  albumId      String
  album        Album     @relation(fields: [albumId], references: [id], onDelete: Cascade)

  createdAt    DateTime  @default(now())
}
```

---

### Phase 2: Backend — New Dependencies & Config

#### [MODIFY] [package.json](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/package.json)

Add new dependencies:
- `multer` — file upload middleware
- `cloudinary` — Cloudinary SDK
- `@types/multer` — TypeScript types
- `node-cron` — scheduled job for trash auto-purge

#### [NEW] [cloudinary.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/config/cloudinary.ts)

Configure Cloudinary v2 SDK with env vars.

#### [NEW] [multer.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/config/multer.ts)

Configure multer with memory storage (buffer-based upload to Cloudinary).

#### [NEW] [authMiddleware.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/middlewares/authMiddleware.ts)

JWT authentication middleware — extracts `userId` from Bearer token, attaches to `req.user`.

---

### Phase 3: Backend — API Routes

#### Auth Enhancements

#### [MODIFY] [authService.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/services/authService.ts)

Add:
- `forgotPassword(email)` — sends reset OTP
- `resetPassword(email, otp, newPassword)` — resets password after OTP verification

#### [MODIFY] [authController.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/controllers/authController.ts)

Add `forgotPassword` and `resetPassword` controller methods.

#### [MODIFY] [authRoutes.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/routes/authRoutes.ts)

Add:
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

---

#### User Profile

#### [NEW] [userService.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/services/userService.ts)

- `getProfile(userId)` — returns user profile
- `updateProfile(userId, data, file?)` — update name, bio, avatar (upload to Cloudinary)

#### [NEW] [userController.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/controllers/userController.ts)

#### [NEW] [userRoutes.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/routes/userRoutes.ts)

- `GET /api/user/profile` (protected)
- `PUT /api/user/profile` (protected, multipart for avatar)

---

#### Albums CRUD

#### [NEW] [albumService.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/services/albumService.ts)

- `createAlbum(userId, data, files[])` — create album + upload images to Cloudinary
- `getAlbums(userId)` — all non-deleted albums
- `getAlbumById(albumId, userId)` — single album with images
- `updateAlbum(albumId, userId, data)` — update title/desc/date/song
- `toggleFavorite(albumId, userId)` — toggle isFavorite
- `getFavorites(userId)` — only favorited albums
- `softDeleteAlbum(albumId, userId)` — set isDeleted=true, deletedAt=now
- `getTrash(userId)` — all soft-deleted albums
- `restoreAlbum(albumId, userId)` — restore from trash
- `permanentDelete(albumId, userId)` — delete album + images from Cloudinary
- `addImages(albumId, userId, files[])` — add more images to album
- `removeImage(imageId, userId)` — remove single image + delete from Cloudinary
- `updateCover(albumId, userId, imageUrl)` — set cover image

#### [NEW] [albumController.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/controllers/albumController.ts)

#### [NEW] [albumRoutes.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/routes/albumRoutes.ts)

Routes (all protected):
- `POST /api/albums` — create album (multipart, multiple images)
- `GET /api/albums` — list user's albums
- `GET /api/albums/favorites` — list favorites
- `GET /api/albums/trash` — list trashed
- `GET /api/albums/:id` — single album detail
- `PUT /api/albums/:id` — update album metadata
- `PATCH /api/albums/:id/favorite` — toggle favorite
- `DELETE /api/albums/:id` — soft delete (move to trash)
- `POST /api/albums/:id/restore` — restore from trash
- `DELETE /api/albums/:id/permanent` — permanent delete
- `POST /api/albums/:id/images` — add images
- `DELETE /api/albums/images/:imageId` — remove image

---

#### Song Search (Deezer Proxy)

#### [NEW] [songService.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/services/songService.ts)

- `searchSongs(query)` — proxies to `https://api.deezer.com/search?q={query}` and returns formatted results (title, artist, preview URL, album art)

#### [NEW] [songController.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/controllers/songController.ts)

#### [NEW] [songRoutes.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/routes/songRoutes.ts)

- `GET /api/songs/search?q=...` (protected)

---

#### Trash Auto-Purge (Cron Job)

#### [NEW] [cron.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/config/cron.ts)

Daily cron job: delete all albums where `isDeleted=true` AND `deletedAt` > 30 days ago. Also delete associated images from Cloudinary.

---

#### Server Update

#### [MODIFY] [server.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/backend/src/server.ts)

Register new routes:
```ts
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
```
Initialize cron job on startup.

---

### Phase 4: Frontend — New Dependencies

#### [MODIFY] [package.json](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/package.json)

Add:
- `react-konva` + `konva` — canvas-based image editor (text/stickers)
- `react-masonry-css` — Pinterest-style masonry grid layout
- `date-fns` — date formatting
- `react-hot-toast` — toast notifications (replace ugly `alert()`)
- `zustand` — lightweight state management (auth state, user profile)

---

### Phase 5: Frontend — State Management & API Layer

#### [NEW] [stores/authStore.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/stores/authStore.ts)

Zustand store for:
- `token`, `user` (profile data), `isAuthenticated`
- `login()`, `logout()`, `setUser()`, `switchAccount()`
- Persists token in localStorage

#### [MODIFY] [api/auth.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/api/auth.ts)

- Fix `baseURL` to `http://localhost:8000/api/auth` (backend runs on 8000, not 5000)
- Add `loginApi`, `forgotPasswordApi`, `resetPasswordApi`
- Add auth interceptor to attach JWT token

#### [NEW] [api/albums.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/api/albums.ts)

Album CRUD API functions (all with JWT auth header).

#### [NEW] [api/user.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/api/user.ts)

User profile API functions.

#### [NEW] [api/songs.ts](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/api/songs.ts)

Song search API function.

---

### Phase 6: Frontend — Pages & Components

#### Auth Pages

#### [MODIFY] [Login.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/pages/Login.tsx)

- Wire up form state and actual login API call
- Store token in zustand + localStorage
- Navigate to `/dashboard` on success
- Connect "Misplaced your key?" to forgot password flow

#### [NEW] [ForgotPassword.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/pages/ForgotPassword.tsx)

- Step 1: Enter email → send reset OTP
- Step 2: Enter OTP → verify
- Step 3: Enter new password → reset

#### [MODIFY] [Register.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/pages/Register.tsx)

- Add name field to step 3 (alongside password)
- Add profile photo upload (optional) with preview

---

#### Dashboard & Layout

#### [MODIFY] [Dashboard.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/pages/Dashboard.tsx)

Complete rewrite to be a dynamic shell:
- Renders different content based on `activePage` state from Sidebar
- Sections: `dashboard` (recent albums), `albums` (all albums), `favorites`, `templates`, `trash`, `profile`
- Fetch real data from API
- Pinterest-style masonry grid using `react-masonry-css`
- Mobile hamburger menu toggle

#### [MODIFY] [Sidebar.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/Sidebar.tsx)

- Show real user name + avatar from zustand store
- Wire "Switch Account" → clear current session, redirect to login
- Wire "Logout" → clear token, redirect to login
- Wire "+ Add New Leaf" → open create album modal
- Add mobile overlay backdrop

---

#### Albums Components

#### [NEW] [AlbumGrid.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/AlbumGrid.tsx)

Pinterest-style masonry grid of album cards. Uses `react-masonry-css` for responsive columns.

#### [MODIFY] [AlbumCard.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/AlbumCard.tsx)

- Accept real album data (images, title, date, isFavorite)
- Show cover image from Cloudinary
- Favorite heart toggle calls API
- Click → navigate to album detail view
- Polaroid-style card with subtle hover animation

#### [NEW] [CreateAlbumModal.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/CreateAlbumModal.tsx)

Modal dialog for creating a new album:
- Title, description, date picker
- Drag & drop / click to upload multiple images
- Image preview thumbnails
- Song search bar (searches Deezer API, shows results with album art)
- Select a song → shows song card with 30s preview player
- Submit → creates album via API

#### [NEW] [AlbumDetail.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/AlbumDetail.tsx)

Full album view:
- Header: title, description, date, fav toggle
- Image gallery grid (Pinterest masonry)
- Song player (if song attached) — embedded audio player with album art
- Edit/Delete buttons
- "Add more images" button
- Click on image → opens image editor

---

#### Templates

#### [MODIFY] [Templates.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/Templates.tsx) (currently just `export default`)

Complete implementation:
- Grid of ready-made collage template layouts
- Each template is a predefined arrangement of image slots (e.g., "2x2 Grid", "1 Big + 2 Small", "3 Column Panorama", "Polaroid Stack", "Story Strip")
- Template card shows the layout preview with white boxes / shapes + a `+` button on each slot
- User clicks `+` → file picker → image fills that slot
- Editable title and description fields
- "Save as Album" button → creates album from template

Templates will be defined as JSON layout configs:
```ts
const templates = [
  {
    id: "classic-grid",
    name: "Classic Grid",
    slots: [
      { x: 0, y: 0, w: 50, h: 50 },
      { x: 50, y: 0, w: 50, h: 50 },
      { x: 0, y: 50, w: 50, h: 50 },
      { x: 50, y: 50, w: 50, h: 50 },
    ]
  },
  // ... more templates
];
```

---

#### Image Editor

#### [NEW] [ImageEditor.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/ImageEditor.tsx)

Canvas-based image editor using `react-konva`:
- Load image onto Konva Stage
- **Add Text**: Click "Add Text" → draggable text node, editable content, font size, color
- **Add Stickers**: Emoji picker / preset stickers → draggable sticker nodes
- **Save**: Export canvas to image → upload to Cloudinary → replace original or save as new

---

#### Favorites Section

Reuses `AlbumGrid` component filtered to only show `isFavorite === true` albums.

---

#### Trash Section

#### [NEW] [TrashView.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/TrashView.tsx)

- Shows soft-deleted albums in a grid
- Each card shows "Deleted X days ago" and "Auto-deletes in Y days"
- "Restore" button → restores to albums
- "Delete Permanently" button → confirms and permanently deletes

---

#### User Profile

#### [NEW] [ProfileView.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/ProfileView.tsx)

- Show/edit name, avatar, bio
- Upload new avatar
- Switch Account button
- Logout button

---

### Phase 7: Routing Update

#### [MODIFY] [App.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/App.tsx)

Add routes:
```tsx
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

#### [NEW] [ProtectedRoute.tsx](file:///d:/pooja/Resume-Projects/new/memory-vault/frontend/src/components/ProtectedRoute.tsx)

Wrapper that redirects to `/login` if no valid token exists.

---

### Phase 8: Responsive Design & Polish

- All layouts use responsive Tailwind classes (`sm:`, `md:`, `lg:`)
- Sidebar: full-screen overlay on mobile with backdrop blur, slide-in animation
- Album grids: 1 column on mobile, 2 on tablet, 3-4 on desktop (masonry)
- Modals: full-screen on mobile, centered dialog on desktop
- Create Album form: stacked layout on mobile
- Image editor: responsive canvas sizing
- Typography: Google Fonts — **Playfair Display** (serif headings) + **Inter** (body)

---

## Open Questions

> [!IMPORTANT]
> **Music Playback**: Deezer API provides free 30-second song previews without authentication. Is this sufficient, or do you need full-length playback (which requires Spotify OAuth integration)?

> [!IMPORTANT]  
> **shadcn/ui**: You mentioned using shadcn. Since shadcn requires Tailwind v4+ and specific setup, and your project uses Tailwind 3.4, do you want me to:
> - **(A)** Install and configure shadcn/ui (requires Tailwind upgrade) for buttons, dialogs, inputs
> - **(B)** Build custom components that match the current vintage aesthetic (recommended — shadcn's default style would clash with your warm/vintage theme)
>
> I recommend option **(B)** since your existing design has a strong vintage personality that custom components will preserve better.

---

## Verification Plan

### Automated Tests
1. Run `npx prisma db push` to verify schema migration
2. Test all API endpoints using the browser subagent:
   - Register → Login → Create Album → Upload Images → Toggle Favorite → Soft Delete → Trash → Permanent Delete
3. Run `npm run build` on frontend to check for TypeScript errors
4. Test responsive layouts at 375px, 768px, and 1440px widths

### Manual Verification
- Open browser and navigate through complete user flow
- Test image upload to Cloudinary
- Test song search and preview playback
- Test favorites toggle (heart fill/unfill)
- Test trash 30-day countdown display
- Test mobile responsive sidebar
