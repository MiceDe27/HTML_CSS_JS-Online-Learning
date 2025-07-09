// ✅ Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// 🔧 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB0A-U6gHVNN50gRZFfpqcTotQRH2p5JAI",
  authDomain: "my-web-317c1.firebaseapp.com",
  projectId: "my-web-317c1",
  storageBucket: "my-web-317c1.appspot.com",
  messagingSenderId: "860504122814",
  appId: "1:860504122814:web:2db0b7d2eeb559eff085ef"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Load Logged-in User Info
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();

        // Show name
        const nameEl = document.getElementById("userName");
        if (nameEl) nameEl.textContent = data.fullname || "User";

        // Show avatar
        const avatar = document.getElementById("navAvatar");
        const profile = document.getElementById("userAvatar");
        const url = data.photoURL || "Assets/login.png";
        if (avatar) avatar.src = url;
        if (profile) profile.src = url;

      } else {
        console.warn("⚠️ No user document found.");
      }
    } catch (e) {
      console.error("❌ Failed to load user data:", e);
    }
  } else {
    window.location.href = "login_signup_reset.html";
  }
});


// ✅ Course Search & Suggestions
const courses = [
  { name: "HTML Basics", link: "html_basics.html" },
  { name: "CSS Design", link: "css_design.html" },
  { name: "JavaScript Essentials", link: "js_essentials.html" }
];

const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.createElement("div");
suggestionsBox.id = "suggestions";
suggestionsBox.className = "suggestions-box";
document.querySelector(".search-container").appendChild(suggestionsBox);

// 🔍 Show suggestions on input
searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  if (query) {
    const results = courses.filter(course =>
      course.name.toLowerCase().includes(query)
    );

    results.forEach(course => {
      const div = document.createElement("div");
      div.textContent = course.name;
      div.onclick = () => {
        window.location.href = course.link;
      };
      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = results.length ? "block" : "none";
  } else {
    suggestionsBox.style.display = "none";
  }
});

// 🔍 Search button click
searchBtn.addEventListener("click", () => {
  const input = searchBox.value.toLowerCase().trim();
  const match = courses.find(c => c.name.toLowerCase() === input);
  if (match) {
    window.location.href = match.link;
  } else {
    alert("Course not found");
  }
});

// 🧠 Hide suggestions on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    suggestionsBox.style.display = "none";
  }
});

// 🧠 Show suggestions when focused
searchBox.addEventListener("focus", () => {
  if (searchBox.value.trim() !== "") {
    suggestionsBox.style.display = "block";
  }
});