# Deployment Guide

## Prerequisites

### Required Services

- Node.js 20+
- MongoDB 7.0+
- Docker & Docker Compose (for containerized deployment)
- Git

### Required External Services

- Cloudinary Account (for image uploads)
- SMTP Email Provider (Gmail, SendGrid, etc.)
- MongoDB Atlas (for production database)

## Local Development Setup

```bash
git clone https://github.com/pintukumar916206-ops/LIBRARY.git
cd LIBRARY

cd backend
npm install
cd ../frontend
npm install
cd ..
```

### Environment Setup

```bash
cp backend/config/config.env.example backend/config/config.env
```

Edit `backend/config/config.env`:

```
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGO_URL=mongodb://localhost:27017/library
NODE_ENV=development
JWT_SECRET_KEY=your_secure_random_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_MAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_app_specific_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Start Services

#### Option 1: Docker Compose (Recommended)

```bash
docker-compose up -d
```

#### Option 2: Manual Start

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7-alpine

cd backend
npm run dev

cd ../frontend
npm run dev
```

Access at `http://localhost:5173`

## Production Deployment

### Environment Configuration

Set these environment variables in your production environment:

```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-domain.com
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/library
JWT_SECRET_KEY=generate_with_openssl_rand_-hex_32
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
LOG_LEVEL=info
```

### Docker Production Build

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Health Checks

```bash
curl http://localhost:4000/api/v1/auth/me
curl http://localhost:5173/
docker-compose ps
```

### Database Backup

```bash
docker exec library_mongodb mongodump --uri="mongodb://root:password@localhost:27017" --out=/backup/$(date +%Y%m%d)
```

### Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Monitoring

Monitor these files for production issues:

- `backend/logs/error.log`
- `backend/logs/combined.log`
- `docker-compose` health checks

### API Rate Limiting

Current limits (in `backend/app.js`):

- 1000 requests per 15 minutes per IP
- Adjust `windowMs` and `max` in app.js for different limits

### CORS Configuration

Edit `backend/app.js`:

```javascript
cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
```

### Security Checklist

- [ ] Set strong JWT_SECRET_KEY (use: `openssl rand -hex 32`)
- [ ] Enable HTTPS in production
- [ ] Set COOKIE_SECURE=true in production
- [ ] Configure CORS properly for your domain
- [ ] Use environment-specific MONGODB URLs
- [ ] Set NODE_ENV=production
- [ ] Configure SMTP with app-specific password
- [ ] Set up log rotation
- [ ] Configure database backups
- [ ] Enable monitoring and alerting

### Performance Optimization

1. Enable Gzip compression in reverse proxy (nginx/Apache)
2. Set up CDN for static assets
3. Configure database indexes (already configured)
4. Use Redis for caching (optional)
5. Enable request/response compression in app.js

### Scaling

For high traffic:

1. Use load balancer for backend instances
2. Set up database replication
3. Implement caching layer (Redis)
4. Use queue system for background jobs
5. Scale frontend with CDN

## Troubleshooting

### MongoDB Connection Issues

```bash
mongosh "mongodb+srv://user:password@cluster.mongodb.net/library"
show dbs
use library
db.users.count()
```

### Port Already in Use

```bash
lsof -i :4000
kill -9 <PID>
```

### Docker Issues

```bash
docker-compose down
docker system prune -a
docker-compose up -d
```

### Clear Database

```bash
docker-compose down -v
docker-compose up -d
```

## CI/CD Integration

GitHub Actions workflow automatically:

- Runs tests on push/PR
- Checks code quality
- Runs security scans
- Builds Docker images (on main branch)
- Generates coverage reports

See `.github/workflows/ci-cd.yml`

## Backup and Recovery

### Automated Backups

Configure cron job:

```bash
0 2 * * * /home/user/scripts/backup-db.sh
```

### Manual Backup

```bash
mongodump --uri="mongodb://user:pass@host/library" --out=./backups
```

### Restore Backup

```bash
mongorestore --uri="mongodb://user:pass@host/library" ./backups/library
```

## Support

For issues visit: https://github.com/pintukumar916206-ops/LIBRARY/issues
