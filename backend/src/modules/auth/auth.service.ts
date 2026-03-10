import prisma from "../../config/database";
import { hashPassword, comparePasswords, isStrongPassword } from "../../utils/password";
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
  };
  accessToken: string;
  refreshToken: string;
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
    },
    accessToken,
    refreshToken,
  };
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
  // If you later add a token blacklist, add logic here.
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