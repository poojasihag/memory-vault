# ⚙️ Memory Vault — Backend

This is the backend API for **Memory Vault**, built with Node.js, Express, and Prisma.

## 🚀 Development

### Installation

```bash
npm install
```

### Database Setup

Ensure you have a PostgreSQL database (or Supabase instance). 

1. Create a `.env` file (copy from root instructions).
2. Sync the database schema:
   ```bash
   npx prisma db push
   ```

### Run Locally

```bash
npm run dev
```

The server will start at `http://localhost:8000`.

## 🛠️ Main Technologies

- **Express** (API Framework)
- **Prisma** (ORM)
- **Supabase** (PostgreSQL)
- **Cloudinary** (Image Hosting)
- **JWT** (Authentication)
- **Nodemailer** (Emails)
- **Node-cron** (Scheduled Tasks)

---

For the full project overview, see the [Root README](../README.md).
