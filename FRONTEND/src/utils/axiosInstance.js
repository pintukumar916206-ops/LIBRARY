import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  if (!url.endsWith("/api/v1")) {
    url = url.endsWith("/") ? `${url}api/v1` : `${url}/api/v1`;
  }
  return url;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
