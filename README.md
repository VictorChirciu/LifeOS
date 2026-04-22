# LifeOS

A full-stack personal life management web application built with Node.js, Express, TypeScript, and MongoDB. LifeOS brings together task management, notes, a calendar, and a personalized dashboard — all in one place.

## About This Project

LifeOS started as a university project with a clear goal: build something real with Express.js and TypeScript, style it with Tailwind, and — most importantly — learn how to work with external API services in practice. The idea of a personal life manager came naturally from there: instead of using five different apps to manage daily life, have one place that does it all. Along the way it grew into a real exercise in full-stack architecture — sessions, authentication, data modeling, client-side modules, theme systems, and multiple API integrations.

The client-side logic is written in TypeScript without a frontend framework — no React, no Vue, no Angular. This was a deliberate choice for this particular project: with well-defined server-rendered pages, adding a framework would have meant learning its abstractions rather than understanding the DOM, event handling, and module boundaries directly. That said, frameworks exist for good reasons — they solve real problems at scale — and future projects will absolutely use them. This project was about understanding what's underneath first.

## Features

- **Dashboard** — Live clock, day progress, next event countdown, historical events (translated to Romanian), weather for Chișinău, and word of the day
- **Notes** — Rich text editor powered by Quill.js, pin notes, quick delete, auto-save
- **Tasks** — Create, edit, complete, and delete tasks with deadlines
- **Calendar** — Monthly view, add events with color and time, edit and delete inline
- **Authentication** — Email-based register and login, bcrypt password hashing, MongoDB session storage
- **Settings** — Avatar upload (base64), username and password editing, email display
- **Themes** — 5 themes (Stone, Snow, Zinc, Sand, Mint) × light/dark = 10 variants, saved per user in MongoDB
- **Security** — Helmet.js, owner-checked queries, protected routes

## Technologies Used

### Backend

- Node.js + Express 5
- TypeScript (ts-node/esm)
- MongoDB Atlas + Mongoose
- express-session + connect-mongo
- bcrypt
- helmet
- axios

### Frontend

- TypeScript (compiled to ES modules, no framework)
- Tailwind CSS v3
- EJS templates
- Quill.js (rich text editor)

### Dev Tools

- nodemon + concurrently
- LiveReload
- Prettier + prettier-plugin-ejs

## Getting Started

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/VictorChirciu/LifeOS.git
cd LifeOS
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_long_random_secret
WORDNIK_API_KEY=your_wordnik_key
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
```

This runs Tailwind, TypeScript, LiveReload, and nodemon concurrently. Visit `http://localhost:3000`.

## Development Challenges

- Keeping theme state in sync between localStorage, MongoDB, and the server-rendered body class without causing a flash of unstyled content on page load
- Handling Quill.js Delta format correctly across save and load cycles, including double-parsed JSON edge cases
- Getting TypeScript, Tailwind, LiveReload, nodemon, and EJS to all work together in a unified dev environment — each tool had its own configuration quirks and compatibility constraints that had to be resolved together
- Session persistence across server restarts using connect-mongo with Node 22 compatibility constraints

## My Comments

This project exceeded my expectations. It's fascinating how it all started with a single root file and evolved into a cohesive architecture centered around fetches and responses. I'm very proud that I was able to implement interactions with various APIs — something I've long wanted to try in a project. No well-known framework is used here to build the entire project skeleton (but future projects will use a framework). There is still room for improvement — email notifications, a mobile layout, a proper implementation pipeline — but even now it works, and that's already something.

---
