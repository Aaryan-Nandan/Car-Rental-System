import axios from "axios";
import API_URL from "./config";

axios.interceptors.request.use(
  (config) => {
    if (
      process.env.NODE_ENV === "production" &&
      config.url &&
      config.url.startsWith("http://localhost:8081")
    ) {
      config.url = config.url.replace(
        "http://localhost:8081",
        API_URL
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);