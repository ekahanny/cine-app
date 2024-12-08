import { useEffect, useState } from "react";
import MovieCard from "../components/elements/MovieCard";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi, { tvType } from "../api/tmdbApi";

export function TVShow() {
  const [tvShows, setTvShows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(tvType.popular);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTvShows = async () => {
      setLoading(true);
      try {
        const response = await tmdbApi.getTvShows(selectedCategory, {
          language: "en-US",
          page: 1,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setTvShows(response.results);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTvShows();
  }, [selectedCategory]);

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
            type="general"
            release_date="first_air_date"
          />
        </>
      )}
      <Footer />
    </div>
  );
}
