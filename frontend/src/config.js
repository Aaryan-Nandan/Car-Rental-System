const API_URL =
  process.env.REACT_APP_API_BASE ||
  (process.env.NODE_ENV === "production"
    ? "https://car-rental-backend-m9qy.onrender.com"
    : "http://localhost:8081");

export default API_URL;