import { Router } from "express";
import {
  signUpController,
  signInController,
  verifyEmailController,
  requestPasswordResetController,
  resetPasswordController,
  changePasswordController,
  updateProfileController,
  deleteAccountController,
} from "../controllers/authController";

const router = Router();

router.post("/sign-up", signUpController);
router.post("/sign-in", signInController);
router.get("/verify-email", verifyEmailController);
router.post("/request-password-reset", requestPasswordResetController);
router.post("/reset-password", resetPasswordController);
router.post("/change-password", changePasswordController);
router.put("/update-profile", updateProfileController);
router.delete("/delete-account", deleteAccountController);

export default router;
