# StreamVault 🎬

StreamVault is a premium, full-stack movie and TV show exploration platform. It provides users with a seamless experience to discover trending content, search for their favorite actors, and manage their personal watchlists. Built with a modern tech stack, it features a highly responsive and visually stunning UI.

---

## ✨ Features

### 🔍 Discovery & Search
- **Trending & Popular**: Real-time content updates from TMDB API for Movies and TV Shows.
- **Advanced Search**: Debounced search functionality for movies, shows, and people.
- **Detailed Filmography**: Comprehensive credits pages for actors and crew members with interactive movie cards.

### 👤 User Experience
- **Biographies**: Expandable/collapsible actor biographies with a custom scrollable interface on desktop.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewports.
- **Glassmorphism UI**: Modern aesthetic with blur effects, vibrant accents, and smooth animations.

### 🔐 Authentication & Personalization
- **Secure Auth**: JWT-based authentication system for user sign-up and login.
- **Interactions**: Like movies and add them to your personalized Favorites list.
- **Watch History**: Automatically tracks your viewed content for quick access.

### 🛠 Admin Dashboard
- **Content Management**: Admins can add, edit, or remove movie entries directly from the dashboard.
- **User Moderation**: Capability to view and moderate the user base.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit (RTK)
- **Styling**: SCSS (Sass) with Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Routing**: React Router Dom v7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT & Bcryptjs
- **Middleware**: CORS, Dotenv, Auth Guards

---

## 📁 Project Structure

```bash
StreamVault/
├── backend/                # Express.js Server
│   ├── src/
│   │   ├── controllers/    # API Request Handlers
│   │   ├── models/         # MongoDB Schemas
│   │   ├── routes/         # API Route Definitions
│   │   ├── middlewares/    # Auth & Admin Guards
│   │   └── server.js       # Entry Point
│   └── .env                # Backend Configuration
├── frontend/               # React (Vite) Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── features/       # Redux Slices & Logic
│   │   ├── pages/          # Full-page Views
│   │   ├── styles/         # Global SCSS Mixins & Tokens
│   │   ├── utils/          # API Helpers (TMDB)
│   │   └── App.jsx         # Main Component
│   └── .env                # Frontend Configuration
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [TMDB API Key](https://www.themoviedb.org/documentation/api)

### 1. Clone the Repository
```bash
git clone https://github.com/mannatgupta146/StreamVault.git
cd StreamVault
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```
Run the frontend:
```bash
npm run dev
```

---

## 🤝 Contributing to StreamVault

We love your input! We want to make contributing to StreamVault as easy and transparent as possible.

### Development Workflow

1.  **Fork the repo** and create your branch from `main`.
2.  **Branch Naming Convention**:
    - `feat/feature-name` for new features.
    - `fix/bug-name` for bug fixes.
    - `docs/changes` for documentation.
3.  **Implement your changes**:
    - Follow the existing SCSS design tokens.
    - Keep React components functional and use hooks.
4.  **Commit Messages**: Use descriptive commit messages (e.g., `feat: add scrollable bio to person credits`).
5.  **Submit a Pull Request**: Describe your changes in detail and provide screenshots for UI updates.

### Code Standards
- Use **Prettier** for code formatting.
- Follow **ESLint** rules (run `npm run lint` in frontend).
- Maintain **Semantic HTML** and accessibility (Aria-labels, alt text).

---

## 💎 Design Tokens
- **Background**: `#0b0c10`
- **Primary Accent**: `#66fcf1` (Neon Cyan)
- **Secondary Accent**: `#9b59b6` (Neon Purple)
- **Cards/Surface**: `#1f2833`
- **Typography**: Inter / Roboto

---

## 🔮 Future Roadmap
- [ ] **Movie Recommendations**: Integration of AI-based content suggestions.
- [ ] **Social Features**: Friend lists and shared watchlists.
- [ ] **Reviews & Ratings**: User-generated reviews for improved community engagement.
- [ ] **Performance Optimization**: SSR Support with Next.js migration for better SEO.

---