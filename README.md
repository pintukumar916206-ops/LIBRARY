# Library Management System

A library management app for tracking books, managing borrowing, and keeping track of who owes money. Simple, works well, and doesn't overthink things.

## What This Does

- **User accounts** - Sign up, verify your email, log in. Pretty standard stuff.
- **Browse books** - See what's in the library, search by title or author
- **Borrow books** - Take out books for 8 days. Forget to return it? System tracks fines automatically (₹0.1 per hour overdue)
- **Admin dashboard** - Add books, manage users, see who has what
- **Email notifications** - Get reminders about due dates
- **Image uploads** - Book covers stored properly on Cloudinary

It just works. No unnecessary complexity.

## Tech Stack

**Frontend**

- React 18, Redux Toolkit
- Tailwind CSS (responsive design)
- React Router, Axios
- Framer Motion (animations)
- Vite (fast builds)

**Backend**

- Node.js + Express
- MongoDB (data storage)
- JWT authentication + bcrypt
- Cloudinary (image hosting)
- Winston (logging)
- Jest (tests)

## Getting Started

### What You Need

- Node 20+
- MongoDB (local or Atlas)
- Cloudinary account (free)
- Gmail account

### Installation

```bash
# Clone and navigate
git clone <repo-url>
cd 02.SAAS_PROJECT

# Backend
cd backend
cp .env.example .env
# Edit .env with your real credentials
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. You're good to go.

## Setting Up .env

Copy from `.env.example` and fill in:

```bash
PORT=4000
MONGO_URL=mongodb://localhost:27017
FRONTEND_URL=http://localhost:5173

# Gmail - use App Password (Settings > Security > App Passwords)
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password

# Generate a random string for this
JWT_SECRET_KEY=make_this_random_and_long

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_account_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

LOG_LEVEL=info
NODE_ENV=development
```

## Testing

```bash
npm test              # Run once
npm run test:watch    # Keep it running while you work
npm run test:coverage # See what's covered
```

We test the important validation and fine calculation logic.

## How It Works

**As a user:**

1. Create account, verify email
2. Browse library
3. Click to borrow a book (get 8 days)
4. Return when done or pay fines

**As an admin:**
Do everything above plus:

- Add/edit/delete books
- See all borrow records
- Manage user accounts
- Check dashboard stats

## API Endpoints

**Auth**

- `POST /api/v1/auth/register` → New account
- `POST /api/v1/auth/login` → Log in
- `GET /api/v1/auth/logout` → Log out

**Books**

- `GET /api/v1/bookandmanga/all?page=1&limit=20` → List books
- `POST /api/v1/bookandmanga/add` → Add new book (admin)
- `PUT /api/v1/bookandmanga/update/:id` → Edit book (admin)
- `DELETE /api/v1/bookandmanga/delete/:id` → Delete book (admin)

**Borrowing**

- `POST /api/v1/borrow/record/:bookId` → Borrow a book
- `PUT /api/v1/borrow/return/:borrowId` → Return book
- `GET /api/v1/borrow/my-borrowed-books` → Your borrowed books
- `GET /api/v1/borrow/all?page=1&limit=20` → All records (admin)

**Users**

- `GET /api/v1/user/all?page=1&limit=20` → List users (admin)
- `PUT /api/v1/auth/profile/update` → Update your profile

## Security

- Passwords hashed with bcrypt
- JWT tokens in secure httpOnly cookies
- File uploads validated (type & size)
- Input sanitized to prevent XSS
- Rate limiting enabled
- CORS only allows your frontend
- Request body size limits (10MB)

Not bulletproof but solid.

## Troubleshooting

**Email not working?**

- Use [Gmail App Passwords](https://myaccount.google.com/apppasswords) not your regular password
- Check SMTP credentials in .env

**MongoDB connection fails?**

- Make sure MongoDB is running
- Check connection string in .env
- If using Atlas, whitelist your IP

**Cloudinary upload errors?**

- Verify API credentials
- File size max is 5MB
- Only jpg, png, gif, webp allowed

**CORS errors?**

- FRONTEND_URL in .env must match where frontend is running
- Example: if frontend runs on localhost:3000, set that

**Tests not running?**

- Run from backend folder: `cd backend && npm test`
- Node 18+ required
- Run `npm install` first

## Database Schema

**Users**

- Email (unique), password (hashed), role (admin/user), avatar, verification status

**Books**

- Title, author, description, price, quantity, availability, cover image

**Borrows**

- User ID, book ID, when borrowed, due date, returned status, fine amount

## Code Structure

```
backend/
├── controllers/        # Logic for each endpoint
├── models/            # Database schemas
├── routes/            # API endpoints
├── utils/             # Helpers (validation, email, logging)
├── middleware/        # Auth, error handling
├── constants/         # Config values
├── __tests__/         # Test files
└── logs/              # Winston logs (ignored)

frontend/
├── components/        # React components
├── pages/            # Page layouts
├── store/            # Redux slices
└── utils/            # API client, constants
```

## Running in Production

**Frontend**

- Deploy to Netlify/Vercel
- Build: `npm run build`
- Set VITE_API_URL env variable

**Backend**

- Use Render, Railway, or Heroku
- Use MongoDB Atlas (not local)
- Set all env variables
- Run: `npm start`

## Known Limitations

- No WebSockets (notifications poll every few seconds)
- Single database instance
- Basic email templates
- Search limited to title/author

But for what it does, it's solid.

## Did You Find a Bug?

1. Check if MongoDB is running
2. Check if .env is correct
3. Look at logs in `backend/logs/`
4. Try with a fresh database

## License

ISC

---

Built by someone who cares about clean code.
