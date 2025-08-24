import { app, db, auth } from "./script.js";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

let userId;

function notify(message) {
  const container = document.getElementById("notification-container");

  if (container) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 60);

    setTimeout(() => {
      notification.classList.remove(show); //finish this
    });
  }
}

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
  addButton.addEventListener("click", async () => {
    const body = document.body;

    body.insertAdjacentHTML(
      "beforeend",
      `
    <div id="add-overlay">
      <div id="edit-container">
        <h2>Add New Subscription</h2>
        <label class="input-container">
          Service Name
          <input type="text" placeholder="Enter service name" id="add-service"/>
        </label>

        <label class="input-container">
          Payment Amount
          <input type="text" id="add-amount"/>
        </label>

        <div class="frequency-container">
          <p>Payment Frequency</p>
          <label class="frequency-selection">
            <input type="checkbox" id="add-frequency-monthly"/>
            Monthly
          </label>

          <label class="frequency-selection" id="add-frequency-yearly">
            <input type="checkbox" />
            Yearly
          </label>
        </div>

        <label class="due-container">
          Next Payment Date
          <input type="text" placeholder="YYYY-MM-DD" id="add-due"/>
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

    const submitButton = document.getElementById("add-submit");
    if (submitButton) {
      submitButton.addEventListener("click", async () => {
        const serviceName = document.getElementById("add-service");
        const paymentAmount = document.getElementById("add-amount");
        let frequencyMonthly = document.getElementById("add-frequency-monthly");
        let frequencyYearly = document.getElementById("add-frequency-yearly");
        const nextPayDate = document.getElementById("add-due");

        if (
          !serviceName ||
          !paymentAmount ||
          !frequencyMonthly ||
          !nextPayDate
        ) {
          console.log("One or more required elements are missing");
          return;
        }

        if (paymentAmount.value[0] != "$") {
          paymentAmount.value = "$" + paymentAmount.value;
        }

        if (!frequencyMonthly.checked && !frequencyYearly.checked) {
          notify("A duration must be selected!");
          return;
        }

        if (frequencyMonthly.checked) {
          frequencyMonthly = "Monthly";
        } else {
          frequencyMonthly = "Yearly";
        }

        await setDoc(doc(db, "users", userId, "services", serviceName.value), {
          Amount: paymentAmount.value,
          Due: nextPayDate.value,
          Frequency: frequencyMonthly,
          Service: serviceName.value,
        });
      });
    }
  });
}
