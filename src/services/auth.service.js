import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { SALT_ROUNDS } from "../config/jwt.js";

export const initUser = async () => {
  const existing = await prisma.user.findFirst();

  if (existing) {
    console.log(`✅ Admin already exists: ${existing.email}`);
    return existing;
  }

  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;

  if (!email || !pass) {
    throw new Error("❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  }

  const hash = await bcrypt.hash(pass, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
    },
  });

  console.log(
    `✅ Initial admin created: ${email} (change password immediately)`
  );
  return user;
};

export const verifyUser = async (email, password) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return { id: user.id, email: user.email };
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
};

export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newHash },
  });

  return true;
};
