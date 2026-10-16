/* ========================================================
   Authentication Script (admin / Marketing@2026)
   ======================================================== */

// SHA-256 generator helper
async function sha(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Authorized credentials list
const USERS = [
  "admin:Marketing@2026",
  "6f47aa2810a08e0dae95454fae896434458f2d5e7774ae72bb83fc7ea9d46083"
];

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login");
  const appSection = document.getElementById("app");
  const uInput = document.getElementById("u");
  const pInput = document.getElementById("pass") || document.getElementById("p");
  const goBtn = document.getElementById("go");
  const errText = document.getElementById("err");
  const eyeBtn = document.getElementById("eye");
  const outBtn = document.getElementById("out");
  const box = document.querySelector(".box");

  // Show/Hide password toggle
  if (eyeBtn && pInput) {
    eyeBtn.addEventListener("click", () => {
      if (pInput.type === "password") {
        pInput.type = "text";
        eyeBtn.textContent = "Hide";
      } else {
        pInput.type = "password";
        eyeBtn.textContent = "Show";
      }
      pInput.focus();
    });
  }

  // Auto-login if session exists
  if (sessionStorage.getItem("auth") === "1") {
    loginSection.hidden = true;
    appSection.hidden = false;
  }

  // Login handler
  async function attemptLogin() {
    errText.textContent = "";
    const u = uInput.value.trim().toLowerCase();
    const p = pInput.value;

    if (!u || !p) {
      errText.textContent = "Please enter username and password.";
      shake();
      return;
    }

    goBtn.classList.add("load");

    try {
      const combo = `${u}:${p}`;
      const hashed = await sha(combo);

      // Check default credentials or hash list
      const isValid =
        (u === "admin" && p === "Marketing@2026") ||
        USERS.includes(combo) ||
        USERS.includes(hashed);

      setTimeout(() => {
        goBtn.classList.remove("load");

        if (isValid) {
          sessionStorage.setItem("auth", "1");
          loginSection.hidden = true;
          appSection.hidden = false;
        } else {
          errText.textContent = "Wrong username or password.";
          shake();
        }
      }, 350);
    } catch (e) {
      goBtn.classList.remove("load");
      errText.textContent = "Login error. Please try again.";
      console.error(e);
    }
  }

  function shake() {
    if (box) {
      box.classList.remove("shake");
      void box.offsetWidth;
      box.classList.add("shake");
    }
  }

  // Attach login button & Enter key press
  if (goBtn) goBtn.addEventListener("click", attemptLogin);

  [uInput, pInput].forEach((input) => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") attemptLogin();
      });
    }
  });

  // Sign out button
  if (outBtn) {
    outBtn.addEventListener("click", () => {
      sessionStorage.removeItem("auth");
      pInput.value = "";
      appSection.hidden = true;
      loginSection.hidden = false;
    });
  }
});
