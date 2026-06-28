import crypto from "crypto";

export const CSRF_COOKIE_NAME = "csrfToken";

export const generateCsrfToken = () => crypto.randomBytes(32).toString("hex");

export const verifyCsrf = (req, res, next) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};
