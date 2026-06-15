# StudyFlow

StudyFlow is a full stack portfolio project that helps students create personalized study schedules using AI-inspired planning logic. It combines deadline-aware scheduling, task tracking, Pomodoro sessions, reminders, analytics, and JWT-based authentication in a clean monorepo.

## Tech Stack

- Frontend: Next.js App Router, React, Tailwind CSS, Recharts
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT, bcryptjs
- Deployment targets: Vercel for frontend, Render for backend

## Features

- JWT authentication with signup, login, logout, and profile retrieval
- Subject management with exam dates, priority, target hours, confidence, and difficulty
- AI-based study plan generation using deadlines, available hours, and subject priority
- Task board with completion tracking and daily progress logging
- Weekly analytics charts and time-spent-per-subject insights
- Pomodoro timer for focused study sessions
- Daily reminder system for pending goals
- Dark mode support
- Calendar-style plan view
- Export study plan as PDF through browser print flow
- Gamification through streaks and achievements
- Weak subject suggestions based on confidence and urgency

## Project Structure

```text
AI study Planner/
├── client/
│   ├── app/
│   │   ├── analytics/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── planner/
│   │   ├── settings/
│   │   ├── signup/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   ├── lib/
│   ├── .env.local.example
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── deployment-guide.md
│   ├── portfolio-description.md
│   └── screenshots.md
├── .gitignore
└── package.json
```

## Database Schemas

### User

- `name`
- `email`
- `password`
- `studyHoursPerDay`
- `darkMode`
- `streak`
- `achievements`

### Subject

- `user`
- `name`
- `priority`
- `examDate`
- `weeklyTargetHours`
- `difficulty`
- `currentConfidence`
- `color`

### StudyTask

- `user`
- `subject`
- `title`
- `plannedDate`
- `durationMinutes`
- `priorityScore`
- `status`
- `source`
- `pomodorosPlanned`
- `notes`

### Progress

- `user`
- `subject`
- `task`
- `date`
- `minutesStudied`
- `pomodoroSessions`
- `completedTasks`

## API Overview

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Subjects

- `GET /api/subjects`
- `POST /api/subjects`
- `PUT /api/subjects/:id`
- `DELETE /api/subjects/:id`

### Planner

- `GET /api/planner`
- `POST /api/planner/generate`
- `PATCH /api/planner/tasks/:id`

### Progress

- `GET /api/progress/today`
- `POST /api/progress/session`

### Analytics

- `GET /api/analytics/summary`

### Profile and Notifications

- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/notifications/daily`

## AI Study Planning Logic

The planning service generates a timetable by combining:

- Number of subjects
- Exam deadlines and days remaining
- Daily available study hours
- Priority levels
- Subject difficulty and confidence
- Spacing logic to avoid clustering the same subject repeatedly

Each subject gets a weighted score. The engine then allocates 25-90 minute study blocks across the planning horizon while keeping the timetable balanced and urgency-aware.

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the examples:

```bash
copy server\.env.example server\.env
copy client\.env.local.example client\.env.local
```

Update the values as needed.

### 3. Start MongoDB

Use a local MongoDB instance or MongoDB Atlas. Set `MONGODB_URI` accordingly.

### 4. Run the app

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

## Deployment

See [docs/deployment-guide.md](docs/deployment-guide.md) for a Vercel + Render deployment flow.

## Portfolio Positioning

This project demonstrates:

- Full stack architecture in a production-style monorepo
- REST API design with authentication and protected routes
- Applied planning logic instead of static CRUD-only behavior
- Data visualization and workflow-oriented UI design
- Real-world deployability with separate frontend and backend services

## Screenshots

Add screenshots to the repository and document them in [docs/screenshots.md](docs/screenshots.md).

## Future Improvements

- Integrate a real LLM provider for natural-language study advice
- Add email or push notifications
- Support recurring tasks and collaborative study groups
- Add automated test coverage for planner heuristics and API routes
