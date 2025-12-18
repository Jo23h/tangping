require("dotenv").config();
const express = require("express");
const cors = require('cors')
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database.js");

// Import Routers
const userRouter = require('./routers/users.js')
const authRouter = require("./routers/auth.js")
const taskRouter = require("./routers/tasks.js")

const app = express();
connectDB();

app.use(cors())
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || "3000";

  // Routes
app.use("/users", userRouter);
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}`);
});
