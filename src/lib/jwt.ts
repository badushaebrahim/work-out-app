import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Use TextEncoder to prepare the secret for the Edge runtime-compatible jose library
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { userId: string; role: string; email: string };
  } catch (error) {
    return null;
  }
}
