import { useEffect, useState } from "react";
import tmdbApi from "../api/tmdbApi";
import { useParams } from "react-router-dom";
import { NavBar } from "../components/layouts/NavBar";
import { Footer } from "../components/layouts/Footer";
import axiosClient from "../api/axiosClient";

export function Detail() {
  const { category, id } = useParams();
  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const [casts, setCasts] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch Details
        const response = await tmdbApi.getDetails(category, id, {
          language: "en-US",
        });
        setDetails(response);

        // Fetch Casts
        const castsResponse = await tmdbApi.getCredits(category, id, {
          language: "en-US",
        });
        setCasts(castsResponse);
        console.log(castsResponse.cast);

        // Fetch Videos
        const videoResponse = await tmdbApi.getVideos(category, id, {
          language: "en-US",
        });
        setVideos(videoResponse.results);
        console.log("video response: ", videoResponse.results);

        // Fetch Image Preview
        const previewResponse = await tmdbApi.getImgPreview(category, id, {
          language: "en-US",
        });
        setImgPreview(previewResponse);
        console.log("Image preview: ", previewResponse);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchDetails();
  }, [category, id]);
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {details ? (
        <div className="relative flex-1 h-screen">
          {/* Backdrop path */}
          <div
            className="absolute inset-0 top-0 bg-center bg-no-repeat bg-contain lg:bg-cover"
            style={{
              backgroundImage: `url(${axiosClient.getImageUrl.originalImage(
                details.backdrop_path
              )})`,
              backgroundPosition: "top",
              filter: "brightness(60%)",
            }}
          ></div>

          {/* Overlay gelap */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Konten */}
          <div className="relative z-10 py-10 flex flex-col justify-center items-center h-full">
            {/* Poster */}
            <img
              className="w-60"
              src={
                details.poster_path
                  ? axiosClient.getImageUrl.originalImage(details.poster_path)
                  : ""
              }
              alt={details.title}
            />
            {/* Judul & Tahun */}
            <div className="flex flex-row gap-2 mt-5 text-center px-5">
              <h1 className="text-2xl font-bold text-white">
                {details.title} ({details.release_date.substring(0, 4)})
              </h1>
            </div>

            <div className="flex flex-row gap-4">
              {/* Rating */}
              <div
                className="radial-progress text-primary text-sm mt-5"
                style={{
                  "--value": `${details.vote_average * 10}`,
                  "--size": "3rem",
                  "--thickness": "5px",
                }}
                role="progressbar"
              >
                {details.vote_average.toFixed(1)}
              </div>

              {/* Genre */}
              {details.genres.slice(0, 2).map((genre) => (
                <div className="flex flex-row border my-4 mt-6 border-white bg-[#09093d] p-2 text-sm font-semibold rounded-lg">
                  <p className="text-white items-center">{genre.name}</p>
                </div>
              ))}
            </div>

            {/* Deskripsi Singkat */}
            <p className="text-white text-xs font-semibold text-center mt-2 px-6 leading-5">
              {details.overview}
            </p>
          </div>
        </div>
      ) : (
        <p>No items available.</p>
      )}

      <Footer />
    </div>
  );
}
