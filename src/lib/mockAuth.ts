// src/lib/mockAuth.ts
import type { User } from "@/types/user";

// Extend User type to include password for mock storage (NEVER do this in a real app)
type UserWithPassword = User & { passwordHash: string }; // Store a mock "hash"

// In-memory database for simulation - Pre-populate with example users
const mockUsersDb: Record<string, UserWithPassword> = {
  "vendedor@textisur.com": {
    // Use a more specific domain
    id: "seller123", // More descriptive ID
    name: "Carlos Vende",
    email: "vendedor@textisur.com",
    role: "vendedor",
    avatarUrl: "https://picsum.photos/seed/carlosvende/100/100",
    passwordHash: "vendedor123", // Plain text for simulation ONLY
  },
  "comprador@textisur.com": {
    // Use a more specific domain
    id: "buyer456", // More descriptive ID
    name: "Elena Compra",
    email: "comprador@textisur.com",
    role: "comprador",
    avatarUrl: "https://picsum.photos/seed/elenacompra/100/100",
    passwordHash: "comprador123", // Plain text for simulation ONLY
  },
  // Keep original examples if needed for testing other scenarios
  "vendedor@example.com": {
    id: "1",
    name: "Juan Vendedor",
    email: "vendedor@example.com",
    role: "vendedor",
    avatarUrl: "https://picsum.photos/seed/juanvendedor/100/100",
    passwordHash: "password", // Plain text for simulation ONLY
  },
  "comprador@example.com": {
    id: "2",
    name: "Ana Compradora",
    email: "comprador@example.com",
    role: "comprador",
    avatarUrl: "https://picsum.photos/seed/anacompradora/100/100",
    passwordHash: "password", // Plain text for simulation ONLY
  },
};

/**
 * Finds a user by email in the mock database.
 * @param email The email to search for.
 * @returns The User object if found, otherwise null.
 */
export function findUserByEmail(email: string): User | null {
  const normalizedEmail = email.toLowerCase();
  const userWithPassword = mockUsersDb[normalizedEmail];
  if (!userWithPassword) {
    return null;
  }
  // Return only the User part, excluding the password
  const { passwordHash, ...user } = userWithPassword;
  return user;
}

/**
 * Verifies a password against the mock database.
 * IMPORTANT: This uses plain text comparison for simulation ONLY.
 * Real applications MUST use secure hashing and comparison.
 * @param email The user's email.
 * @param password The password attempt.
 * @returns True if the password is correct, false otherwise.
 */
export function verifyPassword(email: string, password: string): boolean {
  const normalizedEmail = email.toLowerCase();
  const userWithPassword = mockUsersDb[normalizedEmail];
  // console.log("Verifying:", email, password, "Found:", userWithPassword); // Debugging log
  return !!userWithPassword && userWithPassword.passwordHash === password;
}

/**
 * Adds a new user to the mock database.
 * @param user The user data (without password).
 * @param password The user's password.
 * @returns True if the user was added successfully, false if the email already exists.
 */
export function addUser(user: User, password: string): boolean {
  const normalizedEmail = user.email.toLowerCase();
  if (mockUsersDb[normalizedEmail]) {
    console.log(`Attempted to add existing email: ${normalizedEmail}`); // Debug log
    return false; // User already exists
  }

  // In a real app, hash the password here securely
  const passwordHash = password; // Using plain text for simulation

  mockUsersDb[normalizedEmail] = { ...user, passwordHash };
  console.log("Mock DB updated after add:", mockUsersDb); // For debugging
  return true;
}

// Optional: Function to get all users (for debugging or other purposes)
export function getAllUsers(): User[] {
  return Object.values(mockUsersDb).map(({ passwordHash, ...user }) => user);
}
