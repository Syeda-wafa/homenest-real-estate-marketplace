# 🏡 HomeNest – Real Estate Marketplace

HomeNest is a full-stack **MERN Real Estate Marketplace** that allows users to explore, search, save, and manage property listings through a modern and responsive web interface.

---

## 🌐 Live Demo

**Live Application:**
https://homenest-frontend.vercel.app/

**Backend API:**
https://homenest-backend.vercel.app/

> The application is deployed on Vercel with MongoDB Atlas for database management and Cloudinary for property image storage.

---

## ✨ Features

* 🔐 User Registration & Login
* 🛡️ JWT Authentication & Protected Routes
* 🏠 Browse Property Listings
* 🔎 Search, Filter & Sort Properties
* 📄 Property Details & Image Gallery
* ➕ Add New Properties
* ✏️ Edit Properties
* 🗑️ Delete Properties
* ❤️ Save & Remove Favorite Properties
* 👤 User Profile Management
* ⚙️ Account Settings
* 📊 User Dashboard
* 📱 Responsive Design
* 🔔 Toast Notifications
* ⚠️ Loading, Error & Empty States

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Redux Toolkit
* Axios
* CSS3
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* dotenv
* CORS
* Helmet
* Morgan
* Multer

### Cloud Services

* MongoDB Atlas
* Cloudinary
* Vercel

---

## 📁 Project Structure

```text
HomeNest/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Syeda-wafa/homenest-real-estate-marketplace.git
cd HomeNest
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 Main Routes

### Public Routes

| Route             | Description       |
| ----------------- | ----------------- |
| `/`               | Home Page         |
| `/login`          | User Login        |
| `/register`       | User Registration |
| `/properties`     | Browse Properties |
| `/properties/:id` | Property Details  |

### Protected Routes

| Route                | Description               |
| -------------------- | ------------------------- |
| `/dashboard`         | User Dashboard            |
| `/profile`           | User Profile              |
| `/my-properties`     | User's Property Listings  |
| `/add-property`      | Add New Property          |
| `/edit-property/:id` | Edit Property             |
| `/saved-properties`  | Saved/Favorite Properties |
| `/settings`          | Account Settings          |

---

## 🌐 API Endpoints

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Properties

```text
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
```

### Favorites

```text
GET    /api/favorites
POST   /api/favorites/:propertyId
DELETE /api/favorites/:propertyId
DELETE /api/favorites/clear
```

### User Profile

```text
GET    /api/users/profile
PUT    /api/users/profile
```

---

## 🧪 Testing

The application was manually tested across the main modules, including:

* Authentication
* Dashboard
* Property Listing
* Property Details
* Add Property
* Edit Property
* Delete Property
* My Properties
* Saved Properties
* Profile
* Settings
* Protected Routes
* Search & Filters
* Responsive UI
* Error & Empty States
* Property Image Uploads

---

## 🔒 Security

HomeNest implements several security practices:

* JWT-based authentication
* Protected frontend routes
* Backend authentication middleware
* Password hashing with bcrypt
* Environment variables for sensitive configuration
* Helmet security middleware
* CORS configuration
* Cloudinary-based image storage
* Multer memory storage for image uploads

> ⚠️ **Important:** Never commit `.env` files, passwords, JWT secrets, Cloudinary credentials, or MongoDB credentials to GitHub.

---

## 📌 Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

For production, `VITE_API_URL` should point to the deployed backend:

```text
https://homenest-backend.vercel.app/api
```

Make sure `.env` is included in `.gitignore`:

```text
.env
node_modules/
uploads/
```

---

## ☁️ Deployment

HomeNest is deployed using:

* **Frontend:** Vercel
* **Backend:** Vercel
* **Database:** MongoDB Atlas
* **Image Storage:** Cloudinary

### Production URLs

**Frontend:**
https://homenest-frontend.vercel.app/

**Backend:**
https://homenest-backend.vercel.app/

---

## 📌 Project

**HomeNest – Real Estate Marketplace**

A full-stack MERN application built to provide a modern platform for discovering, managing, and saving real estate properties.

---

