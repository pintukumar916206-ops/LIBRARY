import axios from "axios";

const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  
  // FAILSAFE FALLBACK: If Render environment variables fail during build, use your specific Backend URL
  const productionFallback = "https://library-backend-1gey.onrender.com";
  
  if (import.meta.env.PROD) {
    console.log("PRODUCTION MODE: VITE_API_URL =", envURL || "Using Failsafe Fallback");
  }

  let url = envURL || (import.meta.env.PROD ? productionFallback : "http://localhost:4000");

  if (!url.endsWith("/api/v1")) {
    url = url.endsWith("/") ? `${url}api/v1` : `${url}/api/v1`;
  }
  
  return url;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
