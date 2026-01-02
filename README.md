[🇺🇸 English](README.md) | [🇺🇦 Українською](README.ua.md)

# Travellers App API

Travellers App is a backend service for an application designed for travelers who want to share their stories. The project is built using Node.js, Express.js, MongoDB, and JWT authentication.

## 🚀 Features

- **User authentication:** registration, login, logout.
- **Google OAuth:** fast login via Google.
- **Password recovery:** via email using a JWT token.
- **Profile management:** get and update user data, upload/delete avatar.
- **Stories management:** create, read, update, and delete stories.
- **Filtering, sorting, pagination:** for stories and users.
- **Saved stories:** add/remove stories, likes counter.
- **Categories:** get list of categories and assign them to stories.
- **File uploads:** photos for stories and avatars (Cloudinary or local storage).
- **Protected routes:** token-based access control.
- **Data validation:** protection against invalid input (Joi).
- **Security:** XSS protection, injection protection, MongoDB transactions.
- **Logging:** implemented with pino-http.

## 🛠 Technologies

- **Node.js** — server-side platform
- **Express.js (v5.1.0)** — API framework
- **MongoDB / Mongoose (v9.0.0)** — database
- **JWT** — authentication
- **Bcrypt** — password hashing
- **CORS** — cross-origin resource sharing
- **Joi (v18.0.2)** — data validation
- **Cloudinary** — file storage
- **Multer** — file uploads
- **Nodemailer** — email sending
- **Helmet** — HTTP headers security
- **Swagger UI** — API documentation
- **Dotenv** — environment variables
- **Pino** — logging
- **Redocly** — documentation generation
- **ESLint** — code quality checks
- **Nodemon** — automatic server restart in development

## 📁 Структура проєкту

```
├── docs/                 # OpenAPI documentation (Swagger)
├── node_modules/         # npm dependencies
├── src/                  # Main source folder
│   ├── constants/        # Constants (JWT lifetimes, SMTP config, etc.)
│   ├── controllers/      # Controllers — request handling logic
│   ├── db/               # Database connection
│   │   ├── models/       # Mongoose models (User, Story, Category)
│   ├── middlewares/      # Middlewares — validation, auth, logging
│   ├── routers/          # API routes (auth, stories, users)
│   ├── services/         # Business logic (auth.js, stories.js, users.js)
│   ├── templates/        # Email templates (e.g. reset-password-email.html)
│   ├── utils/            # Helper functions (getEnvVar, sendMail, pagination helpers, etc.)
│   ├── validation/       # Joi validation schemas
│   ├── index.js          # App initialization
│   └── server.js         # Main server file
├── swagger/              # OpenAPI files (components, paths, schemas)
│   ├── components/
│   ├── responses/
│   ├── schemas/
│   └── paths/
│       ├── auth/
│       │   └── google/
│       ├── stories/
│       └── users/
├── temp/                 # Temporary files (may be unused)
├── uploads/              # Local file storage (if Cloudinary is not used)
```

## 📚 API Documentation

Full API documentation with request and response examples is available here: [Swagger UI →](https://travellers-backend.onrender.com/api-docs/)

## 🔍 Functional Details

- **Authentication:** registration, login, logout, Google OAuth, password recovery.
- **Sessions:** JWT tokens, automatic refresh, token invalidation on logout.
- **Users:** list retrieval (filtering by name), search, sorting, pagination, profile access, avatar upload/delete, saved stories.
- **Stories:** create, update, delete, filtering (by owner(s), category/categories), search, sorting, pagination.
- **Files:** upload story images and avatars, stored in Cloudinary or locally.
- **Security:** Joi validation, MongoDB transactions, XSS protection, protected routes.
- **Categories:** retrieve category list and assign to stories.
- **Saved stories:** add/remove stories, favorites counter.

## 🧪 Local Setup

**1. Clone the repository:**

```
bash

git clone https://github.com/Developer-Mykhailo/travellers-backend.git
```

**2. Install dependencies:**

```
bash

npm install
```

**3. Create a .env file based on .env.example:**

```
env

PORT=3000
MONGODB_URI=...
JWT_SECRET=...
CLOUDINARY_URL=..
```

**4. Run the server:**

- Production:

```
bash

npm start
```

- Development:

```
bash

npm run dev
```

## 🧹 Additional Commands

- **npm run lint** — check code quality with ESLint
- **npm run build-docs** — generate OpenAPI JSON
- **npm run preview** — preview documentation locally (Redocly)

## ✅ Roadmap

- Story comments
- Likes / dislikes system

## 📬 Contact

If you have any questions, feel free to contact: developer.mykhailo@gmail.com
