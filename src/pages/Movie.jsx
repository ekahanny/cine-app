import { MovieCard } from "../components/elements/MovieCard";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";

export function Movie() {
  return (
    <div>
      <NavBar />
      <MovieCard />
      <Footer />
    </div>
  );
}
