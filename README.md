# PFE – Ibn Khaldoun University Platform

Full-stack university management platform built with React, Express, and Tailwind CSS.

## Structure

```
PFE/
├── client/     → React 19 + Tailwind CSS frontend
├── backend/    → Node.js + Express API server
└── .github/    → CI / collaboration config
```

## Getting Started

### Frontend (client)
```bash
cd client
npm install
npm start        # → http://localhost:3000
```

### Backend (backend)
```bash
cd backend
npm install
node index.js    # → http://localhost:5000
```

## Collaboration

- **Never** commit `node_modules/` or `.env` files.
- Run `npm install` inside both `client/` and `backend/` after cloning.
- Create a `.env` file in `backend/` with `PORT=5000` (see `backend/README.md`).

See each folder's `README.md` for more details.
