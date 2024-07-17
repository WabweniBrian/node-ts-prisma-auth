import { PrismaClient, User } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { createToken, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/mailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export const signUp = async (
  email: string,
  password: string,
  name?: string
) => {
  const hashedPassword = await hashPassword(password);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      verificationToken,
    },
  });

  await sendMail(
    email,
    "Verify your email",
    `Please verify your email by clicking the following link: ${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`
  );

  return user;
};

export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }

  const token = createToken({ userId: user.id });
  return { user, token };
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });
  if (!user) {
    throw new Error("Invalid or expired token");
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  await sendMail(
    email,
    "Reset your password",
    `Please reset your password by clicking the following link: ${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await comparePassword(oldPassword, user.password))) {
    throw new Error("Invalid old password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const updateProfile = async (userId: string, data: Partial<User>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return user;
};

export const deleteAccount = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
};
