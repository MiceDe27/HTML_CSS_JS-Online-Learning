import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc // ✅ FIXED: added this to avoid "getDoc is not defined" error
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0A-U6gHVNN50gRZFfpqcTotQRH2p5JAI",
  authDomain: "my-web-317c1.firebaseapp.com",
  projectId: "my-web-317c1",
  storageBucket: "my-web-317c1.firebasestorage.app",
  messagingSenderId: "860504122814",
  appId: "1:860504122814:web:2db0b7d2eeb559eff085ef",
  measurementId: "G-Z5TJFD3SHV"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ DOM Elements
const userTable = document.getElementById("userTable").querySelector("tbody");
const searchBox = document.getElementById("searchBox");
const userCount = document.getElementById("userCount");

// ✅ Protect admin.html (only for admin)
onAuthStateChanged(auth, async (user) => {
  if (!user) return redirect();

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().role !== "admin") {
    redirect();
  } else {
    loadUsers(); // ✅ Only load if admin
  }
});

function redirect() {
  alert("Access denied. Admins only.");
  window.location.href = "login_signup_reset.html";
}

// ✅ Load and display all users
async function loadUsers() {
  userTable.innerHTML = "";
  const snapshot = await getDocs(collection(db, "users"));
  const users = [];

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    users.push({ id: docSnap.id, ...data });
  });

  displayUsers(users);

  // ✅ Enable search filter
  searchBox.addEventListener("input", () => {
    const filtered = users.filter(u =>
      u.fullname.toLowerCase().includes(searchBox.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchBox.value.toLowerCase())
    );
    displayUsers(filtered);
  });
}

// ✅ Display users in table
function displayUsers(users) {
  userTable.innerHTML = "";
  userCount.textContent = users.length;

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td contenteditable="true" onblur="updateField('${user.id}', 'fullname', this.innerText)">${user.fullname}</td>
      <td contenteditable="true" onblur="updateField('${user.id}', 'email', this.innerText)">${user.email}</td>
      <td contenteditable="true" onblur="updateField('${user.id}', 'password', this.innerText)">${user.password || user.password}</td>
      <td>
        <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
  });
}

// ✅ Delete user
window.deleteUser = async function (id) {
  if (confirm("Are you sure you want to delete this user?")) {
    await deleteDoc(doc(db, "users", id));
    loadUsers();
  }
};

// ✅ Update user field (name, email, password)
window.updateField = async function (id, field, value) {
  await updateDoc(doc(db, "users", id), {
    [field]: value
  });
};