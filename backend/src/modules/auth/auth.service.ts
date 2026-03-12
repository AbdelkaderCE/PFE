import prisma from "../../config/database";
import {
  hashPassword,
  comparePasswords,
  isStrongPassword,
  generateRandomPassword,
} from "../../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  hashToken,
  generateRawToken,
} from "../../utils/tokens";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../../config/auth";

// ── Interfaces ──────────────────────────────────────────────────

export interface RegisterInput {
  email: string;
  password: string;
  nom: string;
  prenom: string;
}

export interface UserPayload {
  sub: number;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    roles: string[];
    firstUse?: boolean;
  };
  accessToken: string;
  refreshToken: string;
  requiresPasswordChange: boolean;
}

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthServiceError";
  }
}

// ── Helpers ─────────────────────────────────────────────────────

/** Fetch the role names for a given userId from user_roles + roles tables */
const getUserRoles = async (userId: number): Promise<string[]> => {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return userRoles.map((ur) => ur.role.nom ?? "unknown");
};

/** Build the JWT payload for a user */
const buildPayload = (user: { id: number; email: string }, roles: string[]): UserPayload => ({
  sub: user.id,
  email: user.email,
  roles,
});

// ── Register ────────────────────────────────────────────────────

export const registerUser = async (data: RegisterInput): Promise<LoginResponse> => {
  if (!isStrongPassword(data.password)) {
    throw new AuthServiceError(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AuthServiceError("Email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  // Create user + assign default role "etudiant" in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nom: data.nom,
        prenom: data.prenom,
        firstUse: false,
      },
    });

    // Find or create the default "etudiant" role
    let role = await tx.role.findFirst({ where: { nom: "etudiant" } });
    if (!role) {
      role = await tx.role.create({ data: { nom: "etudiant", description: "Étudiant" } });
    }

    await tx.userRole.create({
      data: { userId: newUser.id, roleId: role.id },
    });

    return newUser;
  });

  const roles = await getUserRoles(user.id);

  // Email verification token (stored on the user row itself)
  const rawToken = generateRawToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashToken(rawToken),
      resetTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 h
    },
  });

  console.log(`📧 Verification link: ${process.env.APP_BASE_URL}/api/v1/auth/verify-email/${rawToken}`);

  // Generate JWT tokens
  const payload = buildPayload(user, roles);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      roles,
    },
    accessToken,
    refreshToken,
    requiresPasswordChange: false,
  };
};

// ── Login ───────────────────────────────────────────────────────

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AuthServiceError("Invalid email or password");
  }

  // Check account status
  if (user.status !== "active") {
    throw new AuthServiceError("Account is suspended or inactive");
  }

  // Verify password
  const isValidPassword = await comparePasswords(password, user.password);

  if (!isValidPassword) {
    // Increment login attempts (schema field: loginAttempts / login_attempts)
    const attempts = user.loginAttempts + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: attempts,
        // Suspend after 5 failed attempts
        status: attempts >= 5 ? "suspended" : user.status,
      },
    });
    throw new AuthServiceError("Invalid email or password");
  }

  // Reset attempts on success
  await prisma.user.update({
    where: { id: user.id },
    data: {
      loginAttempts: 0,
      lastLogin: new Date(),
    },
  });

  const roles = await getUserRoles(user.id);

  const payload = buildPayload(user, roles);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      roles,
      firstUse: user.firstUse,
    },
    accessToken,
    refreshToken,
    requiresPasswordChange: user.firstUse,
  };
};

// ── Change password ─────────────────────────────────────────────

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthServiceError("User not found");
  }

  const isValid = await comparePasswords(currentPassword, user.password);
  if (!isValid) {
    throw new AuthServiceError("Current password is incorrect");
  }

  if (!isStrongPassword(newPassword)) {
    throw new AuthServiceError(
      "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
    );
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      firstUse: false,
    },
  });
};

// ── Create user by admin ────────────────────────────────────────

export const createUserByAdmin = async (data: {
  email: string;
  nom: string;
  prenom: string;
  roleName: string;
  sexe?: "H" | "F";
  telephone?: string;
}): Promise<{
  user: { id: number; email: string; nom: string; prenom: string; roles: string[] };
  tempPassword: string;
}> => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new AuthServiceError("User with this email already exists");
  }

  const tempPassword = generateRandomPassword(12);
  const hashedPassword = await hashPassword(tempPassword);

  const result = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        nom: data.nom,
        prenom: data.prenom,
        sexe: data.sexe as any,
        telephone: data.telephone,
        firstUse: true, // force password change on first login
      },
    });

    // Assign the requested role
    const role = await tx.role.findFirst({ where: { nom: data.roleName } });
    if (!role) {
      throw new AuthServiceError(`Role '${data.roleName}' not found`);
    }

    await tx.userRole.create({
      data: { userId: newUser.id, roleId: role.id },
    });

    return newUser;
  });

  const roles = await getUserRoles(result.id);

  return {
    user: {
      id: result.id,
      email: result.email,
      nom: result.nom,
      prenom: result.prenom,
      roles,
    },
    tempPassword,
  };
};

// ── Admin reset password ────────────────────────────────────────

export const adminResetPassword = async (
  adminUserId: number,
  targetUserId: number
): Promise<string> => {
  // Verify the admin has admin role
  const adminRoles = await getUserRoles(adminUserId);
  const isAdmin = adminRoles.some((r) =>
    ["admin", "vice_doyen"].includes(r)
  );
  if (!isAdmin) {
    throw new AuthServiceError("Unauthorized: Only admins can reset passwords");
  }

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) {
    throw new AuthServiceError("User not found");
  }

  const tempPassword = generateRandomPassword(12);
  const hashedPassword = await hashPassword(tempPassword);

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      password: hashedPassword,
      firstUse: true, // force password change
    },
  });

  return tempPassword;
};

// ── Refresh tokens ──────────────────────────────────────────────

export const refreshTokens = async (
  oldRefreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET) as unknown as UserPayload;

    // Re-fetch roles in case they changed
    const roles = await getUserRoles(decoded.sub);

    const payload: UserPayload = {
      sub: decoded.sub,
      email: decoded.email,
      roles,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { accessToken, refreshToken };
  } catch {
    throw new AuthServiceError("Invalid refresh token");
  }
};

// ── Logout ──────────────────────────────────────────────────────

export const logoutUser = async (_refreshToken: string): Promise<void> => {
  // With stateless JWT (no RefreshToken table) clearing the cookie is enough.
};

// ── Email verification ──────────────────────────────────────────

export const verifyEmail = async (token: string): Promise<void> => {
  const tokenHash = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: tokenHash,
      resetTokenExpire: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AuthServiceError("Invalid or expired verification token");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      resetToken: null,
      resetTokenExpire: null,
    },
  });
};

// ── Resend verification ─────────────────────────────────────────

export const resendVerification = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AuthServiceError("User not found");
  }

  if (user.emailVerified) {
    throw new AuthServiceError("Email already verified");
  }

  const rawToken = generateRawToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashToken(rawToken),
      resetTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  console.log(`📧 New verification link: ${process.env.APP_BASE_URL}/api/v1/auth/verify-email/${rawToken}`);
};

// ── Admin: list users ────────────────────────────────────────────

export const listRolesForAdmin = async (): Promise<Array<{ id: number; nom: string; description: string | null }>> => {
  const roles = await prisma.role.findMany({
    where: { nom: { not: null } },
    select: { id: true, nom: true, description: true },
    orderBy: { nom: "asc" },
  });
  return roles.map((role) => ({
    id: role.id,
    nom: role.nom ?? "unknown",
    description: role.description,
  }));
};

export const listUsersForAdmin = async (): Promise<Array<{
  id: number;
  email: string;
  nom: string;
  prenom: string;
  sexe: "H" | "F" | null;
  telephone: string | null;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  lastLogin: Date | null;
  roles: string[];
}>> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      sexe: true,
      telephone: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      userRoles: { include: { role: { select: { nom: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return users.map((user) => ({
    ...user,
    roles: user.userRoles
      .map((ur) => ur.role.nom)
      .filter((name): name is string => !!name),
  }));
};

export const updateUserRolesByAdmin = async (
  adminUserId: number,
  targetUserId: number,
  roleNames: string[]
): Promise<{ id: number; email: string; nom: string; prenom: string; roles: string[] }> => {
  const adminRoles = await getUserRoles(adminUserId);
  const isAdmin = adminRoles.some((r) => ["admin", "vice_doyen"].includes(r));
  if (!isAdmin) throw new AuthServiceError("Unauthorized: Only admins can update user roles");

  const normalizedRoleNames = Array.from(
    new Set(roleNames.map((r) => r?.trim()).filter((r): r is string => !!r))
  );
  if (normalizedRoleNames.length === 0) throw new AuthServiceError("At least one role is required");

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) throw new AuthServiceError("User not found");

  const roles = await prisma.role.findMany({ where: { nom: { in: normalizedRoleNames } } });
  if (roles.length !== normalizedRoleNames.length) {
    const found = new Set(roles.map((r) => r.nom).filter((n): n is string => !!n));
    const missing = normalizedRoleNames.filter((n) => !found.has(n));
    throw new AuthServiceError(`Role(s) not found: ${missing.join(", ")}`);
  }

  await prisma.$transaction(async (tx) => {
    await tx.userRole.deleteMany({ where: { userId: targetUserId } });
    await tx.userRole.createMany({
      data: roles.map((r) => ({ userId: targetUserId, roleId: r.id })),
      skipDuplicates: true,
    });
  });

  const updatedRoles = await getUserRoles(targetUserId);
  return { id: targetUser.id, email: targetUser.email, nom: targetUser.nom, prenom: targetUser.prenom, roles: updatedRoles };
};

export const updateUserStatusByAdmin = async (
  adminUserId: number,
  targetUserId: number,
  status: "active" | "inactive" | "suspended"
): Promise<{ id: number; email: string; nom: string; prenom: string; status: "active" | "inactive" | "suspended"; roles: string[] }> => {
  const adminRoles = await getUserRoles(adminUserId);
  const isAdmin = adminRoles.some((r) => ["admin", "vice_doyen"].includes(r));
  if (!isAdmin) throw new AuthServiceError("Unauthorized: Only admins can update user status");

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) throw new AuthServiceError("User not found");

  if (!["active", "inactive", "suspended"].includes(status))
    throw new AuthServiceError("Invalid status value");

  const updatedUser = await prisma.user.update({ where: { id: targetUserId }, data: { status } });
  const updatedRoles = await getUserRoles(targetUserId);
  return { id: updatedUser.id, email: updatedUser.email, nom: updatedUser.nom, prenom: updatedUser.prenom, status: updatedUser.status, roles: updatedRoles };
};

// ── Forgot / reset password (public token flow) ──────────────────

export const requestPasswordReset = async (email: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!user || user.status !== "active") return "";

  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: tokenHash, resetTokenExpire: expires },
  });

  console.log(`🔑 Password reset token for ${email}: ${rawToken}`);
  return rawToken;
};

export const resetPasswordWithToken = async (token: string, newPassword: string): Promise<void> => {
  const tokenHash = hashToken(token);
  const user = await prisma.user.findFirst({
    where: { resetToken: tokenHash, resetTokenExpire: { gt: new Date() } },
  });
  if (!user) throw new AuthServiceError("Invalid or expired reset token");

  if (!isStrongPassword(newPassword))
    throw new AuthServiceError(
      "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
    );

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetTokenExpire: null, firstUse: false },
  });
};

// ── Get user by ID (for /me endpoint) ───────────────────────────

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      sexe: true,
      telephone: true,
      photo: true,
      emailVerified: true,
      firstUse: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      userRoles: {
        include: { role: true },
      },
      etudiant: {
        include: {
          promo: {
            include: {
              specialite: {
                include: { filiere: true },
              },
            },
          },
        },
      },
      enseignant: {
        include: { grade: true },
      },
    },
  });

  if (!user) {
    throw new AuthServiceError("User not found");
  }

  // Flatten roles for convenience
  return {
    ...user,
    roles: user.userRoles.map((ur) => ur.role.nom ?? "unknown"),
  };
};
