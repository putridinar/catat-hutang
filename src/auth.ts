// src/auth.ts
import { getAuth, signOut } from 'firebase/auth';

export const logoutUser = async () => {
  const auth = getAuth();
  await signOut(auth);
  localStorage.removeItem('user'); // jika kamu simpan user di localStorage
};
