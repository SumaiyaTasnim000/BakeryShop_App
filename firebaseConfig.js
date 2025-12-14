import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAMVFD3Y_LBdPY2xDBPx1FywFWR57CK9h0",
  authDomain: "bakeryapp-4ce67.firebaseapp.com",
  projectId: "bakeryapp-4ce67",
  storageBucket: "bakeryapp-4ce67.firebasestorage.app",
  messagingSenderId: "845498054652",
  appId: "1:845498054652:web:ee278f0e3f04b031796479",
  measurementId: "G-YEX5BR10QM",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
