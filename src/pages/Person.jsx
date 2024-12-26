import { useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi from "../api/tmdbApi";

export function Person() {
  const { id } = useParams(); // Ambil id dari parameter URL

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await tmdbApi.getPerson(id, {
          language: "en-US",
        });
        console.log(response);
      } catch (error) {
        console.error("Can't fetch details of this person");
      }
    };

    if (id) {
      fetchPerson(); // Pastikan ID tersedia sebelum memanggil fungsi
    }
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="relative flex-1 h-screen lg:h-80">Ini Laman Profile</div>
      <Footer />
    </div>
  );
}
