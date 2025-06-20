import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    'Warning: JWT_SECRET is not set. Using a default insecure secret for token generation. ' +
    'Please set a strong JWT_SECRET in your .env.local file for production.'
  );
}
const EFFECTIVE_JWT_SECRET = JWT_SECRET || 'default-insecure-secret-please-replace';

/**
 * Generates a JWT token.
 * @param payload The payload to include in the token (e.g., user ID, role).
 * @param expiresIn The expiration time for the token (e.g., '1h', '7d'). Defaults to '1h'.
 * @returns The generated JWT token.
 * @throws Error if JWT_SECRET is not available (though we have a fallback here for non-production).
 */
export function generateToken(payload: object, expiresIn: string | number = '1h'): string {
  return jwt.sign(payload, EFFECTIVE_JWT_SECRET, { expiresIn });
}

/**
 * Verifies a JWT token.
 * @param token The JWT token to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export function verifyToken(token: string): object | null {
  try {
    const decoded = jwt.verify(token, EFFECTIVE_JWT_SECRET);
    return decoded as object; // Type assertion, ensure your payload structure matches
  } catch (error) {
    console.error('Invalid token:', error.message);
    return null;
  }
}
