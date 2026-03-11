import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  verifyEmailHandler,
  resendVerificationHandler,
  getMeHandler,
  changePasswordHandler,
  createUserByAdminHandler,
  adminResetPasswordHandler,
} from "../controllers/auth.controller";
import {
  loginLimiter,
  registerLimiter,
  refreshLimiter,
} from "../../../middleware/rate-limit.middleware";
import { requireAuth } from "../../../middleware/auth.middleware";
import { requirePermission } from "../../../middleware/permission.middleware";

const router = Router();

// ==================== PUBLIC ROUTES ====================
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh-token", refreshLimiter, refresh);
router.post("/logout", logout);

// ==================== EMAIL VERIFICATION ====================
router.get("/verify-email/:token", verifyEmailHandler);
router.post("/resend-verification", resendVerificationHandler);

// ==================== PROTECTED ROUTES (All authenticated users) ====================
router.get("/me", requireAuth, getMeHandler);
router.post("/change-password", requireAuth, changePasswordHandler);

// ==================== ADMIN ROUTES (Using permissions) ====================

// Create user - requires 'users:create' permission
router.post(
  "/admin/create-user",
  requireAuth,
  requirePermission("users:create"),
  createUserByAdminHandler
);

// Reset password - requires 'users:edit' permission
router.post(
  "/admin/reset-password/:userId",
  requireAuth,
  requirePermission("users:edit"),
  adminResetPasswordHandler
);

export default router;
