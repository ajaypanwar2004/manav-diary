# Manav Diary

A full-stack personal poetry website where only admin can add and approve poetry.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Project Structure

```
manav-diary/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://url

# JWT Secret for authentication
JWT_SECRET=Secretcode

# Server Port
PORT=5000

# Admin Credentials (optional - defaults shown)
ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
```

**Important Notes:**
- Replace the `MONGO_URI` with your actual MongoDB Atlas connection string
- If your password contains special characters (like `@`), URL encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - etc.
- Make sure your MongoDB Atlas IP whitelist allows connections from your IP (or use `0.0.0.0/0` for all IPs during development)

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional, defaults to localhost:5000):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Features

### Frontend
- **Home Page**: Beautiful landing page with intro and social media links
- **Category Pages**: Individual pages for Sad, Romantic, Broken, Mother, and Love poetry
- **Admin Login**: Secure authentication for admin users
- **Admin Dashboard**: 
  - Add new poetry with category selection and date picker
  - Poetry posted by admin is automatically approved and appears immediately
  - View and approve pending poetry (if any)
- **Responsive Design**: Mobile-friendly UI with poetic theme
- **Animations**: Smooth fade-in and slide-up animations

### Backend
- **Poetry Management**: CRUD operations with category and approval system
- **Admin Authentication**: JWT-based secure login with protected routes
- **Category Filtering**: Filter poetry by category (only approved poetry shown publicly)
- **Auto-Approval**: Poetry posted by admin is automatically approved and appears immediately

## Default Admin Credentials

- Email: `email`
- Password: `password`

**Note**: Change these credentials in production by updating the `.env` file before first run.

## API Endpoints

### Public Endpoints

- `GET /api/poetry/:category` - Get approved poetry by category (sad, romantic, broken, mother, love)

### Admin Endpoints (Protected)

- `POST /api/auth/login` - Admin login (email & password)
- `POST /api/admin/add-poetry` - Add new poetry (automatically approved when posted by admin)
- `GET /api/admin/pending-poetry` - Get all pending poetry
- `PUT /api/admin/approve-poetry/:id` - Approve poetry

## Poetry Categories

- **Sad Poetry** (`/sad`)
- **Romantic Poetry** (`/romantic`)
- **Broken Poetry** (`/broken`)
- **Mother Poetry** (`/mother`)
- **Love Poetry** (`/love`)

## Development

- Backend uses nodemon for auto-restart during development
- Frontend uses Vite for fast development with HMR
- Tailwind CSS for styling with custom poetic fonts

## License

ISC

