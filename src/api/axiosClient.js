import axios from "axios";
import apiConfig from "./apiConfig";
const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams({
      ...params,
      api_key: apiConfig.apiKey,
    });
    return searchParams.toString();
  },
});
axiosClient.interceptors.request.use(async (config) => config);
axiosClient.interceptors.response.use(
  (res) => {
    if (res && res.data) {
      return res.data;
    }
    return res;
  },
  (error) => {
    throw error;
  }
);
export default axiosClient;
