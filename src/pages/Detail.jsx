import { useEffect, useState } from "react";
import tmdbApi from "../api/tmdbApi";
import { useParams } from "react-router-dom";
import { NavBar } from "../components/layouts/NavBar";
import { Footer } from "../components/layouts/Footer";

export function Detail() {
  const { category, id } = useParams();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await tmdbApi.getDetails(category, id, {
          language: "en-US",
        });
        setDetails(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchDetails();
  }, [category, id]);
  return (
    <>
      <NavBar />
      <h1 className="text-white">Ini laman detail</h1>
      <Footer />
    </>
  );
}
