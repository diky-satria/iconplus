import Axios from "axios";
import Cookies from "js-cookie";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      Cookies.remove("authToken");

      localStorage.removeItem("persist:root");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axios;
