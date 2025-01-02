import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(import.meta.env.VITE_SUPABASE_JWT_SECRET || 'your-jwt-secret');

export async function createJWT(address: string) {
  const token = await new SignJWT({ wallet_address: address.toLowerCase() })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(address.toLowerCase())
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}