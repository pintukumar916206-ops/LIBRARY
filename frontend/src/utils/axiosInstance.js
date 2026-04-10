import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const envURL = import.meta.env.VITE_API_URL;
  
  if (import.meta.env.PROD && !envURL) {
    console.warn("WARNING: VITE_API_URL is not set in production. Connection may fail.");
  }

  let url = envURL || "http://localhost:4000";
  
  if (!url.endsWith("/api/v1")) {
    url = url.endsWith("/") ? `${url}api/v1` : `${url}/api/v1`;
  }

  config.baseURL = url;
  config.withCredentials = true;
  
  return config;
});

export default axiosInstance;
