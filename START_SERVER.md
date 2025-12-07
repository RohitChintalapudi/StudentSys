# How to Start the Backend Server

## Quick Start

1. **Open a terminal/command prompt**

2. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

3. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```
   
   OR use nodemon for auto-restart:
   ```bash
   npm run dev
   ```

5. **You should see:**
   ```
   MongoDB Connected
   Server running on port 5000
   Health check: http://localhost:5000/health
   API endpoint: http://localhost:5000/auth/login
   ```

## Troubleshooting

### If you see "Cannot connect to server":
- Make sure the backend server is running
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Check MongoDB connection

### If MongoDB connection fails:
- Check your MongoDB Atlas connection string
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify your username and password are correct

### Test the server:
- Open browser: http://localhost:5000/health
- Should return: `{"status":"ok","message":"Server is running"}`

## Windows Users
You can double-click `start-server.bat` in the backend folder to start the server.

