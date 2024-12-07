import { useEffect, useState } from "react";
import tmdbApi from "../api/tmdbApi";
import { useParams } from "react-router-dom";
import { NavBar } from "../components/layouts/NavBar";
import { Footer } from "../components/layouts/Footer";
import axiosClient from "../api/axiosClient";
import { Carousel } from "../components/elements/Carousel";
import { Divider } from "../components/elements/Divider";

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

        // Fetch Videos
        const videoResponse = await tmdbApi.getVideos(category, id, {
          language: "en-US",
        });
        setVideos(videoResponse.results);
        console.log("video response: ", videoResponse.results);

        // Fetch Image Preview
        const previewResponse = await tmdbApi.getImgPreview(category, id, {
          language: "en-US",
          include_image_language: "en,null",
        });
        setImgPreview(previewResponse.backdrops.slice(0, 10));
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
            <p className="text-white text-sm font-semibold text-center mt-2 px-6 leading-5">
              {details.overview}
            </p>

            {/* Carousel Casts */}
            <div>
              <Divider name="Casts" />
              <div className="carousel carousel-center max-w-sm h-72 space-x-2 py-2 px-2">
                {casts?.cast?.slice(0, 10).map((cast) => (
                  <div key={cast.id} className="carousel-item relative">
                    {/* Gambar Cast */}
                    <img
                      src={
                        cast.profile_path
                          ? axiosClient.getImageUrl.w500Image(cast.profile_path)
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      }
                      className="rounded-box object-cover w-full h-full"
                      alt={cast.name}
                    />
                    {/* Overlay Hitam */}
                    <div className="absolute inset-0  flex items-end justify-center">
                      <p className="text-white text-center font-semibold bg-black bg-opacity-50 w-full py-2">
                        {cast.name} <br />
                        <span className="text-sm italic">
                          as {cast.character}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Movie Poster */}
              <div>
                <Divider name="Movie Posters" />
                {/* Carousel Movie Poster */}
                <Carousel items={imgPreview} />
              </div>

              {/*  */}
            </div>
          </div>
        </div>
      ) : (
        <p>No items available.</p>
      )}

      <Footer />
    </div>
  );
}
