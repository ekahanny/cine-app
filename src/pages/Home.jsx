import { Hero } from "../components/elements/Hero";
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";

export function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Footer />
    </>
  );
}
