# Jayasri Kannan Foundation

## Project Architecture

```
jayasri-kannan-foundation/
│
├── frontend/           ← Deployed on Vercel
│   ├── index.html
│   ├── about.html
│   ├── activities.html
│   ├── blood-donation.html
│   ├── contact.html
│   ├── donate.html
│   ├── events.html
│   ├── eye-care.html
│   ├── gallery.html
│   ├── volunteer.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── api-config.js   ← Centralised API base URL
│   │
│   ├── images/             ← All static assets
│   │
│   └── admin/              ← Admin panel (also on Vercel)
│       ├── login.html
│       ├── dashboard.html
│       ├── activities.html
│       ├── donation-details.html
│       ├── events.html
│       ├── gallery.html
│       ├── what-we-do.html
│       └── admin.css
│
├── backend/            ← Deployed on Render
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── seeds/
│
├── vercel.json         ← Vercel deployment config
├── .gitignore
└── README.md
```

---

## Deployment

### Frontend → Vercel

| Setting | Value |
|---|---|
| Root Directory | `.` (repo root) |
| Framework Preset | Other |
| Build Command | *(none)* |
| Output Directory | `frontend` |

> The `vercel.json` at the project root handles routing.

---

### Backend → Render

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Environment | Node |

**Required environment variables on Render:**

```
PORT=10000
MONGODB_URI=mongodb+srv://...
ADMIN_EMAIL=jskfoundation29@gmail.com
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@jayasrikannanfoundation.org
JWT_SECRET=<strong secret>
```

---

### Database → MongoDB Atlas

- Cluster must allow connections from Render's outbound IPs (or `0.0.0.0/0` for simplicity)
- Database name: `jayasri_kannan_foundation`

---

### Email → Resend

- Configure a verified sending domain in Resend dashboard
- Set `FROM_EMAIL` to a verified address (e.g. `noreply@jayasrikannanfoundation.org`)
- Set `RESEND_API_KEY` in Render environment variables

---

## Local Development

```bash
# 1. Start the backend
cd backend
npm install
npm run dev       # → http://localhost:5000

# 2. Serve the frontend (use VS Code Live Server or any static server)
# Open frontend/index.html with Live Server
# → http://127.0.0.1:5500
```

The `api-config.js` automatically detects `localhost` and routes API calls to `http://localhost:5000`.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/contact` | Contact form submission |
| POST | `/api/volunteers` | Volunteer registration |
| POST | `/api/admin/login` | Admin authentication |
| GET | `/api/admin/verify` | Verify JWT token |
| GET/POST/PUT/DELETE | `/api/gallery` | Gallery management |
| GET/POST/PUT/DELETE | `/api/events` | Events management |
| GET/POST/PUT/DELETE | `/api/activities` | Activities management |
| GET/POST/PUT | `/api/what-we-do` | What We Do content |
| GET/POST/PUT/DELETE | `/api/donations` | Donation records |
| GET | `/api/health` | Health check |
