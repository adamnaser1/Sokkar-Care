import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sokkar-Care Backend is running', timestamp: new Date() });
});

// Example route using Supabase
app.get('/api/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('users').select('*').limit(10);
    if (error) throw error;
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
