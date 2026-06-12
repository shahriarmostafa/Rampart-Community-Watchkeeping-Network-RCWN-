import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

function requireFirebaseAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error("Firebase client env values are not configured.");
  }

  return auth;
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(requireFirebaseAuth(), email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(requireFirebaseAuth(), provider);
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(requireFirebaseAuth(), email, password);
  await updateProfile(credential.user, { displayName: name });
  return credential;
}

export async function logout() {
  return signOut(requireFirebaseAuth());
}
