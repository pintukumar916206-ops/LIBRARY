import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const envURL = import.meta.env.VITE_API_URL;
  const productionFallback = "https://library-backend-igey.onrender.com";
  
  if (import.meta.env.PROD) {
    console.log("PRODUCTION MODE: VITE_API_URL =", envURL || "Using Failsafe Fallback");
  }

  let url = envURL || (import.meta.env.PROD ? productionFallback : "http://localhost:4000");
  
  if (!url.endsWith("/api/v1")) {
    url = url.endsWith("/") ? `${url}api/v1` : `${url}/api/v1`;
  }

  config.baseURL = url;
  config.withCredentials = true;
  
  return config;
});

export default axiosInstance;
