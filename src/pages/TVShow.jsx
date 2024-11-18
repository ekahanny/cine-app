import { useEffect, useState } from "react";
import MovieCard from "../components/elements/MovieCard";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi, { tvType } from "../api/tmdbApi";

export function TVShow() {
  const [tvShows, setTvShows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(tvType.popular);

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        const response = await tmdbApi.getTvShows(selectedCategory, {
          language: "en-US",
          page: 1,
        });
        setTvShows(response.results);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }
    };
    fetchTvShows();
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
          <option value={tvType.popular}>Popular</option>
          <option value={tvType.top_rated}>Top Rated</option>
          <option value={tvType.on_the_air}>On The Air</option>
        </select>
      </label>
      <MovieCard
        items={tvShows}
        titleKey="name"
        release_date="first_air_date"
      />
      <Footer />
    </div>
  );
}
