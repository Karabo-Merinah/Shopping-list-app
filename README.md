# Shopping List App

A React + TypeScript app where users can register, log in, and manage their own shopping lists — with the option to share a list with someone else.

## Tech Stack
- React + TypeScript
- Vite
- React Router (routing)
- Redux Toolkit (state management)
- json-server (for storing data)
- bcryptjs (password hashing)

## Getting Started

### 1. Clone the repo

```
git clone https://github.com/Karabo-Merinah/Shopping-list-app.git
cd Shopping-list-app
```

### 2. Install dependencies

```
npm install
```

### 3. Set up your environment variables

Create a `.env` file in the project root with:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_SHOPPING_API_KEY=your_pixabay_api_key_here
```

Get a free Pixabay API key at https://pixabay.com/api/docs/ if you don't already have one.

### 4. Start the backend

```
npm run server
```

This runs at `http://localhost:3000`.

### 5. Start the app (in a separate terminal)

```
npm run dev
```

This runs at `http://localhost:5173`.

**Both need to be running at the same time** — the backend serves login/register/list data, the dev server serves the actual app.

## Project Structure

```
src/
  App.tsx              main app and routes
  app/store.ts          redux store setup
  ReduxStore/           redux slices (user auth state)
  Components/           shared components (Navbar, ProtectedRoute, PublicUserRouting, SharingList)
  Pages/                pages (Login, Register, Profile, HomePage)
  service/              API calls (UserAuthentication.ts)
  config/                API base URL config
```

## Routes
- `/` - Login page (logged-out users only)
- `/register` - Register page (logged-out users only)
- `/home` - Home page / your shopping lists (logged-in users only)
- `/profile` - View profile (logged-in users only)
- `/profile/edit` - Edit name/surname/number (logged-in users only)
- `/profile/login` - Edit email/password (logged-in users only)
- `/shared/:listId` - View a shared list (public)

## Branches
- `main` - planning documentation only
- `development` - active development

