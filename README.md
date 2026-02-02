# GameNight Organizer 

I built this because coordinating game nights with friends across different timezones was driving me crazy. Someone would always show up an hour late because they did the timezone math wrong at 2am. So I made this tool to handle all that automatically.

## What it does

- **Smart timezone handling** - Shows everyone the event time in their local timezone. No more "wait, is that 8pm YOUR time or MY time?"
- **Event dashboard** - See all your upcoming game nights, who's coming, and manage everything in one place
- **Create events easily** - Multi-step wizard that walks you through setting up a game night
- **Analytics** - Track your gaming habits, see which games are most popular, find the best times for your squad
- **Real-time chat** - Talk with your squad in event chat rooms
- **User authentication** - JWT-based auth with secure password hashing

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for blazing fast dev experience
- Tailwind CSS for styling (with custom playful theme)
- Framer Motion for smooth animations
- Recharts for the analytics charts
- Socket.io client for real-time features

### Backend
- Node.js + Express.js (TypeScript)
- PostgreSQL for data storage
- Redis for caching
- Socket.io for WebSocket connections
- JWT + bcrypt for authentication
- Go microservice for timezone conversions

## Quick Start (Docker)

The easiest way to run everything:

```bash
# Clone and start all services
docker-compose up -d

# Frontend: http://localhost:3000
# API: http://localhost:3001
# Timezone service: http://localhost:8081
```

## Development Setup

### Frontend Only

```bash
cd frontend/react-dashboard
npm install
npm run dev
```

### Backend API

```bash
cd backend/nodejs-api-gateway
npm install
cp .env.example .env
npm run dev
```

### Full Stack (Manual)

1. Start PostgreSQL and Redis (or use Docker)
2. Run database migrations
3. Start the Go timezone service
4. Start the Node.js API
5. Start the React frontend

## Project Structure

```
gamenight-organizer/
├── frontend/
│   └── react-dashboard/     # React frontend
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── pages/       # Route pages
│       │   ├── context/     # React context (auth)
│       │   └── lib/         # API client, socket
│       └── ...
├── backend/
│   ├── nodejs-api-gateway/  # Main API server
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Auth, validation
│   │   │   └── websocket/   # Socket.io handler
│   │   └── ...
│   ├── go-timezone-service/ # Timezone microservice
│   └── database/
│       ├── migrations/      # SQL migrations
│       └── seeds/           # Sample data
└── docker-compose.yml
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List user's events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event

### Analytics
- `GET /api/analytics/dashboard` - Combined analytics data

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/gamenight
REDIS_HOST=localhost
JWT_SECRET=your-secret-key
```

## TODO

- [ ] Add Google Calendar export
- [ ] Discord bot integration
- [ ] Email notifications
- [ ] Mobile app version

## Contributing

Feel free to open issues or PRs. This started as a personal project but happy to make it better.

---

Made with 🎮 for gamers who hate timezone math
=======

