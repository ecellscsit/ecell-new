# E-Cell SCSIT Website (MERN)

React (Vite) + Node.js/Express + MongoDB. Built from `ecell-scsit-website-plan.docx` (Version 4).

---

## ▶ How to run in VS Code (step by step)

### One-time setup
1. **Install Node.js (LTS)** from https://nodejs.org, then restart your PC/VS Code.
   Check in a terminal: `node -v` should show v20 or higher.
2. **Get a MongoDB database** (pick one):
   - **MongoDB Atlas (easiest, free):** create an account at https://www.mongodb.com/atlas → create a free cluster →
     *Database Access*: add a user + password → *Network Access*: allow your IP (or 0.0.0.0/0 for testing) →
     *Connect → Drivers* and copy the connection string, e.g.
     `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ecell_scsit`
   - **Local MongoDB:** install MongoDB Community Server from https://www.mongodb.com/try/download/community
     and keep the default `MONGO_URI` (nothing to change).
3. **Open the project:** VS Code → *File → Open Folder* → select the `ecell-scsit` folder.
   (Click "Install" if VS Code suggests the recommended extensions.)
4. **Open the terminal:** *Terminal → New Terminal* (Ctrl + `).

### Run it
Type these in the VS Code terminal, one at a time:

```bash
npm run install:all     # installs packages for root, server and client (takes 1-3 minutes)
```

Open `server/.env` (already created for you). **Only if you use Atlas**, replace the `MONGO_URI=` line with your Atlas string.
Optionally change `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

```bash
npm run db:check        # tests your MongoDB connection and tells you what to fix
npm run seed            # creates the admin account
npm run seed:demo       # loads E-Cell SCSIT content: real team/contact/events + demo startups, photos (run again anytime to reset)
npm run dev             # starts the API (port 5000) and the website (port 5173)
```

Now open **http://localhost:5173** in your browser.

| What | Where |
|---|---|
| Website | http://localhost:5173 |
| Admin panel | http://localhost:5173/admin (login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`) |
| API health | http://localhost:5000/api/home |

Default admin (if you did not change it): **admin@ecellscsit.com / Admin@12345**

> You can also press **Ctrl+Shift+B** in VS Code to run the "Start website" task, or use *Terminal → Run Task…*.
> Stop everything with **Ctrl + C** in the terminal.

### Next time
Just open the folder and run `npm run dev`.

### Common problems
| Problem | Fix |
|---|---|
| `MongoDB connection failed` | Atlas: check the password in `MONGO_URI` and that your IP is allowed in *Network Access*. Local: make sure the MongoDB service is running. |
| `'npm' is not recognized` | Node.js is not installed or VS Code was not restarted after installing. |
| Port 5000 or 5173 already in use | Close the other app, or change `PORT` in `server/.env` (and the proxy in `client/vite.config.js`). |
| Pages are empty | Run `npm run seed:demo`, or add content from the admin panel. |
| Registration says "check your email" | Set `DEV_AUTO_VERIFY=true` in `server/.env` (default), or configure SMTP. Without SMTP, emails are printed in the terminal, including the verify link. |
| Images not showing after restart | Uploaded files live in `server/uploads/`. Keep that folder. |

---

## Folder structure

```
ecell-scsit/
├── client/                 React frontend (Vite)
│   ├── public/images/      logos: ecell-logo.png, ecell-logo-white.png, scsit-logo.png, favicon.png
│   └── src/
│       ├── App.jsx         all routes
│       ├── api/            axios setup
│       ├── context/        Auth + Settings (contact info, social links)
│       ├── components/     layout (Navbar, Footer) and common (Logo, Img, EventCard ...)
│       └── modules/        one folder per feature
│           home/ about/ events/ team/ startups/ gallery/ blog/ contact/
│           auth/ profile/ notifications/ admin/
└── server/                 Node + Express backend
    ├── seed-assets/        sample images used by seed:demo
    └── src/
        ├── routes.js       one line per module
        ├── middleware/ utils/ config/
        └── modules/        model + controller + routes per feature
```

## Pages (all included)
Home (hero, counters, about + HOD message, initiatives, announcements, events, founders, startups, testimonials, gallery, partners) · About · Initiatives · Events + Event detail with registration · Team (year selector, hierarchy)
· Startups · Gallery (filter + lightbox) · Blog + Post · Contact (form, details, map) · Login · Register · Verify email
· Forgot / Reset password · Profile · Notification bell · 404 · Admin (Dashboard, Home Page, About Page, Notifications, Events, Blog,
Team with ↑↓ ordering, Gallery with multi-upload, Startups, Members, Messages, Settings)

## Logos
Files are in `client/public/images/`. Replace them with new files of the same name to change the branding everywhere:
Navbar and auth pages use `ecell-logo.png`; the footer uses `ecell-logo-white.png` and `scsit-logo.png`; the browser tab uses `favicon.png`.

## Going live later
- Frontend: `npm run build --prefix client`, host `client/dist` on Vercel/Netlify and set `VITE_API_URL` to your API address.
- Backend: Render/Railway with the same env variables and MongoDB Atlas.
- Set `DEV_AUTO_VERIFY=false`, add real SMTP details (Brevo / SendGrid / Resend), and use a long random `JWT_SECRET`.
- Move image uploads to Cloudinary (free hosts delete local files).
