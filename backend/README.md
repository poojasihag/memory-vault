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

## ☁️ Deployment (AWS Serverless)

This backend is deployed as a serverless application to AWS Lambda using the **Serverless Framework**.

### Prerequisites
- AWS CLI must be installed and configured (`aws configure`) with an IAM user that has deployment permissions (e.g., `AdministratorAccess` or specific serverless permissions).
- Serverless framework installed locally (`npm i -D serverless@3`).

### How to Deploy Updates

Whenever you make changes to the source code (`src/` folder), follow these two steps to deploy the new version:

**1. Build the project:**
Since this is a TypeScript project, you must first generate the Prisma client and compile your code to JavaScript.
```bash
npm run build
```

**2. Deploy to AWS:**
Deploy the compiled code using the serverless framework.
```bash
npx serverless deploy
```

*Note: The deployment relies on your `.env` variables being present in the backend folder. Ensure your `.env` is up to date before running the deploy command.*

---

For the full project overview, see the [Root README](../README.md).
