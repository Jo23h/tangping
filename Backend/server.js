require("dotenv").config();
const express = require("express");
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

// CORS configuration - allow frontend URL from environment variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

const PORT = process.env.PORT || "3000";

  // Routes
app.use("/users", userRouter);
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use('/projects', projectRouter);

app.listen(PORT, () => {
});
