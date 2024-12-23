import { useEffect, useState } from "react";
import MovieCard from "../components/elements/MovieCard";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi, { movieType } from "../api/tmdbApi";
import InfiniteScroll from "react-infinite-scroll-component";

export function Movie() {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(movieType.popular);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // handle infinite scroll

  // Fetch API
  const fetchMovies = async (currentPage) => {
    try {
      const response = await tmdbApi.getMovies(selectedCategory, {
        language: "en-US",
        page: currentPage,
      });
      setMovies((prevMovies) => [...prevMovies, ...response.results]);

      if (currentPage >= response.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
  };

  // Menampilkan data pertama kali
  useEffect(() => {
    const loadInitialMovies = async () => {
      try {
        const response = await tmdbApi.getMovies(selectedCategory, {
          language: "en-US",
          page: 1,
        });

        // Tambahkan delay sebelum data ditampilkan
        setTimeout(() => {
          setMovies(response.results);
          setLoading(false);
        }, 4000);
      } catch (error) {
        console.error("Error fetching initial movies: ", error);
        setLoading(false);
      }
    };

    loadInitialMovies();
  }, [selectedCategory]);

  const loadPages = async () => {
    const nextPage = page + 1;
    await fetchMovies(nextPage);
    setPage(nextPage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-bars loading-lg text-info"></span>
        </div>
      ) : (
        <>
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
          <MovieCard
            items={movies}
            category="movie"
            titleKey="title"
            type="general"
            release_date="release_date"
          />

          {hasMore && (
            <div className="flex justify-center mt-2 mb-6">
              <button
                onClick={loadPages}
                disabled={loading}
                className="btn btn-outline btn-primary"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
}
