require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const https = require("https"); // ✅ Use require, not import
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Keep-alive pinger for Render free tier
const BACKEND_URL = "https://expense-tracker-backend-7qo0.onrender.com";

function keepServerAwake() {
  https
    .get(BACKEND_URL, (res) => {
      console.log(`Keep-alive ping: ${res.statusCode}`);
    })
    .on("error", (err) => {
      console.error("Error with keep-alive ping:", err.message);
    });
}

const FOURTEEN_MINUTES = 14 * 60 * 1000;

setInterval(keepServerAwake, FOURTEEN_MINUTES);
console.log(`Keep-alive ping set to run every 14 minutes`);
