import axios from "axios";
import API_URL from "./config";

axios.interceptors.request.use(
  (config) => {
    if (!config || !config.url) {
      return config;
    }

    const LOCALHOST_BASE = "http://localhost:8081";

    if (  
      config.url.startsWith(LOCALHOST_BASE) &&
      API_URL !== LOCALHOST_BASE
    ) {
      config.url = config.url.replace(LOCALHOST_BASE, API_URL);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);