const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── DATA STORE ───────────────────────────────────────────────
let bookings = [
  { id: uuidv4(), customerName: 'Ram Kumar', phone: '9876543210', from: 'Mirzapur', to: 'Varanasi', date: '2026-04-28', time: '09:00', goodsType: 'Saman', payment: 'Cash', note: '', status: 'pending', driverAssigned: null, createdAt: new Date().toISOString() },
  { id: uuidv4(), customerName: 'Sunita Devi', phone: '9845001234', from: 'Sonbhadra', to: 'Mirzapur', date: '2026-04-29', time: '07:00', goodsType: 'Passenger', payment: 'UPI', note: 'Family hai 4 log', status: 'confirmed', driverAssigned: 'Ramesh Kumar', createdAt: new Date().toISOString() },
  { id: uuidv4(), customerName: 'Mohan Lal', phone: '9700112233', from: 'Prayagraj', to: 'Varanasi', date: '2026-04-28', time: '11:00', goodsType: 'Kheti', payment: 'UPI', note: 'Anaj hai 10 bori', status: 'pending', driverAssigned: null, createdAt: new Date().toISOString() },
  { id: uuidv4(), customerName: 'Geeta Singh', phone: '9812300011', from: 'Varanasi', to: 'Sonbhadra', date: '2026-04-28', time: '08:00', goodsType: 'Pashu', payment: 'Cash', note: '', status: 'pending', driverAssigned: null, createdAt: new Date().toISOString() },
  { id: uuidv4(), customerName: 'Raju Gupta', phone: '9988776655', from: 'Mirzapur', to: 'Prayagraj', date: '2026-04-30', time: '10:00', goodsType: 'Tin/Loha', payment: 'Cash', note: 'Tin sheet hai', status: 'done', driverAssigned: 'Suresh Yadav', createdAt: new Date().toISOString() },
];

let drivers = [
  { id: uuidv4(), name: 'Ramesh Kumar', phone: '9876100001', city: 'Varanasi', vehicle: 'Pickup (Badi)', vehicleNumber: 'UP65 AA 1111', range: 'UP ke andar', available: true },
  { id: uuidv4(), name: 'Suresh Yadav', phone: '9876100002', city: 'Mirzapur', vehicle: 'Pickup (Chhoti)', vehicleNumber: 'UP65 BB 2222', range: 'District ke andar', available: false },
  { id: uuidv4(), name: 'Anil Kumar', phone: '9876100003', city: 'Sonbhadra', vehicle: 'Truck', vehicleNumber: 'UP65 CC 3333', range: 'UP se bahar bhi', available: true },
  { id: uuidv4(), name: 'Vijay Patel', phone: '9876100004', city: 'Prayagraj', vehicle: 'Tempo', vehicleNumber: 'UP65 DD 4444', range: 'UP ke andar', available: true },
  { id: uuidv4(), name: 'Deepak Kumar', phone: '9876100005', city: 'Varanasi', vehicle: 'Pickup (Badi)', vehicleNumber: 'UP65 EE 5555', range: 'Local (50km)', available: false },
];

// ─── BOOKING ROUTES ───────────────────────────────────────────
app.get('/api/bookings', (_, res) => res.json([...bookings].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt))));

app.post('/api/bookings', (req, res) => {
  const { customerName, phone, from, to, date, time, goodsType, payment, note } = req.body;
  if (!customerName || !phone || !from || !to || !date) return res.status(400).json({ error: 'Required fields missing' });
  const b = { id: uuidv4(), customerName, phone, from, to, date, time: time||'09:00', goodsType: goodsType||'Saman', payment: payment||'Cash', note: note||'', status: 'pending', driverAssigned: null, createdAt: new Date().toISOString() };
  bookings.unshift(b);
  res.status(201).json(b);
});

app.patch('/api/bookings/:id/assign', (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.driverAssigned = req.body.driverName;
  b.status = 'confirmed';
  res.json(b);
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const b = bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  b.status = req.body.status;
  res.json(b);
});

app.delete('/api/bookings/:id', (req, res) => {
  const i = bookings.findIndex(x => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });
  bookings.splice(i, 1);
  res.json({ success: true });
});

// ─── DRIVER ROUTES ────────────────────────────────────────────
app.get('/api/drivers', (_, res) => res.json(drivers));
app.get('/api/drivers/free', (_, res) => res.json(drivers.filter(d => d.available)));

app.post('/api/drivers', (req, res) => {
  const { name, phone, city, vehicle, vehicleNumber, range } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const d = { id: uuidv4(), name, phone, city: city||'Mirzapur', vehicle: vehicle||'Pickup (Chhoti)', vehicleNumber: vehicleNumber||'', range: range||'Local (50km)', available: true };
  drivers.push(d);
  res.status(201).json(d);
});

app.patch('/api/drivers/:id/availability', (req, res) => {
  const d = drivers.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  d.available = req.body.available;
  res.json(d);
});

// ─── STATS ────────────────────────────────────────────────────
app.get('/api/stats', (_, res) => {
  const today = new Date().toISOString().split('T')[0];
  res.json({
    totalBookings: bookings.length,
    pending: bookings.filter(b => b.status==='pending').length,
    confirmed: bookings.filter(b => b.status==='confirmed').length,
    done: bookings.filter(b => b.status==='done').length,
    todayBookings: bookings.filter(b => b.date===today).length,
    totalDrivers: drivers.length,
    freeDrivers: drivers.filter(d => d.available).length,
    weekCommission: 3450,
    todayCommission: 720,
  });
});

// ─── SERVE FRONTEND ───────────────────────────────────────────
app.get('/{*path}', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Sanjeet Pickup Seva running at http://localhost:${PORT}`));
