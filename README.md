# TaskFlow — Kanban Task Board (MERN)

A Trello-style drag-and-drop task management board built with the MERN stack. Users can create boards, add lists (columns), create cards (tasks), and reorder them via drag-and-drop — all persisted to MongoDB.

## Features
- JWT authentication (register/login)
- Create multiple boards per user
- Each board has lists (e.g. To Do, In Progress, Done)
- Cards can be created, edited, deleted, and dragged between lists
- Drag-and-drop reordering persisted to the backend (list + position)
- Card details: title, description, due date, priority label

## Tech Stack
**Frontend:** React, react-beautiful-dnd (drag-and-drop), Axios, Context API
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT

## Project Structure
```
kanban-board-mern/
├── backend/
│   ├── models/ (User, Board, List, Card)
│   ├── routes/ (auth, boards, lists, cards)
│   ├── middleware/auth.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/ (Login, Register, BoardsHome, BoardView)
        ├── components/ (List, Card, CardModal)
        └── context/ (AuthContext)
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev     # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start        # http://localhost:3000
```

## Data model
- **Board** belongs to a User, has many Lists.
- **List** belongs to a Board, has an `order` field and many Cards.
- **Card** belongs to a List, has an `order` field for position within the list, plus title/description/priority/dueDate.

Drag-and-drop updates call `PATCH /api/cards/:id/move` with the target `listId` and new `order`, and the backend re-normalizes order values for both the source and destination lists.

## Resume Bullet Points (suggested)
- Built a Trello-style Kanban board with drag-and-drop task management using react-beautiful-dnd, backed by a REST API and MongoDB.
- Designed a nested data model (Boards → Lists → Cards) with order-based positioning to support real-time drag-and-drop reordering.
- Implemented optimistic UI updates on drag-and-drop with rollback on API failure for a smooth user experience.
# taskflow
