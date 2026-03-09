import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// Configure env
dotenv.config()

const app = express()

// CORS config for Vercel frontend and local dev
const allowedOrigins = [
  "https://stream-vault-lac.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
]
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())

import authRoutes from "./routes/authRoutes.js"
import movieRoutes from "./routes/movieRoutes.js"
import userRoutes from "./routes/userRoutes.js"

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/movies", movieRoutes)
app.use("/api/users", userRoutes)

// Example root route
app.get("/", (req, res) => {
  res.send("StreamVault API is running...")
})

// Database connection
const PORT = process.env.PORT || 5000
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/streamvault"

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })
