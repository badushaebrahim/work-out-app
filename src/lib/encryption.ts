import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'default-fallback-key'; 
// Note: In an ideal scenario, a separate fixed public key should be used for client encryption.
// For demonstration, we'll use a static string or an exposed public env var.

export const encryptPasswordClientSide = (password: string): string => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

export const decryptPasswordServerSide = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
