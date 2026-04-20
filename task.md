# Memory Vault — Implementation Tasks

## Phase 1: Database Schema
- [ ] Update Prisma schema (User fields + Album + Image models)
- [ ] Run prisma db push

## Phase 2: Backend Dependencies & Config
- [ ] Install multer, cloudinary, node-cron, @types/multer
- [ ] Create cloudinary.ts config
- [ ] Create multer.ts config
- [ ] Create authMiddleware.ts

## Phase 3: Backend API Routes
- [ ] Auth: forgotPassword + resetPassword (service, controller, routes)
- [ ] User: getProfile + updateProfile (service, controller, routes)
- [ ] Albums: full CRUD (service, controller, routes)
- [ ] Songs: Deezer search proxy (service, controller, routes)
- [ ] Cron: trash auto-purge job
- [ ] Update server.ts with new routes

## Phase 4: Frontend Dependencies
- [ ] Install react-konva, konva, react-masonry-css, date-fns, react-hot-toast, zustand

## Phase 5: Frontend State & API
- [ ] Create authStore (zustand)
- [ ] Update api/auth.ts (fix baseURL, add login/forgot/reset)
- [ ] Create api/albums.ts
- [ ] Create api/user.ts
- [ ] Create api/songs.ts

## Phase 6: Frontend Pages & Components
- [ ] ProtectedRoute component
- [ ] Update App.tsx routing
- [ ] ForgotPassword page
- [ ] Update Login.tsx (wire up API)
- [ ] Update Register.tsx (add name field)
- [ ] Rewrite Dashboard.tsx (dynamic shell)
- [ ] Update Sidebar.tsx (real data, actions)
- [ ] AlbumGrid.tsx (masonry)
- [ ] Update AlbumCard.tsx (real data, favorite toggle)
- [ ] CreateAlbumModal.tsx
- [ ] AlbumDetail.tsx
- [ ] Templates.tsx (ready-made collage templates)
- [ ] ImageEditor.tsx (react-konva)
- [ ] TrashView.tsx
- [ ] ProfileView.tsx

## Phase 7: Responsive & Polish
- [ ] Add Google Fonts
- [ ] Update index.css
- [ ] Responsive testing

## Phase 8: Verification
- [ ] Backend builds without errors
- [ ] Frontend builds without errors
- [ ] Browser walkthrough test
