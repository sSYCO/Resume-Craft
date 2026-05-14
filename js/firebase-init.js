// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDgWqqyzZv2AMSzd6wOkpbzwB-F4DDP5TM",
  authDomain: "resume-craft-51ab8.firebaseapp.com",
  projectId: "resume-craft-51ab8",
  storageBucket: "resume-craft-51ab8.firebasestorage.app",
  messagingSenderId: "254567974186",
  appId: "1:254567974186:web:5f5a7057c441fe0bcf4a53"
};

// Initialize Firebase (Compat Mode)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Make auth globally available
window.auth = auth;