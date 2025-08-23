import { app, db, auth } from "./script.js";
import {
  collection,
  getDoc,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

let userId;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;

    const docRef = collection(db, "users", userId, "services");
    const docSnap = await getDocs(docRef);
    const container = document.getElementById("content-container");

    if (docSnap) {
      docSnap.forEach((doc) => {
        const docData = doc.data();

        if (container) {
          container.innerHTML += `
          <div class="subscription">
          <p id="service">${docData.Service}</p>
          <p>${docData.Amount}</p>
          <p>${docData.Frequency}</p>
          <p>${docData.Due}</p>
          <div class="actions">
            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
          </div>
        </div>
        `;
        }
      });
    }
  } else {
    window.location.href = "./index.html";
  }
});

const addButton = document.getElementById("add-content");
if (addButton) {
}
