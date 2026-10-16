// Client-side login gate. Users are stored as SHA-256 hashes of "username:password" (username lowercase).
// Default login -> username: admin   password: Marketing@2026   (CHANGE IT, see README.md)
const USERS = ["c205d90f453c8477311a32d639016153d28d3cd281ed776637d47228b83d4de3"];
const SESSION_MIN = 30;
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const Auth = {
  ok() { const t = +sessionStorage.getItem("mx_t"); return t && Date.now() - t < SESSION_MIN * 6e4; },
  async login(u, p) {
    const lock = +localStorage.getItem("mx_lock") || 0;
    if (Date.now() < lock) return "Too many attempts. Try again in a few minutes.";
    if (USERS.includes(await sha(u.trim().toLowerCase() + ":" + p))) {
      sessionStorage.setItem("mx_t", Date.now()); localStorage.removeItem("mx_f"); return "";
    }
    const f = (+localStorage.getItem("mx_f") || 0) + 1; localStorage.setItem("mx_f", f);
    if (f >= 5) { localStorage.setItem("mx_lock", Date.now() + 5 * 6e4); localStorage.setItem("mx_f", 0); }
    return "Wrong username or password.";
  },
  logout() { sessionStorage.removeItem("mx_t"); location.reload(); }
};
