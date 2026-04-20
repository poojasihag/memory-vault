# 📔 Memory Vault

**Memory Vault** is a beautiful, full-stack digital scrapbooking application designed to help you preserve and cherish your most precious moments. With a warm vintage aesthetic, it combines interactive image galleries, music integration, and personal story-telling in one immersive experience.

---

## ✨ Key Features

- **🎨 Vintage-Themed UI**: A carefully curated warm color palette (`#e8ded2`, `#8b3a3a`) with elegant serif typography.
- **📸 Digital Albums**: Create albums with multiple images, descriptions, and custom dates.
- **🎵 Music Integration**: Search and attach songs to your albums (powered by Deezer).
- **🖼️ Image Editor**: Annotate your memories with stickers and text (powered by Konva).
- **📋 Creative Templates**: Use pre-defined collage layouts to quickly assemble beautiful memory pages.
- **🔐 Secure Authentication**: OTP-based registration and secure JWT login flow.
- **❤️ Favorites & Search**: Quickly find and bookmark your most important memories.
- **♻️ Smart Trash System**: Soft-delete albums with a 30-day auto-purge feature.
- **📱 Fully Responsive**: Seamless experience across mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
- **Canvas/Editor**: [Konva](https://konvajs.org/) + [react-konva](https://konvajs.org/docs/react/index.html)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/) (for images)
- **Email**: [Nodemailer](https://nodemailer.com/) (for OTP/password resets)
- **Scheduler**: [Node-cron](https://www.npmjs.com/package/node-cron)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (or any PostgreSQL instance)
- A Cloudinary account
- SMTP credentials (e.g., Gmail App Password)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/memory-vault.git
   cd memory-vault
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   # Server Configuration
   PORT=8000
   CORS_ORIGIN=http://localhost:5173

   # Auth
   JWT_SECRET=your_jwt_secret
   ACCESS_TOKEN_EXPIRY=1d

   # Database
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Database Migration**:
   ```bash
   npx prisma db push
   ```

4. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

The app should now be running at `http://localhost:5173`.

---

## 📂 Project Structure

```text
memory-vault/
├── backend/                # Express API
│   ├── prisma/             # Schema & migrations
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── config/         # App configurations
│   │   └── server.ts       # Entry point
│   └── .env                # Environment variables
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # View components
│   │   ├── stores/         # Zustand state
│   │   ├── api/            # API services
│   │   └── App.tsx         # Root routes
│   └── tailwind.config.ts  # Theme configuration
└── README.md
```

---

## 📜 License

This project is licensed under the ISC License.

---

*Made with ❤️ for memories.*
