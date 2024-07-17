import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const createToken = (
  payload: object,
  expiresIn: string | number = "1h"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
