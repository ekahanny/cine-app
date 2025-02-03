import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import tmdbApi, { searchType } from "../api/tmdbApi";
import { NavBar } from "../components/layouts/NavBar";
import { Footer } from "../components/layouts/Footer";
import axiosClient from "../api/axiosClient";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchResult, setSearchResult] = useState(query);
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchType.movie);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchResult.trim() !== "") {
      e.preventDefault();
      setSearchParams({ query: searchResult.trim() });
      setResults([]); // Reset hasil pencarian
      setCurrentPage(1);
      setHasMore(true);
      setIsFirstLoad(true); 
    }
  };

  useEffect(() => {
    if (!query) {
      setResults([]);
      setHasMore(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);

      try {
        const res = await tmdbApi.getSearch(query, selectedCategory, {
          query,
          language: "en-US",
          page: currentPage,
        });

        if (isFirstLoad) {
          setTimeout(() => {
            setResults((prevResults) =>
              currentPage === 1
                ? res.results || []
                : [...prevResults, ...(res.results || [])]
            );
            setHasMore(currentPage < res.total_pages);
            setLoading(false);
            setIsFirstLoad(false); // Setelah pertama kali selesai, set isFirstLoad ke false
          }, 2000);
        } else {
          setResults((prevResults) =>
            currentPage === 1
              ? res.results || []
              : [...prevResults, ...(res.results || [])]
          );
          setHasMore(currentPage < res.total_pages);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, selectedCategory, currentPage, isFirstLoad]);

  const loadPages = () => {
    if (!loading && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="lg:px-12 lg:py-6 py-2 min-h-screen">
        {/* Search Bar & Category */}
        <div className="flex flex-row gap-3 lg:gap-4 px-5">
          <label className="form-control mt-4 w-2/5 lg:w-1/4">
            <select
              className="select select-bordered my-0.5"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setResults([]);
                setCurrentPage(1);
                setHasMore(true);
                setIsFirstLoad(true); // Reset isFirstLoad saat kategori berubah
              }}
            >
              <option value={searchType.movie}>Movie</option>
              <option value={searchType.tv}>TV Show</option>
              <option value={searchType.person}>Person</option>
            </select>
          </label>

          <div className="relative flex items-center flex-grow">
            <div className="absolute inset-y-0 start-0 flex items-center mt-1 ps-4 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="p-3.5 mt-4 ps-12 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
              placeholder="Search..."
              value={searchResult}
              onChange={(e) => setSearchResult(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg text-info"></span>
          </div>
        ) : query === "" ? (
          <p className="text-white font-semibold lg:text-2xl px-6 py-5">
            Your results show here.
          </p>
        ) : results.length > 0 ? (
          <div className="grid lg:grid-cols-5 mt-6 lg:mt-7 ml-6 lg:ml-8 mr-3 lg:mr-6 lg:mb-4 grid-rows-4 grid-cols-2 mb-3 gap-1 lg:gap-2">
            {results.map((result) => (
              <Link to={`/${selectedCategory}/${result.id}`} key={result.id}>
                <div key={result.id} className="card relative">
                  <img
                    className="w-40 lg:w-64 lg:mt-3 rounded-lg border border-white transform transition-transform duration-300 hover:scale-105"
                    src={
                      result.profile_path || result.poster_path
                        ? axiosClient.getImageUrl.originalImage(
                            selectedCategory === searchType.person
                              ? result.profile_path
                              : result.poster_path
                          )
                        : "https://placehold.co/500x750?text=No+Image"
                    }
                    alt={result.name || result.title}
                  />
                  <h1 className="text-white mt-2 lg:mt-3 font-semibold text-lg">
                    {selectedCategory === searchType.person
                      ? result.name || "N/A"
                      : result.title || result.name || "N/A"}
                  </h1>
                  <p className="text-white text-lg mb-4">
                    {selectedCategory === searchType.person
                      ? ""
                      : `(${result.release_date?.substring(0, 4) || "N/A"})`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white font-semibold lg:text-2xl px-6 py-5 italic">
            No items available...
          </p>
        )}

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
      </div>
      <Footer />
    </div>
  );
}
