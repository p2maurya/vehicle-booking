# 🚐 Sanjeet Pickup Seva

Full-stack Node.js + Express booking app with mobile-first frontend.

## Setup & Run

```bash
# 1. Dependencies install karein
npm install

# 2. Server start karein
node server.js

# 3. Browser mein kholo
# http://localhost:4000
```

## Apna Number Daalna

`public/index.html` mein line dhundho:
```js
const OWNER_PHONE = '9999999999'; // <<< Yahan apna number daalo
```

Aur HTML mein `href="tel:+919999999999"` ko apne number se replace karein.

## Deploy (Free - Railway.app)

1. railway.app pe free account banao
2. GitHub pe yeh folder upload karo
3. Railway mein "Deploy from GitHub" karo
4. Automatically live ho jaayega!

## Portals

- 🙋 **Customer** - Booking form, Call/WhatsApp button
- 🚐 **Gadi Wala** - Availability toggle, Trip management  
- 🛡️ **Admin** - Saari bookings, Free drivers, Assign, Commission

## API Endpoints

- `GET /api/bookings` - Saari bookings
- `POST /api/bookings` - Nayi booking
- `PATCH /api/bookings/:id/assign` - Driver assign karo
- `PATCH /api/bookings/:id/status` - Status update
- `DELETE /api/bookings/:id` - Delete
- `GET /api/drivers` - Saare drivers
- `GET /api/drivers/free` - Free drivers
- `POST /api/drivers` - Naya driver register
- `PATCH /api/drivers/:id/availability` - Availability toggle
- `GET /api/stats` - Dashboard stats
