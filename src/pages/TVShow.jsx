import { useEffect, useState } from "react";
import MovieCard from "../components/elements/MovieCard";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi, { tvType } from "../api/tmdbApi";

export function TVShow() {
  const [tvShows, setTvShows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(tvType.popular);
  const [loading, setLoading] = useState(true);
  const [page, setPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTvShows = async (currentPage) => {
    try {
      const response = await tmdbApi.getTvShows(selectedCategory, {
        language: "en-US",
        page: currentPage,
      });
      setTvShows((prevTvShow) => [...prevTvShow, ...response.results]);

      if (currentPage >= response.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    }
  };

  useEffect(() => {
    const loadInitialTVShow = async () => {
      try {
        const response = await tmdbApi.getTvShows(selectedCategory, {
          language: "en-US",
          page: 1,
        });

        setTimeout(() => {
          setTvShows(response.results);
          setLoading(false);
        }, 4000);
      } catch (error) {
        console.error("Error fetching initial TV Show: ", error);
        setLoading(false);
      }
    };

    loadInitialTVShow();
  }, [selectedCategory]);

  const loadPages = async () => {
    const nextPage = page + 1;
    await fetchTvShows(nextPage);
    setPages(nextPage);
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
              <option value={tvType.popular}>Popular</option>
              <option value={tvType.top_rated}>Top Rated</option>
              <option value={tvType.on_the_air}>On The Air</option>
            </select>
          </label>
          <MovieCard
            items={tvShows}
            category="tv"
            titleKey="name"
            release_date="first_air_date"
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
