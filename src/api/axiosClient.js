// axiosClient.js
import axios from "axios";

const API_KEY = "2971b5f8e778ef3649ba6fa06e80f430";
const BASE_URL = "https://api.themoviedb.org/3/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Fungsi untuk membangun URL gambar berdasarkan ukuran
axiosClient.getImageUrl = {
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
