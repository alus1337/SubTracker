// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  setDoc,
  doc,
  collection,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgYFEh9GHyECotAys1zk__I0wO6bXMIhE",
  authDomain: "subtracker-af5eb.firebaseapp.com",
  projectId: "subtracker-af5eb",
  storageBucket: "subtracker-af5eb.firebasestorage.app",
  messagingSenderId: "331537145998",
  appId: "1:331537145998:web:4694ed9a57f994cacf29df",
  measurementId: "G-NEYQ54RPRP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

const email = document.getElementById("email");
const pw = document.getElementById("password");

function notify(message, duration = 3000) {
  const container = document.getElementById("notifications-container");

  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 60);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 500);
  }, duration);
}

async function signup() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      pw.value
    );

    notify("Signed up!");
    const user = userCredential.user;

    const docRef = await setDoc(doc(db, "users", user.uid), {
      UserId: user.uid,
      Email: user.email,
    });
  } catch (e) {
    notify(e.message);
  }
}

function login() {
  signInWithEmailAndPassword(auth, email.value, pw.value)
    .then((userCredential) => {
      notify("Logged in!");
      window.location.href = "subs.html";
    })
    .catch((error) => {
      notify(error.message);
    });
}

const signupButton = document.getElementById("sign-up-button");
if (signupButton) {
  signupButton.onclick = function () {
    signup();
  };
}

const loginButton = document.getElementById("login-button");
if (loginButton) {
  loginButton.onclick = function () {
    login();
  };
}

export { app, db, auth };
