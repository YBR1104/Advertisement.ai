# Advertisement.ai

AI-powered ad creative generator. Upload a product, describe what you want, and generate images and short-form videos ready for social channels.

## Features

- AI image and video ad generation via Google GenAI
- Product upload with multi-image support
- Aspect ratio and length controls tuned for social formats (9:16, 1:1, 16:9)
- User authentication and account management with Clerk
- Credits-based usage with project history
- Community gallery of published creatives
- Profile, settings, and plan management dashboard

## Tech Stack

**Client**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- Clerk (auth)
- Framer Motion, Lucide React, React Hot Toast
- Axios

**Server**
- Node.js + Express 5 (TypeScript)
- Prisma ORM + PostgreSQL
- Clerk (auth + webhooks)
- Google GenAI (`@google/genai`)
- Cloudinary (media storage)
- Multer (uploads)
- Sentry (error tracking)

## Project Structure

```
Advertisement.ai/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── pages/          # Home, Generator, Result, Community, Plan, ...
│       ├── components/     # UI primitives, DashboardLayout, ProjectCard, ...
│       └── assets/
└── server/                 # Express + Prisma backend
    ├── controllers/        # clerk, project, user
    ├── routes/             # project, user
    ├── middlewares/        # Clerk auth guard
    ├── configs/            # prisma, sentry
    └── prisma/             # schema & migrations
```

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database
- Clerk account (publishable + secret keys)
- Google GenAI API key
- Cloudinary account
- Sentry DSN (optional)

### 1. Clone

```bash
git clone https://github.com/YBR1104/Advertisement.ai.git
cd Advertisement.ai
```

### 2. Server

```bash
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run server      # dev (nodemon + tsx)
# or
npm start           # production-style run via tsx
```

Create `server/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
GOOGLE_GENAI_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SENTRY_DSN=...
```

### 3. Client

```bash
cd client
npm install
npm run dev
```

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_API_BASE_URL=http://localhost:5000
```

## Scripts

**Client**
- `npm run dev` — start Vite dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

**Server**
- `npm run server` — dev with auto-reload
- `npm start` — run with tsx
- `npm run build` — compile TypeScript

## API Overview

Base URL: `http://localhost:5000`

- `GET /` — health check
- `POST /api/clerk` — Clerk webhook (raw JSON)
- `/api/user/*` — user endpoints (protected)
- `/api/project/*` — project CRUD and generation endpoints (protected)

## License

ISC
