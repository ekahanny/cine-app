import axios from "axios";

const API_KEY = import.meta.env.VITE_APIKEY;
const BASE_URL = "https://api.themoviedb.org/3/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// mengambil URL gambar berdasarkan ukuran
axiosClient.getImageUrl = {
  originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
};

axiosClient.getVideo = {
  youtubeVid: (keyVideo) => `https://www.youtube.com/embed/${keyVideo}`,
};

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
