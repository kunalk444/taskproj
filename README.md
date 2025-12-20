# Task Management Platform (Full Stack)

A full-stack task and team management application built with modern JavaScript and TypeScript.  
The application supports authentication, task collaboration, real-time notifications, and structured backend architecture.

---

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- TanStack React Query
- Socket.IO Client

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication (HttpOnly cookies)

---

## Core Features

### Authentication
- User signup and login
- Password hashing using bcrypt
- JWT-based session management with HttpOnly cookies
- Protected routes using authentication middleware

### Task Management
- Create, read, update tasks
- Task attributes:
  - Title
  - Description
  - Due date
  - Priority (Low, Medium, High, Urgent)
  - Status (To Do, In Progress, Review, Completed)
  - Assigned by
  - Assigned to (user or email fallback)

### Real-Time Collaboration
- Socket.IO integration
- Real-time notifications for:
  - Task assignment
  - Task status or priority changes
- User-specific socket rooms
- Events emitted only after successful database operations

### Dashboard
- View tasks assigned to the user
- View tasks created by the user
- Sorting by due date or priority
- Task detail modal with live updates

---

## Project Structure

backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── services/
│ │ └── socket.ts
│ ├── index.ts
│ └── ...
frontend/
├── src/
│ ├── components/
│ ├── reduxfolder/
│ ├── socket.ts
│ └── ...


---

## Backend Architecture

- Routes handle HTTP concerns only
- Controllers handle request logic
- Services handle business logic
- Mongoose models manage database schema
- Socket.IO is initialized once and accessed safely using a getter
- Auth middleware protects task routes

---

## Socket.IO Design

- Socket server initialized with the HTTP server
- Client connects only after authentication
- Each user joins a room based on their user ID
- Events:
  - `task-assigned`
  - `task-updated`
- Backend emits socket events only after successful DB updates
- Frontend listens globally and updates UI state

---


---

## Running the Project Locally

### Backend
```bash
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

API Endpoints (Key)
Authentication
POST /auth/signup
POST /auth/login
GET /auth/verifyuser

Tasks

POST /tasks/createtask
GET /tasks/metainfo
GET /tasks/metainfoassignedbyme
GET /tasks/getinsidetask
PATCH /tasks/changepriorityorstatus


