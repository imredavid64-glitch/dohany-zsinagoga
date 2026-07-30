import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { db } from './database';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dohany-synagogue-secret-2025';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

if (!process.env.VERCEL) {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
  });
}

// Auth middleware
function auth(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ========== AUTH ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });
    if (db.findUserByEmail(email)) return res.status(400).json({ error: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = db.createUser(email, hash, name);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/auth/me', auth, (req: any, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin });
});

// ========== AUDIO GUIDES ==========
app.get('/api/audio-guides', (req, res) => {
  let guides = [...db.audioGuides];
  if (req.query.official === 'true') guides = guides.filter(g => g.isOfficial);
  if (req.query.language) guides = guides.filter(g => g.language === req.query.language);
  res.json(guides);
});

app.get('/api/audio-guides/:id', (req, res) => {
  const guide = db.audioGuides.find(g => g.id === req.params.id);
  if (!guide) return res.status(404).json({ error: 'Not found' });
  res.json(guide);
});

// ========== PRAYERS ==========
app.get('/api/prayers', (req, res) => {
  let list = [...db.prayers];
  const day = req.query.day as string;
  if (day) list = list.filter(p => p.days.includes(day) || p.isSpecial);
  res.json(list);
});

app.get('/api/prayers/:id', (req, res) => {
  const p = db.prayers.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// ========== TICKETS ==========
app.get('/api/tickets/types', (req, res) => res.json(db.ticketTypes));

app.post('/api/tickets/book', auth, async (req, res) => {
  try {
    const { type, date, time, visitorName, visitorEmail, quantity = 1 } = req.body;
    const ticketType = db.ticketTypes.find(t => t.id === type);
    if (!ticketType) return res.status(400).json({ error: 'Invalid type' });
    const bookingRef = 'BK-' + Date.now().toString(36).toUpperCase();
    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      tickets.push(db.createTicket({
        bookingRef, type: ticketType.id, price: ticketType.price,
        date, time, visitorName, visitorEmail, status: 'confirmed',
      }));
    }
    res.json({ bookingRef, tickets, total: ticketType.price * quantity });
  } catch { res.status(500).json({ error: 'Booking failed' }); }
});

app.get('/api/tickets/my', auth, (req: any, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.json([]);
  res.json(db.getTicketsByEmail(user.email));
});

app.get('/api/tickets/:id', (req, res) => {
  const t = db.tickets.find(t => t.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});

// ========== EVENTS ==========
app.get('/api/events', (req, res) => {
  const { category } = req.query;
  let list = [...db.events];
  if (category) list = list.filter(e => e.category === category);
  res.json(list);
});

app.get('/api/events/:id', (req, res) => {
  const e = db.events.find(e => e.id === req.params.id);
  if (!e) return res.status(404).json({ error: 'Not found' });
  res.json(e);
});

app.post('/api/events/:id/register', auth, (req: any, res) => {
  const { name, email } = req.body;
  const event = db.addRegistration(req.params.id, name, email);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ message: 'Registered!', event });
});

// ========== COMMENTS ==========
app.get('/api/comments', (req, res) => {
  const { targetId } = req.query;
  let list = [...db.comments];
  if (targetId) list = list.filter(c => c.targetId === targetId);
  res.json(list);
});

app.post('/api/comments', auth, (req: any, res) => {
  const { content, rating, targetId } = req.body;
  const user = db.findUserById(req.user.id);
  const comment = {
    id: uuidv4(), content, rating: rating || 0,
    userName: user?.name || 'Anonymous', createdAt: new Date().toISOString(), targetId: targetId || 'general',
  };
  db.comments.push(comment);
  res.status(201).json(comment);
});

// ========== SYNAGOGUE INFO ==========
app.get('/api/about', (req, res) => res.json({
  name: "Dohány Utcai Zsinagóga",
  built: 1859,
  architect: "Frigyes Mahler",
  style: "Moorish Revival",
  capacity: 2964,
  description: "The largest synagogue in Europe and a working house of worship, located in the heart of Budapest's historic Jewish Quarter.",
  history: "Completed in 1859, the Dohány Street Synagogue has been a central institution of Hungarian Jewry for over 160 years. It survived Nazi occupation and communist rule, and today serves as both an active synagogue and a major tourist attraction.",
  highlights: ["64 stained glass windows", "3,000 pipe organ", "Jewish Museum next door", "Raoul Wallenberg Memorial Park", "Tree of Life memorial"],
  location: "Budapest, Dohány u. 2, 1074 Hungary",
  contact: { phone: "+36 1 555-0123", email: "info@dohany-synagogue.hu" }
}));

app.get('/api/rules', (req, res) => res.json({
  dressCode: "Modest attire required. Men should cover their heads.",
  photography: "Permitted in designated areas only. No flash during services.",
  hours: "Sunday-Thursday 9:00-17:00, Friday 9:00-14:00, Saturday closed",
  tickets: "Advance booking recommended. Group rates available."
}));

// ========== HEALTH ==========
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n  Dohány Utcai Synagogue App`);
    console.log(`  ─────────────────────────`);
    console.log(`  API:  http://localhost:${PORT}/api`);
    console.log(`  App:  http://localhost:${PORT}\n`);
  });
}

export default app;
