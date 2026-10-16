/* ========================================================
   Authentication & Interactive Controls
   ======================================================== */

// SHA-256 helper function (accessible in browser console via sha("user:pass"))
async function sha(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Authorized credentials
// Precomputed SHA-256 for 'admin:Marketing@2026'
const USERS = [
  "admin:Marketing@2026",
  "6f47aa2810a08e0dae95454fae896434458f2d5e7774ae72bb83fc7ea9d46083"
];

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login");
  const appSection = document.getElementById("app");
  const uInput = document.getElementById("u");
  const pInput = document.getElementById("p");
  const goBtn = document.getElementById("go");
  const errText = document.getElementById("err");
  const eyeBtn = document.getElementById("eye");
  const outBtn = document.getElementById("out");
  const box = document.querySelector(".box");

  // 1. Password Show/Hide Toggle Button
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

  // 2. Check if user is already logged in
  if (sessionStorage.getItem("auth") === "1") {
    loginSection.hidden = true;
    appSection.hidden = false;
  }

  // 3. Login Attempt Function
  async function attemptLogin() {
    errText.textContent = "";
    const u = uInput.value.trim().toLowerCase();
    const p = pInput.value;

    if (!u || !p) {
      errText.textContent = "Please enter both username and password.";
      shake();
      return;
    }

    goBtn.classList.add("load");

    try {
      const combo = `${u}:${p}`;
      const hashed = await sha(combo);

      // Verify either raw pair or hash match
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
          errText.textContent = "Invalid username or password.";
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
      void box.offsetWidth; // trigger reflow
      box.classList.add("shake");
    }
  }

  // 4. Attach Listeners
  if (goBtn) goBtn.addEventListener("click", attemptLogin);

  [uInput, pInput].forEach((input) => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") attemptLogin();
      });
    }
  });

  // 5. Sign Out
  if (outBtn) {
    outBtn.addEventListener("click", () => {
      sessionStorage.removeItem("auth");
      pInput.value = "";
      appSection.hidden = true;
      loginSection.hidden = false;
    });
  }
});
