# Sokkar-Care Backend Setup

This is a Node.js/Express backend for the Sokkar-Care application. It's designed to connect to your Supabase project for server-side logic, AI proxying, and secure data handling.

## Prerequisites
- [Node.js](https://nodejs.org/) installed
- A [Supabase](https://supabase.com/) project

## Installation

1. From the `backend` folder, install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Fill in your Supabase credentials in `.env`:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Keep this secret!)

## Running the Server

Start in development mode (with auto-reload using `nodemon` if installed):
```bash
npm start
```
By default, the server runs on `http://localhost:3000`.

## API Endpoints
- `GET /api/health`: Check if the server is running.
- `GET /api/users`: Example route to fetch users from Supabase.

## Sync Logic
The frontend is configured to save data locally in the browser's persistent storage. To enable full synchronization:
1. Ensure your Supabase database schema matches the `useAppStore` interfaces.
2. Configure RLS (Row Level Security) on your Supabase tables.
