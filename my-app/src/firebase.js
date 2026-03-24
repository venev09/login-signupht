import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByQIdXSAA4MOSqIS8Id_Ugg85SAbmRaK0",
  authDomain: "login-signupht.firebaseapp.com",
  projectId: "login-signupht",
  storageBucket: "login-signupht.firebasestorage.app",
  messagingSenderId: "826949820027",
  appId: "1:826949820027:web:5b36d8e592c86119550cde",
  measurementId: "G-M3BBH5HR75"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

