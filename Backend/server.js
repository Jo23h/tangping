require("dotenv").config();

// Catch unhandled promise rejections that cause silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Log the stack trace for debugging
  if (reason instanceof Error) {
    console.error(reason.stack);
  }
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error(err.stack);
});

const express = require("express");
const session = require("express-session");
const cors = require('cors')
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const passport = require('./config/passport');
const connectDB = require("./config/database.js");

// Import Routers
const userRouter = require('./routers/users.js')
const authRouter = require("./routers/auth.js")
const taskRouter = require("./routers/tasks.js")
const projectRouter = require("./routers/projects.js")

const app = express();
connectDB();

// Trust Railway proxy - CRITICAL for OAuth callbacks to work
app.set("trust proxy", 1);

// Debug: Log environment variables on startup
console.log("=== ENVIRONMENT CHECK ===");
console.log("BACKEND_URL:", process.env.BACKEND_URL || "NOT SET");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "NOT SET");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "SET" : "NOT SET");
console.log("========================");

// CORS configuration - allow frontend URL from environment variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(morgan("dev"));

// Session middleware - required for Passport even with session: false
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || "3000";

  // Routes
app.use("/users", userRouter);
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use('/projects', projectRouter);

// Global error handler - MUST be after all routes
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR HANDLER CAUGHT:", err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    path: req.path
  });
});

// Bind to 0.0.0.0 for Railway (required for container networking)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
