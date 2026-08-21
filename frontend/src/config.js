// ============================================================
// API CONFIGURATION
// ============================================================

const LOCAL_API_URL = "http://localhost:8081";

const PRODUCTION_API_URL =
    "https://car-rental-backend-m9qy.onrender.com";

// ============================================================
// AUTOMATIC ENVIRONMENT DETECTION
// ============================================================

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? LOCAL_API_URL
        : PRODUCTION_API_URL;

// Remove accidental trailing slash
const CLEAN_API_URL = API_URL.replace(/\/+$/, "");

console.log("====================================");
console.log("API CONFIGURATION");
console.log("Current host:", window.location.hostname);
console.log("API URL:", CLEAN_API_URL);
console.log("====================================");

export default CLEAN_API_URL;