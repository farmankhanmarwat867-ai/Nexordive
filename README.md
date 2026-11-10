# NexorDive

Full-stack MERN monorepo for the NexorDive digital agency platform and website manager CMS.

## Repository Structure

```text
Nexordive/
├── frontend/     # React 19 + TypeScript + Vite + Tailwind CSS application
└── backend/      # Express + TypeScript + MongoDB (Mongoose) REST API
```

## Running Locally

### 1. Backend (`/backend`)
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend (`/frontend`)
```bash
cd frontend
npm install
npm run dev
```

> **Deployment Note (Vercel):** Set the project's **Root Directory** to `frontend` in Vercel so `frontend/vercel.json` and `frontend/dist` build cleanly.
