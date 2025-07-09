import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0A-U6gHVNN50gRZFfpqcTotQRH2p5JAI",
  authDomain: "my-web-317c1.firebaseapp.com",
  projectId: "my-web-317c1",
  storageBucket: "my-web-317c1.appspot.com",
  messagingSenderId: "860504122814",
  appId: "1:860504122814:web:2db0b7d2eeb559eff085ef",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Switch between pages
window.switchPage = function (pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
};

// Register User
window.registerUser = async function () {
  const fullname = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;

  if (!fullname || !email || !password || !confirm) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      fullname: fullname,
      email: email,
      password: password, // ⚠️ Don't store raw passwords in production!
      createdAt: new Date().toISOString(),
    });

    alert("Account created!");
    switchPage("loginPage");
  } catch (error) {
    alert("Error: " + error.message);
  }
};

// Login User with Session Persistence
window.loginUser = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    await setPersistence(auth, browserLocalPersistence); // 👈 Add this
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (email === "admin@email.com") {
      window.location.href = "admin.html";
    } else {
      alert("Welcome!");
      window.location.href = "index.html";
    }
  } catch (error) {
    alert("Login Failed: " + error.message);
  }
};

// Send Reset Link
window.sendResetLink = async function () {
  const email = document.getElementById("resetEmail").value.trim();

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Reset link sent to your email.");
    switchPage("loginPage");
  } catch (error) {
    alert("Error: " + error.message);
  }
};
