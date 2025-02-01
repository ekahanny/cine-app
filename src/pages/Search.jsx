import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import tmdbApi from "../api/tmdbApi";
import { NavBar } from "../components/layouts/NavBar";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);

      try {
        const res = await tmdbApi.getSearch(query, {
          query,
          language: "en-US",
        });
        setResults(res.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);
  return (
    <>
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for: "{query}"
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <div key={result.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">
                  {result.title || result.name}
                </h2>
                <p>{result.overview || "No description available."}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
}
