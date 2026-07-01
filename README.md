## TEST123

# Ehtesham Aalam — Full Stack Developer Portfolio

A modern, production-grade portfolio built with **Next.js 15**, **TypeScript**, **MongoDB**, **Tailwind CSS 4**, and **Framer Motion**. Features a full admin panel for content management, dual-mode backend (MongoDB or local JSON), file uploads, contact form, and a polished glassmorphism UI.

![Portfolio Preview](/public/images/portfolio-hero.png)

---

## ✨ Features

### Public Portfolio
- **Landing Intro** — Premium animated splash screen with orbiting particles, pulsing glow logo, and staggered text reveal
- **Hero Section** — Full-viewport hero with background image, gradient text, stats, and call-to-action buttons
- **About** — Developer bio with highlights and animated cards
- **Skills** — Dynamic skill grid with proficiency bars, fetched from API
- **Experience** — Timeline layout with role descriptions
- **Projects** — Project cards with images, tags, status badges, live/repo links
- **Certificates** — Certificate grid with credential links and images
- **Contact** — Working contact form that stores messages in the database

### Admin Dashboard
- **Authentication** — Secure session-based login with HMAC-signed cookies
- **CRUD Management** — Full create/read/update/delete for Projects, Skills, Certificates
- **Resume Management** — Upload and manage resume PDF
- **Social Links** — Manage GitHub, LinkedIn, Email, Twitter links
- **Messages** — View, mark as read, archive, or delete contact form submissions
- **File Uploads** — Upload images for projects/certificates and PDFs for resume

### Technical Highlights
- **Dual-mode backend** — Works with MongoDB (production) or local JSON file (development)
- **Optimized loading** — Fallback data renders instantly, API data upgrades in-place
- **SEO ready** — Proper meta tags, Open Graph, semantic HTML
- **Responsive** — Mobile-first design with glassmorphism and micro-animations
- **Accessible** — ARIA labels, reduced-motion support, keyboard navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion, CSS Animations |
| Database | MongoDB + Mongoose |
| Auth | HMAC-SHA256 session tokens |
| Validation | Zod |
| Icons | Lucide React |
| UI | Custom component library (Badge, Button, Card, Input, etc.) |

---

## 📁 Project Structure

```
├── data/
│   └── portfolio-store.json      # Local JSON database (dev mode)
├── public/
│   ├── certificates/             # Uploaded certificate images
│   ├── icons/                    # App icons
│   ├── images/                   # Static images
│   ├── projects/                 # Uploaded project images
│   └── resume/                   # Uploaded resume PDFs
├── src/
│   ├── app/
│   │   ├── about/                # About page
│   │   ├── admin/                # Admin panel pages
│   │   │   ├── certificates/     # Manage certificates
│   │   │   ├── dashboard/        # Dashboard overview
│   │   │   ├── login/            # Admin login
│   │   │   ├── projects/         # Manage projects
│   │   │   ├── resume/           # Manage resume
│   │   │   ├── skills/           # Manage skills
│   │   │   └── social-links/     # Manage social links
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Auth (login/logout/profile)
│   │   │   ├── certificates/     # Certificates CRUD
│   │   │   ├── contact/          # Contact messages
│   │   │   ├── projects/         # Projects CRUD
│   │   │   ├── skills/           # Skills CRUD
│   │   │   └── upload/           # File upload
│   │   ├── certificates/         # Certificates page
│   │   ├── contact/              # Contact page
│   │   ├── experience/           # Experience page
│   │   ├── projects/             # Projects page
│   │   ├── skills/               # Skills page
│   │   ├── globals.css           # Global styles & animations
│   │   ├── layout.tsx            # Root layout with fonts
│   │   └── page.tsx              # Homepage
│   ├── components/
│   │   ├── admin/                # Admin panel components
│   │   ├── shared/               # Layout, Reveal, SectionHeading
│   │   ├── ui/                   # Reusable UI primitives
│   │   ├── AnimatedBackground.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── LandingIntro.tsx
│   │   └── Navbar.tsx
│   ├── constants/                # Site config, fallback data
│   ├── hooks/                    # useCollection, usePublicProfile
│   ├── lib/                      # API helpers, auth, DB, validators
│   ├── models/                   # Mongoose schemas
│   ├── sections/                 # Page sections (About, Skills, etc.)
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Serialize, slugify utilities
├── .env.example                  # Environment template
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **MongoDB** (optional — the app works without it using local JSON storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/ehteshamaalam/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Edit `.env` with your values:

```env
# MongoDB connection string (optional — leave empty for local JSON mode)
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/portfolio"

# Session secret for admin authentication (required)
SESSION_SECRET="replace-with-a-long-random-secret"

# Admin credentials for first login
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | No | MongoDB Atlas connection string. If not set, uses local JSON file |
| `SESSION_SECRET` | Yes | Secret key for signing session tokens (use a random 32+ char string) |
| `ADMIN_EMAIL` | Yes | Email address for admin login |
| `ADMIN_PASSWORD` | Yes | Password for admin login |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 💾 Database Modes

### Local JSON Mode (Default)
When `MONGODB_URI` is not set, all data is stored in `data/portfolio-store.json`. This is great for:
- Local development
- Quick demos
- Environments without MongoDB access

### MongoDB Mode
When `MONGODB_URI` is set, the app connects to MongoDB with Mongoose. On first admin login, the user is auto-created in the database with the credentials from your `.env` file.

---

## 🔐 Admin Panel

Access the admin panel at `/admin/login`.

### Features:
| Page | Description |
|------|-------------|
| **Dashboard** | Overview metrics (projects, skills, certificates, messages count) + message management |
| **Projects** | Create/edit/delete projects with title, slug, description, tags, images, status |
| **Skills** | Manage skills with categories, proficiency levels, icons |
| **Certificates** | Manage certificates with issuers, dates, credential links, images |
| **Resume** | Upload resume PDF and set the public download URL |
| **Social Links** | Add/edit/remove social media links shown in the footer |

---

## 📡 API Routes

All API routes are under `/api/`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/auth?scope=public-profile` | No | Get public profile (name, socials, resume URL) |
| `GET` | `/api/auth` | Yes | Get authenticated admin profile |
| `POST` | `/api/auth` | No | Login with email/password |
| `PATCH` | `/api/auth` | Yes | Update profile (resume URL, social links) |
| `DELETE` | `/api/auth` | No | Logout (clear session cookie) |
| `GET` | `/api/projects` | No | List all projects |
| `POST` | `/api/projects` | Yes | Create a new project |
| `PATCH` | `/api/projects` | Yes | Update a project |
| `DELETE` | `/api/projects?id=<id>` | Yes | Delete a project |
| `GET` | `/api/skills` | No | List all skills |
| `POST` | `/api/skills` | Yes | Create a new skill |
| `PATCH` | `/api/skills` | Yes | Update a skill |
| `DELETE` | `/api/skills?id=<id>` | Yes | Delete a skill |
| `GET` | `/api/certificates` | No | List all certificates |
| `POST` | `/api/certificates` | Yes | Create a new certificate |
| `PATCH` | `/api/certificates` | Yes | Update a certificate |
| `DELETE` | `/api/certificates?id=<id>` | Yes | Delete a certificate |
| `GET` | `/api/contact` | Yes | List all contact messages |
| `POST` | `/api/contact` | No | Submit a contact message |
| `PATCH` | `/api/contact` | Yes | Update message status |
| `DELETE` | `/api/contact?id=<id>` | Yes | Delete a message |
| `POST` | `/api/upload` | Yes | Upload file (resume/project/certificate) |

---

## 🌐 Deployment

### Deploy to Vercel

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel project settings
4. Deploy!

> **Note:** File uploads to `/public/` are ephemeral on Vercel. For production file storage, consider using Cloudinary, AWS S3, or Vercel Blob.

### Build for Production

```bash
npm run build
npm start
```

---

## 📝 License

This project is private and built by **Ehtesham Aalam**. All rights reserved.

---

## 🤝 Contact

- **Email:** hello@ehtesham-aalam.dev
- **GitHub:** [github.com/ehteshamaalam](https://github.com/ehteshamaalam)
- **LinkedIn:** [linkedin.com/in/ehtesham-aalam](https://www.linkedin.com/in/ehtesham-aalam)
