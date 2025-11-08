import * as authService from "../services/auth.service.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { COOKIE_NAME } from "../config/jwt.js";

const isProd = process.env.NODE_ENV === "production";

console.log(
  isProd ? "🚀 Running in production mode" : "🧪 Running in development mode"
);

export const initUser = async () => {
  return authService.initUser();
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.verifyUser(email, password);
  
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id });

  res.cookie(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : 'lax',
    domain: ".ervi-group.com",
    path: "/",
    maxAge: 1000 * 60 * 60 * 2,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : 'lax',
    domain: ".ervi-group.com",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 3,
  });

  res.json({
    ok: true,
    user: { id: user.id, email: user.email },
  });
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token" });

  const decoded = verifyRefreshToken(token);
  if (!decoded)
    return res.status(403).json({ message: "Invalid refresh token" });

  const user = await authService.getUserById(decoded.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const newAccessToken = signAccessToken({ id: user.id, email: user.email });
  const newRefreshToken = signRefreshToken({ id: user.id });

  res.cookie(COOKIE_NAME, newAccessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : 'lax',
    domain: ".ervi-group.com",
    path: "/",
    maxAge: 1000 * 60 * 60 * 2,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : 'lax',
    domain: ".ervi-group.com",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 3,
  });

  res.json({ ok: true });
};

export const logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : 'lax',
    path: "/",
    domain: ".ervi-group.com",
  };

  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.json({ ok: true });
};


export const changePassword = async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!user) return res.status(401).json({ message: "Not authenticated" });

  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Invalid password data" });
  }

  try {
    await authService.changePassword(user.id, oldPassword, newPassword);
    res.json({ ok: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.json({ ok: true, user: req.user });
};
