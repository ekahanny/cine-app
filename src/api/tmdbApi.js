import axiosClient from "./axiosClient";

export const category = {
  movie: "movie",
  tv: "tv",
};

export const movieType = {
  now_playing: "now_playing",
  popular: "popular",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

export const tvType = {
  on_the_air: "on_the_air",
  popular: "popular",
  top_rated: "top_rated",
};

const tmdbApi = {
  getMovies: (type, params = {}) => {
    const url = `movie/${movieType[type]}`;
    return axiosClient.get(url, { params });
  },

  getTvShows: (type, params = {}) => {
    const url = `tv/${tvType[type]}`;
    return axiosClient.get(url, { params });
  },

  search: (category, query, params = {}) => {
    const url = `search/${category}`;
    return axiosClient.get(url, { params: { query, ...params } });
  },

  getDetails: (category, id, params = {}) => {
    const url = `${category}/${id}`;
    return axiosClient.get(url, { params });
  },

  getCredits: (category, id, params = {}) => {
    const url = `${category}/${id}/credits`;
    return axiosClient.get(url, { params });
  },

  getVideos: (category, id, params = {}) => {
    const url = `${category}/${id}/videos`;
    return axiosClient.get(url, { params });
  },

  getImgPreview: (category, id, params = {}) => {
    const url = `${category}/${id}/images`;
    return axiosClient.get(url, { params });
  },

  getReviews: (category, id, params = {}) => {
    const url = `${category}/${id}/reviews`;
    return axiosClient.get(url, { params });
  },
};

export default tmdbApi;
