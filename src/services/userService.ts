import { PrismaClient, User } from "@prisma/client";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const addUser = async (data: Omit<User, "id">): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  return await prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password),
    },
  });
};
