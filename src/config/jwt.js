export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const JWT_REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const COOKIE_SECURE = process.env.COOKIE_SECURE;
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10;
