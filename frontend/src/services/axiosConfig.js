import axios from "axios";
import API_URL from "../config";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
    (config) => {
        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            `${API_URL}${config.url}`
        );

        return config;
    },
    (error) => {
        console.error("AXIOS REQUEST ERROR:", error);
        return Promise.reject(error);
    }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
    (response) => {
        console.log(
            "API RESPONSE:",
            response.status,
            response.config.url
        );

        return response;
    },
    (error) => {
        console.error(
            "API RESPONSE ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        return Promise.reject(error);
    }
);

export default api;