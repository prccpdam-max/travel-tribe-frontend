import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS7ll0YgHrboOiay07L32s_nw8hNgFYxQ",
  authDomain: "travel-tribe-7edda.firebaseapp.com",
  projectId: "travel-tribe-7edda",
  storageBucket: "travel-tribe-7edda.firebasestorage.app",
  messagingSenderId: "148979568878",
  appId: "1:148979568878:web:669aa77e78bb9a9591a3ff"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
