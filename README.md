# 📝 MemoVault

A modern, full-stack note-taking application built with the MERN stack (MySQL, Express, React, Node.js). MemoVault provides a secure and intuitive platform for users to create, manage, and organize their notes with a rich text editor and responsive design.

![MemoVault](https://img.shields.io/badge/MemoVault-Note%20Taking%20App-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![React](https://img.shields.io/badge/React-19.1-blue)

## ✨ Features

### 🔐 Authentication System
- Secure user registration and login
- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Session management with automatic logout

### 📝 Note Management
- **Create** new notes with rich text formatting
- **Read** all notes in a beautiful card-based dashboard
- **Update** existing notes with a powerful editor
- **Delete** notes with confirmation
- Real-time search functionality to filter notes by title

### 🎨 Rich Text Editor
- Built with TipTap - a modern WYSIWYG editor
- Text formatting: **Bold**, *Italic*, <u>Underline</u>, ~~Strikethrough~~
- List support: Bullet points and numbered lists
- Clean, intuitive toolbar interface
- Placeholder text for better UX

### 📱 Responsive Design
- Mobile-first architecture
- Adaptive layouts for desktop and mobile devices
- Material UI components for consistent styling
- Smooth transitions and loading states

### 🛡️ Security Features
- CORS configuration for cross-origin requests
- SQL injection prevention with parameterized queries
- Input validation and sanitization
- Secure cookie handling
- Environment variable configuration

### 🧪 Testing & Quality
- Backend testing with Mocha, Chai, and Supertest
- Frontend testing with Jest and React Testing Library
- Code coverage reporting with NYC
- ESLint for code quality
- Comprehensive error handling

## 🏗️ Architecture

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MySQL connection pool configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── notesController.js # Notes CRUD operations
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── errorHandler.js    # Global error handling
│   │   └── loggerMiddleware.js # HTTP request logging
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   └── notesRoutes.js     # Notes endpoints
│   ├── tests/                 # Backend test suites
│   ├── utils/
│   │   └── logger.js          # Pino logger configuration
│   └── app.js                 # Express app setup
├── server.js                  # Server entry point
└── package.json
```

### Frontend Structure
```
frontend/MemoryVault/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation header with search
│   │   ├── NoteCard.jsx       # Note display card
│   │   ├── header.css
│   │   └── notecard.css
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── signIn.jsx     # Login page
│   │   │   ├── signUp.jsx     # Registration page
│   │   │   └── Auth.css
│   │   ├── dashboard/
│   │   │   ├── dashboard.jsx  # Notes dashboard
│   │   │   └── Dashboard.css
│   │   └── note-editor/
│   │       ├── note_editor.jsx # Rich text editor
│   │       └── NoteEditor.css
│   ├── config/
│   │   └── api.js             # API configuration
│   ├── __tests__/             # Frontend test suites
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
└── package.json
```

## 🔧 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Pino** - Structured logging
- **CORS** - Cross-origin resource sharing
- **cookie-parser** - Cookie parsing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material UI (MUI)** - Component library
- **TipTap** - Rich text editor
- **React Router** - Client-side routing
- **React Toastify** - Toast notifications
- **DOMPurify** - XSS protection

### Development & Testing
- **Nodemon** - Auto-restart dev server
- **ESLint** - Code linting
- **Mocha & Chai** - Backend testing
- **Jest & React Testing Library** - Frontend testing
- **NYC** - Code coverage

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Health
- `GET /health` - Database health check

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HamzaAnis67/hamzaanis-mern-10pshine.git
cd hamzaanis-mern-10pshine
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=memoryvault
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

4. **Database Setup**
Create a MySQL database named `memoryvault` and run the following SQL:
```sql
CREATE TABLE user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_credentials(id) ON DELETE CASCADE
);
```

5. **Frontend Setup**
```bash
cd ../frontend/MemoryVault
npm install
```

6. **Configure Frontend API**
Create a `.env` file in the `frontend/MemoryVault` directory:
```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Start the Backend**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

**Start the Frontend**
```bash
cd frontend/MemoryVault
npm run dev
```
The frontend will run on `http://localhost:5173`

### Running Tests

**Backend Tests**
```bash
cd backend
npm test                # Run tests
npm run test:coverage   # Run with coverage
```

**Frontend Tests**
```bash
cd frontend/MemoryVault
npm test                # Run tests
npm run test:coverage   # Run with coverage
```

## 🎯 Usage

1. **Sign Up** - Create a new account at `/signup`
2. **Login** - Access your account at `/login`
3. **Dashboard** - View all your notes on the dashboard
4. **Create Note** - Click "Create New Note" to open the editor
5. **Edit Note** - Click on any note card to edit it
6. **Search** - Use the search bar to filter notes by title
7. **Delete** - Delete notes from the editor

## 🔐 Security Considerations

- Passwords are hashed using bcrypt with salt rounds
- JWT tokens are stored in httpOnly cookies
- CORS is configured to allow only specified origins
- SQL injection prevention through parameterized queries
- Input validation on all endpoints
- Environment variables for sensitive data
- XSS protection with DOMPurify

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Hamza Anis**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository or contact the author.

---

Built with ❤️ using the MERN stack 
