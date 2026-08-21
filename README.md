# Shopping List App

A TypeScript shopping list app where users can register, log in, and manage their own shopping lists.

## Tech Stack
- React + TypeScript
- Vite
- React Router (routing)
- Redux Toolkit (state management)
- json-server (fake backend for storing data)

## Getting Started

### 1. Install dependencies

npm install


### 2.json-server

npm run server

This runs at http://localhost:3001

### 3. Start the app

npm run dev

This runs at http://localhost:5173

Both need to be running at the same time for login/register to work.

## Project Structure

src/
  App.tsx              main app and routes
  app/store.ts          redux store setup
  ReduxStore/           redux slices (user auth state)
  Components/           shared components (Navbar, ProtectedRoute, GuestRoute)
  Pages/                pages (Login, Register, Profile, HomePage)


## Routes
- `/` - Home page
- `/login` - Login page (only for logged out users)
- `/register` - Register page (only for logged out users)
- `/profile` - Profile page (only for logged in users)

## Branches
- `main` - planning documentation only
- `development` - active development 