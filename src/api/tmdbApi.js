import axios from "axios";
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

export const searchType = {
  movie: "movie",
  person: "person",
  tv: "tv",
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

  getSearch: (query, type, params = {}) => {
    const url = `search/${searchType[type]}`;
    return axiosClient.get(url, {
      params: {
        query,
        ...params,
      },
    });
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

  getRecommendations: (category, id, params = {}) => {
    const url = `${category}/${id}/recommendations`;
    return axiosClient.get(url, { params });
  },

  getPerson: (id, params = {}) => {
    const url = `person/${id}`;
    return axiosClient.get(url, { params });
  },

  getPersonImage: (id, params = {}) => {
    const url = `person/${id}/images`;
    return axiosClient.get(url, { params });
  },

  getPersonCredits: (id, params = {}) => {
    const url = `person/${id}/combined_credits`;
    return axiosClient.get(url, { params });
  },
};

export default tmdbApi;
