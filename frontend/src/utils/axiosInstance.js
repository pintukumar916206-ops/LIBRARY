import axios from "axios";

const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  
  // Debug log to help identify the issue in production console
  if (import.meta.env.PROD) {
    console.log("PRODUCTION MODE: VITE_API_URL =", envURL);
  }

  let url = envURL || "http://localhost:4000";

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
