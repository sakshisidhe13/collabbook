# 📖 CollabBook

> A real-time collaborative journaling platform that allows users to create, organize, and collaboratively edit journal entries with friends using Socket.io.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io)
![License](https://img.shields.io/badge/License-MIT-blue)



# 📌 Overview

CollabBook is a full-stack collaborative journaling application that enables users to securely create, organize, and manage personal journal entries while collaborating with friends in real time.

The application combines secure authentication, responsive design, and WebSocket-powered live collaboration to provide a seamless multi-user editing experience.


# ✨ Features

📓 Journal Management

- Create journal entries
- Edit existing entries
- Delete journal entries
- Organize entries efficiently
- Responsive user interface


🤝 Real-Time Collaboration

- Invite friends to collaborate
- Simultaneous editing using Socket.io
- Live synchronization across connected users
- Instant updates without page refresh
- Conflict-free collaborative editing

 🔐 Authentication & Security

- JWT Authentication
- HTTP-only Cookies
- Protected Routes
- Secure user sessions
- Authorization middleware

👥 User Management

- User Registration
- Secure Login & Logout
- Profile management
- Friend-based collaboration


# 🛠 Tech Stack

Frontend

- React.js
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Router
- Vite

 Backend

- Node.js
- Express.js
- REST APIs
- Socket.io
- JWT Authentication

Database

- MongoDB
- Mongoose

Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas



# 🏗️ Architecture

```text
React (Frontend)
        │
        ▼
Redux Toolkit + RTK Query
        │
        ▼
Express REST API
        │
        ▼
Authentication (JWT)
        │
        ▼
Socket.io Server
        │
        ▼
MongoDB (Mongoose)
```



# 📂 Project Structure

```text
CollabBook/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── features/
│   ├── hooks/
│   └── services/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   └── config/
│
├── README.md
└── .gitignore
```


# 🚀 Getting Started

1. Clone the Repository

```bash
git clone https://github.com/sakshisidhe13/collabbook.git

cd collabbook
```

2. Install Dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

3. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
MONGO_URI=

JWT_SECRET=

CLIENT_URL=

PORT=5000
```

Create a `.env` file inside the **frontend** folder.

```env
VITE_API_URL=
```

4. Start the Application

Backend

```bash
cd backend
npm run dev
```

Frontend

```bash
cd frontend
npm run dev
```


# 🚀 Future Improvements

- Rich text editor
- Collaborative comments
- Version history
- Entry restoration
- Notifications
- User presence indicators
- Offline support
- Search and filtering
- Dark mode
- End-to-end encryption


# 👩‍💻 Author

**Sakshi Sidhe**

- GitHub: https://github.com/sakshisidhe13
- LinkedIn: *(Add your LinkedIn profile)*

---

# 📄 License

This project is licensed under the MIT License.
