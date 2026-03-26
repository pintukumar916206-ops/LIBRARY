# Library & Manga Management System

A full-stack web application designed to streamline the process of managing, borrowing, and tracking books and manga. Built with the MERN stack (MongoDB, Express, React, Node.js), this project offers a robust solution for both administrators and regular users.

## Key Features

- **User Authentication:** Secure signup and login system with role-based access control (Admin/User).
- **Book & Manga Catalog:** A clean interface to browse and search for titles.
- **Borrowing System:** Automated tracking of borrowed items with due date management.
- **Admin Dashboard:** Comprehensive tools for managing the collection, users, and borrowing records.
- **Smart Notifications:** Automated email alerts for upcoming or overdue returns using Cron jobs.
- **Image Support:** Integrated with Cloudinary for seamless cover image uploads.
- **Responsive Design:** Fully fluid UI built with Tailwind CSS and Framer Motion for smooth animations.

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js, Mongoose (MongoDB).
- **Services:** Cloudinary (Images), Nodemailer (Emails), Node-Cron (Scheduled Tasks).
- **Security:** JWT, Bcrypt, Helmet, Express Rate Limit.

## Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites

- Node.js installed (v16 or higher recommended)
- MongoDB account or local instance
- Cloudinary account for image hosting

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Backend Setup:**
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `npm install`
   - Create a `config/config.env` file and add the following:
     ```env
     PORT=4000
     FRONTEND_URL=http://localhost:5173
     MONGO_URL=<your-mongodb-connection-string>
     SMTP_HOST=smtp.gmail.com
     SMTP_SERVICE=gmail
     SMTP_PORT=465
     SMTP_MAIL=<your-email>
     SMTP_PASSWORD=<your-app-password>
     JWT_SECRET_KEY=<your-secret-key>
     JWT_EXPIRE=7d
     COOKIE_EXPIRE=7
     CLOUDINARY_CLOUD_NAME=<your-cloud-name>
     CLOUDINARY_API_KEY=<your-api-key>
     CLOUDINARY_API_SECRET=<your-api-secret>
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory: `cd ../frontend`
   - Install dependencies: `npm install`
   - Create a `.env` file and add:
     ```env
     VITE_API_URL=http://localhost:4000
     ```

### Running the Application

1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

The application should now be accessible at `http://localhost:5173`.

## Troubleshooting

- **MongoDB Connection:** If the server fails to start, double-check your `MONGO_URL` in the `config.env` file.
- **Email Notifications:** Ensure you are using an App Password if using Gmail as your SMTP service.
- **Images Not Loading:** Verify your Cloudinary credentials are correct and that you have an active internet connection.

## Development

- **Tailwind CSS:** Styles are managed in the `frontend/src/index.css` and via utility classes.
- **State Management:** Redux Toolkit is used for global state (auth, books, etc.).
- **Backend Services:** Check the `backend/services` folder for notification and cleanup logic.

---

Built with care for a better reading experience.
