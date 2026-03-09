import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Protect routes
export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password")

      // Check if user is banned
      if (req.user && req.user.banned) {
        return res.status(403).json({ message: "Your account has been banned" })
      }

      next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({ message: "Not authorized, token failed" })
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" })
  }
}

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Not authorized as an admin" })
  }
}
