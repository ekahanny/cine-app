import React, { useEffect, useState } from "react";
import tmdbApi, { movieType } from "../../api/tmdbApi";
import axiosClient from "../../api/axiosClient";

export const MovieCard = (props) => {
  const [movies, setMovies] = useState([]);

  // Fetch movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Replace 'popular' with any type you want to fetch, such as 'now_playing' or 'top_rated'
        const response = await tmdbApi.getMovies(movieType.popular, {
          language: "en-US",
          page: 1,
        });
        setMovies(response.results); // Assuming response structure is { results: [...] }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      {movies.length > 0 ? (
        movies.map((movie) => (
          <div key={movie.id} className="card">
            <img
              src={
                movie.poster_path
                  ? axiosClient.getImageUrl.w500Image(movie.poster_path)
                  : ""
              }
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>Rating: {movie.vote_average}</p>
          </div>
        ))
      ) : (
        <p>No movies available.</p>
      )}
    </div>
  );
};

export default MovieCard;
