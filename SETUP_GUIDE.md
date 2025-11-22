# HRMS Backend - Step-by-Step Setup Guide

This guide will walk you through setting up the HRMS backend application from scratch. Follow each step carefully.

## Table of Contents
1. [Install Node.js](#1-install-nodejs)
2. [Install PostgreSQL](#2-install-postgresql)
3. [Create Database](#3-create-database)
4. [Configure Application](#4-configure-application)
5. [Install Dependencies](#5-install-dependencies)
6. [Start the Application](#6-start-the-application)
7. [Test the API](#7-test-the-api)
8. [Common Issues](#8-common-issues)

---

## 1. Install Node.js

### Check if Node.js is installed:
```bash
node --version
npm --version
```

### If not installed:

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:**
```bash
brew install node
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/) and run the installer.

### Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
```

---

## 2. Install PostgreSQL

### Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### macOS:
```bash
# Install using Homebrew
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Check status
brew services list
```

### Windows:
1. Download installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the postgres user
4. Default port is 5432

### Verify PostgreSQL is running:
```bash
# Try to connect
psql --version
```

---

## 3. Create Database

### Ubuntu/Debian/macOS:

```bash
# Switch to postgres user and open psql
sudo -u postgres psql
```

### Windows:
```bash
# Open Command Prompt and run:
psql -U postgres
```

### Inside PostgreSQL prompt (for all operating systems):

```sql
-- Create database
CREATE DATABASE hrms_db;

-- Create user with password
CREATE USER hrms_user WITH ENCRYPTED PASSWORD 'hrms_password_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hrms_db TO hrms_user;

-- Connect to the new database
\c hrms_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO hrms_user;

-- Exit
\q
```

### Test database connection:
```bash
psql -h localhost -U hrms_user -d hrms_db
# Enter password when prompted: hrms_password_2024
# If successful, you'll see: hrms_db=>
# Type \q to exit
```

---

## 4. Configure Application

### Navigate to backend directory:
```bash
cd backend
```

### Create environment file:
```bash
cp .env.example .env
```

### Edit .env file:
```bash
# Use your preferred editor (nano, vim, or any text editor)
nano .env
```

### Update with your settings:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=hrms_user
DB_PASSWORD=hrms_password_2024

# JWT Configuration (IMPORTANT: Change in production!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_123456
JWT_EXPIRES_IN=24h

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important Notes:**
- Change `JWT_SECRET` to a strong random string for production
- Keep your password secure
- Never commit the `.env` file to version control

### Save and exit:
- If using nano: Press `Ctrl + X`, then `Y`, then `Enter`
- If using vim: Press `Esc`, type `:wq`, press `Enter`

---

## 5. Install Dependencies

### Install all required packages:
```bash
npm install
```

This will install:
- express (Web framework)
- pg (PostgreSQL client)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- express-validator (Input validation)
- cors (Cross-origin resource sharing)
- helmet (Security headers)
- morgan (HTTP logging)
- dotenv (Environment variables)
- nodemon (Development auto-restart)

### Verify installation:
```bash
npm list --depth=0
```

You should see all packages listed without errors.

---

## 6. Start the Application

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

### Expected Output:
```
Database connected successfully
Database tables created successfully

==================================================
HRMS Backend Server
==================================================
Server running on port: 5000
Environment: development
Health check: http://localhost:5000/health
==================================================
```

### If you see this, the server is running successfully! 🎉

---

## 7. Test the API

### Option 1: Using curl (Command Line)

#### Test health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "HRMS API is running",
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

#### Register a new organization:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "email": "admin@mycompany.com",
    "password": "securepass123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Organization registered successfully",
  "data": {
    "organization": {
      "id": 1,
      "name": "My Company",
      "email": "admin@mycompany.com",
      "created_at": "2024-01-20T10:00:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mycompany.com",
    "password": "securepass123"
  }'
```

**Save the token from the response!** You'll need it for authenticated requests.

#### Create an employee (replace YOUR_TOKEN_HERE):
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@mycompany.com",
    "phone": "+1234567890",
    "position": "Software Engineer",
    "department": "Engineering",
    "hire_date": "2024-01-15"
  }'
```

#### Get all employees:
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 2: Using Postman or Thunder Client

1. Download Postman from [postman.com](https://www.postman.com/)
2. Or install Thunder Client extension in VS Code
3. Create a new request
4. Set the method (GET, POST, etc.)
5. Enter the URL (e.g., `http://localhost:5000/api/auth/register`)
6. Add headers (Content-Type: application/json)
7. Add body (raw JSON)
8. Send request

### Option 3: Using Browser (for GET requests only)

Simply open: `http://localhost:5000/health`

---

## 8. Common Issues

### Issue 1: "PostgreSQL connection refused"

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Start PostgreSQL if not running
sudo systemctl start postgresql    # Linux
brew services start postgresql     # macOS
```

### Issue 2: "Password authentication failed"

**Solution:**
1. Check your `.env` file has the correct password
2. Verify the database user was created correctly:
```bash
sudo -u postgres psql
\du  # List all users
```

### Issue 3: "Port 5000 is already in use"

**Solution:**
```bash
# Find what's using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env file
```

### Issue 4: "Cannot find module 'express'"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "Database does not exist"

**Solution:**
```bash
# Recreate the database
sudo -u postgres psql
CREATE DATABASE hrms_db;
GRANT ALL PRIVILEGES ON DATABASE hrms_db TO hrms_user;
\q
```

### Issue 6: "JWT malformed" or "Invalid token"

**Solution:**
- Make sure you're including the token in the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`
- The token expires after 24 hours (re-login to get a new one)

### Issue 7: Tables not created

**Solution:**
```bash
# Check logs when starting the server
# If tables aren't created, manually create them:
psql -h localhost -U hrms_user -d hrms_db

# Copy and paste the SQL from src/db.js
# Or restart the application
```

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Start production server
npm start

# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Access PostgreSQL
psql -h localhost -U hrms_user -d hrms_db

# View logs in real-time
npm run dev  # Already shows logs

# Stop server
Ctrl + C
```

---

## Next Steps

1. ✅ Server is running
2. ✅ Database is connected
3. ✅ API is responding
4. ✅ You can create organizations and employees

**Now you can:**
- Build a frontend to connect to this API
- Test all endpoints using Postman
- Deploy to production
- Add more features

---

## File Structure Overview

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/             # Handle requests
│   ├── middlewares/             # Process requests
│   ├── models/                  # Database operations
│   ├── routes/                  # API endpoints
│   ├── utils/                   # Helper functions
│   ├── db.js                    # Database setup
│   └── index.js                 # Entry point (START HERE)
├── .env                         # Your configuration (SECRET!)
├── .env.example                 # Template
├── package.json                 # Dependencies
└── README.md                    # Main documentation
```

---

## Need Help?

1. Check the error messages in the terminal
2. Review the `.env` configuration
3. Verify PostgreSQL is running
4. Check the README.md for detailed API documentation
5. Review ASSIGNMENT_README.md for architecture details

---

## Success Checklist

- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] User created with permissions
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] Health check returns success
- [ ] Can register an organization
- [ ] Can login and receive token
- [ ] Can create employees with token

**If all checked, you're ready to go! 🚀**

---

**Remember:** Keep your `.env` file secure and never share your JWT secret or database passwords!
