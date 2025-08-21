// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
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

const auth = getAuth();

const email = document.getElementById("email");
const pw = document.getElementById("password");

function notify(message, duration = 3000) {
  const container = document.getElementById("notifications-container");

  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  container.appendChild(notification);

  // Trigger CSS animation
  setTimeout(() => notification.classList.add("show"), 50);

  // Remove notification after duration
  setTimeout(() => {
    notification.classList.remove("show");
    // Wait for fade-out transition to finish
    setTimeout(() => notification.remove(), 500);
  }, duration);
}

function signup() {
  createUserWithEmailAndPassword(auth, email.value, pw.value)
    .then((userCredential) => {
      notify("Signed up!");
    })
    .catch((error) => {
      notify(error.message);
    });
}

function login() {
  signInWithEmailAndPassword(auth, email.value, pw.value)
    .then((userCredential) => {
      notify(userCredential.user);
    })
    .catch((error) => {
      notify(error.message);
    });
}

const signupButton = document.getElementById("sign-up-button");
signupButton.onclick = function () {
  signup();
};

const loginButton = document.getElementById("login-button");
loginButton.onclick = function () {
  login();
};
