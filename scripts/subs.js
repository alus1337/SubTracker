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
  addButton.addEventListener("click", () => {
    const body = document.body;

    body.insertAdjacentHTML(
      "beforeend",
      `
    <div id="add-overlay">
      <div id="edit-container">
        <h2>Add New Subscription</h2>
        <label class="input-container">
          Service Name
          <input type="text" placeholder="Enter service name" />
        </label>

        <label class="input-container">
          Payment Amount
          <input type="text" />
        </label>

        <div class="frequency-container">
          <p>Pyament Frequency</p>
          <label class="frequency-selection">
            <input type="checkbox" />
            Monthly
          </label>

          <label class="frequency-selection">
            <input type="checkbox" />
            Yearly
          </label>
        </div>

        <label class="due-container">
          Next Payment Date
          <input type="text" placeholder="YYYY-MM-DD" />
        </label>

        <button id="add-submit">Submit</button>
        <button id="cancel-submit">Cancel</button>
      </div>
    </div>
    `
    );

    const cancelButton = document.getElementById("cancel-submit");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        const overlay = document.getElementById("add-overlay");
        if (overlay) {
          overlay.remove();
        }
      });
    }
  });
}
