import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ✅ Corrected Firebase config (NO IMAGE)
const firebaseConfig = {
  apiKey: "AIzaSyB0A-U6gHVNN50gRZFfpqcTotQRH2p5JAI",
  authDomain: "my-web-317c1.firebaseapp.com",
  projectId: "my-web-317c1",
  storageBucket: "my-web-317c1.appspot.com",
  messagingSenderId: "860504122814",
  appId: "1:860504122814:web:2db0b7d2eeb559eff085ef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login_signup_reset.html";
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      document.getElementById("profileName").textContent = userData.fullname || "No Name";
      document.getElementById("profileEmail").textContent = userData.email || "No Email";

      const [first = "", last = ""] = (userData.fullname || "").split(" ");
      document.getElementById("editFirst").value = first;
      document.getElementById("editLast").value = last;
      document.getElementById("editEmail").value = userData.email || "";
      document.getElementById("editUsername").value = userData.username || "";
      document.getElementById("editPhone").value = userData.phone || "";
      document.getElementById("editBirth").value = userData.birth || "";
      document.getElementById("editGender").value = userData.gender || "Other";
    }
  });
});

// Toggle Edit
window.toggleEdit = function (show) {
  document.getElementById("editSection").style.display = show ? "block" : "none";
  document.querySelector(".profile-section").style.display = show ? "none" : "block";
};

// Update profile data
window.updateProfile = async function () {
  const first = document.getElementById("editFirst").value.trim();
  const last = document.getElementById("editLast").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const username = document.getElementById("editUsername").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const birth = document.getElementById("editBirth").value.trim();
  const gender = document.getElementById("editGender").value;

  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      fullname: `${first} ${last}`.trim(),
      email,
      username,
      phone,
      birth,
      gender
    });

    alert("Profile updated successfully!");
    window.location.reload();
  } catch (err) {
    alert("Error updating profile: " + err.message);
  }
};

// Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login_signup_reset.html";
  });
};