import { app, db, auth } from "./script.js";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

let userId;

function notify(message, duration = 3000) {
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
      notification.classList.remove("show");

      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

function createOverlay(data = {}) {
  const body = document.body;

  body.insertAdjacentHTML(
    "beforeend",
    `
    <div id="add-overlay">
      <div id="edit-container">
        <h2>Edit Subscription</h2>
        <label class="input-container">
          Service Name
          <input type="text" placeholder="Enter service name" id="add-service" value="${data.Service || ""}"/>
        </label>

        <label class="input-container">
          Payment Amount
          <input type="text" id="add-amount" value="${data.Amount || ""}"/>
        </label>

        <div class="frequency-container">
          <p>Payment Frequency</p>
          <label class="frequency-selection">
            <input type="checkbox" id="add-frequency-monthly" ${data.Frequency === "Monthly" ? "checked" : ""}/>
            Monthly
          </label>

          <label class="frequency-selection">
            <input type="checkbox" id="add-frequency-yearly" ${data.Frequency === "Yearly" ? "checked" : ""}/>
            Yearly
          </label>
        </div>

        <label class="due-container">
          Next Payment Date
          <input type="text" placeholder="YYYY-MM-DD" id="add-due" value="${data.Due || ""}"/>
        </label>

        <button id="add-submit" class="submit-button">Submit</button>
        <button id="cancel-submit">Cancel</button>
      </div>
    </div>
    `,
  );
  linkCancel();
}

async function handleFormSubmit(mode) {
  const serviceName = document.getElementById("add-service");
  const paymentAmount = document.getElementById("add-amount");
  let frequencyMonthly = document.getElementById("add-frequency-monthly");
  let frequencyYearly = document.getElementById("add-frequency-yearly");
  const nextPayDate = document.getElementById("add-due");

  if (!serviceName || !paymentAmount || !frequencyMonthly || !nextPayDate) {
    console.log("One or more required elements are missing");
    return;
  }

  if (serviceName.value === "") {
    notify("A service name must be selected!");
    return;
  }

  if (paymentAmount.value[0] != "$") {
    paymentAmount.value = "$" + paymentAmount.value;
  }

  if (frequencyMonthly.checked === frequencyYearly.checked) {
    notify("A single duration must be selected!");
    return;
  }

  const frequency = frequencyMonthly.checked ? "Monthly" : "Yearly";

  if (mode === "edit") {
    // serviceName is firestore doc id
    await deleteDoc(doc(db, "users", userId, "services", serviceName.value));
  }

  await setDoc(doc(db, "users", userId, "services", serviceName.value), {
    Amount: paymentAmount.value,
    Due: nextPayDate.value,
    Frequency: frequency,
    Service: serviceName.value,
  });
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;

    const docRef = collection(db, "users", userId, "services");
    const docSnap = await getDocs(docRef);
    const container = document.getElementById("content-container");

    if (docSnap) {
      docSnap.forEach((fireDoc) => {
        const docData = fireDoc.data();

        if (container) {
          container.insertAdjacentHTML(
            "beforeend",
            `
          <div class="subscription">
          <p id="service">${docData.Service}</p>
          <p>${docData.Amount}</p>
          <p>${docData.Frequency}</p>
          <p>${docData.Due}</p>
          <div class="actions">
            <button class="edit-button" id="${
              docData.Service + "-edit"
            }">Edit</button>
            <button class="delete-button" id="${
              docData.Service + "-delete"
            }">Delete</button>
          </div>
        </div>
        `,
          );
        }

        const editButton = document.getElementById(docData.Service + "-edit");
        if (editButton) {
          editButton.addEventListener("click", async () => {
            createOverlay(docData);

            const submit = document.getElementById("add-submit");
            if (submit) {
              submit.addEventListener("click", () => {
                handleFormSubmit("edit");
              });
            }
          });
        }

        const deleteButton = document.getElementById(
          docData.Service + "-delete",
        );
        if (deleteButton) {
          deleteButton.addEventListener("click", async () => {
            try {
              await deleteDoc(
                doc(db, "users", userId, "services", docData.Service),
              );
              notify("Subscription deleted!");
            } catch (error) {
              notify("Error while deleting subscription check console");
              console.log(error.message);
            }
          });
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

    createOverlay();

    const submitButton = document.getElementById("add-submit");
    if (submitButton) {
      submitButton.addEventListener("click", async () => {
        handleFormSubmit("add");
      });
    }
  });
}

function linkCancel() {
  const cancelButton = document.getElementById("cancel-submit");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      const overlay = document.getElementById("add-overlay");
      if (overlay) {
        overlay.remove();
      }
    });
  }
}
