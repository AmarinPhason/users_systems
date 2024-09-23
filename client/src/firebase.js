// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "users-systems.firebaseapp.com",
  projectId: "users-systems",
  storageBucket: "users-systems.appspot.com",
  messagingSenderId: "788917052178",
  appId: "1:788917052178:web:1a1ed342310540d97e09cb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
