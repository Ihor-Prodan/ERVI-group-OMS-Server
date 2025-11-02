import { COOKIE_NAME } from "../config/jwt.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  let token = req.cookies?.[COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.replace("Bearer ", "");
  }

  if (!token) {
    return res.status(401).json({ message: "🚫 Not authenticated" });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "🚫 Invalid or expired token" });
  }

  req.user = decoded;
  next();
};
