import { useEffect, useState } from "react";
import MovieCard from "../components/elements/MovieCard";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi, { movieType } from "../api/tmdbApi";

export function Movie() {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(movieType.popular);

  // Fetch API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await tmdbApi.getMovies(selectedCategory, {
          language: "en-US",
          page: 1,
        });
        setMovies(response.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [selectedCategory]);
  return (
    <div>
      <NavBar />
      <label className="form-control w-full max-w-xs mt-4 mx-8">
        <div className="label">
          <span className="label-text text-white font-semibold">
            Select Category
          </span>
        </div>
        <select
          className="select select-bordered"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value={movieType.popular}>Popular</option>
          <option value={movieType.now_playing}>Now Playing</option>
          <option value={movieType.top_rated}>Top Rated</option>
          <option value={movieType.upcoming}>Upcoming</option>
        </select>
      </label>
      <MovieCard items={movies} titleKey="title" release_date="release_date" />
      <Footer />
    </div>
  );
}
