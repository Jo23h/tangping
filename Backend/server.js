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
// Try both import methods for connect-mongo compatibility
let MongoStore = require("connect-mongo");
// If .default exists, use it (some bundlers need this)
if (MongoStore.default) {
  MongoStore = MongoStore.default;
}
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

// Debug MongoStore setup
console.log("=== MONGOSTORE DEBUG ===");
console.log("MongoStore object:", typeof MongoStore);
console.log("MongoStore.create exists:", typeof MongoStore.create);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI value:", process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + "..." : "NOT SET");
console.log("========================");

// Session middleware - temporarily using MemoryStore to debug
// MongoStore was blocking the app from starting
app.use(session({
  secret: process.env.JWT_SECRET || process.env.SESSION_SECRET || 'tangping_secret_key',
  resave: false,
  saveUninitialized: false,
  // Temporarily disabled MongoStore - using MemoryStore for now
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGODB_URI,
  // }),
  cookie: {
    secure: true, // Required for HTTPS on Railway
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Log ALL incoming requests for debugging
app.use((req, res, next) => {
  console.log(`🔵 INCOMING REQUEST: ${req.method} ${req.path}`);
  console.log(`   Headers Host: ${req.get('host')}`);
  console.log(`   Protocol: ${req.protocol}`);
  next();
});

const PORT = parseInt(process.env.PORT) || 8080;
console.log("🔌 Port Configuration:");
console.log("  - process.env.PORT:", process.env.PORT || "NOT SET");
console.log("  - Using PORT:", PORT);

// Health check endpoint - test if server is reachable
app.get('/health', (req, res) => {
  console.log("✅ Health check hit");
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

  // Connect to MongoDB AFTER server starts (non-blocking)
  console.log("⏳ Starting MongoDB connection in background...");
  connectDB().catch(err => {
    console.error("MongoDB connection error (non-fatal):", err.message);
  });
});
