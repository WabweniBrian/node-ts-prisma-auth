import { Request, Response } from "express";
import {
  signUp,
  signIn,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  updateProfile,
  deleteAccount,
} from "../services/authService";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await signUp(email, password, name);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await signIn(email, password);
    res.json({ user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    await verifyEmail(token as string);
    res.send("Email verified successfully");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const requestPasswordResetController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    await requestPasswordReset(email);
    res.send("Password reset email sent");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.query;
    await resetPassword(token as string, newPassword);
    res.send("Password reset successfully");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    await changePassword(userId, oldPassword, newPassword);
    res.send("Password changed successfully");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const { userId, data } = req.body;
    const user = await updateProfile(userId, data);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAccountController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await deleteAccount(userId);
    res.send("Account deleted successfully");
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
