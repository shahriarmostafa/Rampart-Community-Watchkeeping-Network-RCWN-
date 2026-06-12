export type FirebaseAdminConfig = {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
};

export const firebaseAdminConfig: FirebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};
