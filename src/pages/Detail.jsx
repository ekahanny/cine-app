import { useEffect, useState } from "react";
import tmdbApi from "../api/tmdbApi";
import { useParams } from "react-router-dom";
import { NavBar } from "../components/layouts/NavBar";
import { Footer } from "../components/layouts/Footer";
import axiosClient from "../api/axiosClient";
import { Carousel } from "../components/elements/Carousel";
import { Divider } from "../components/elements/Divider";
import Avatar from "../assets/images/user.png";
import MovieCard from "../components/elements/MovieCard";

export function Detail() {
  const { category, id } = useParams();
  const [details, setDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const [casts, setCasts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [displayedLength, setDisplayedLength] = useState([]); // Panjang awal karakter
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Fetch Details
        const response = await tmdbApi.getDetails(category, id, {
          language: "en-US",
        });
        await new Promise((resolve) => setTimeout(resolve, 4000));
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
        setVideos(videoResponse.results.slice(0, 8));

        // Fetch Image Preview
        const previewResponse = await tmdbApi.getImgPreview(category, id, {
          language: "en-US",
          include_image_language: "en,null",
        });
        setImgPreview(previewResponse.backdrops.slice(0, 10));

        // Fetch Reviews
        const reviewRes = await tmdbApi.getReviews(category, id, {
          language: "en-US",
        });
        setReviews(reviewRes.results);

        // For the 'Read More...'
        setDisplayedLength(reviewRes.results.map(() => 300));

        // Fetch Recommendations
        const RecommendationsRes = await tmdbApi.getRecommendations(
          category,
          id,
          {
            language: "en-US",
          }
        );
        setRecommendations(RecommendationsRes.results.slice(0, 2));
        console.log(RecommendationsRes.results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [category, id]);

  const handleReadMore = (index) => {
    setDisplayedLength((prev) => {
      const newLengths = [...prev];
      newLengths[index] += 300;
      return newLengths;
    });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-bars loading-lg text-info"></span>
        </div>
      ) : details ? (
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
                <Carousel items={imgPreview} name="image" />
              </div>

              {/* Video Carousel */}
              <div>
                <Divider name="Videos" />
                <Carousel items={videos} name="video" />
              </div>

              {/* Reviews */}
              <div>
                <Divider name="Reviews & Comments" />
                {reviews.length > 0 ? (
                  reviews.map((review, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-indigo-900 text-white border border-white rounded-md m-4"
                      >
                        {/* Profile Picture, Name, and Date */}
                        <div className="flex flex-row ml-4 mt-4">
                          <img
                            src={
                              review.author_details.avatar_path
                                ? axiosClient.getImageUrl.originalImage(
                                    review.author_details.avatar_path
                                  )
                                : Avatar
                            }
                            className={`w-12 h-12 mt-1 ${
                              review.author_details.avatar_path
                                ? "rounded-full w-13 h-13"
                                : ""
                            }`}
                            alt=""
                          />
                          <div className="ml-3">
                            <p className="font-semibold text-xl">
                              {review.author_details.username}
                            </p>
                            <div className="flex flex-row">
                              <p>{review.updated_at.slice(0, 10)} </p>
                              <p
                                className={`ml-1 ${
                                  review.created_at === review.updated_at
                                    ? "hidden"
                                    : ""
                                }`}
                              >
                                {" "}
                                • Edited
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Content of Reviews */}
                        <p className="py-3 px-4">
                          {review.content.slice(0, displayedLength[index])}
                          {displayedLength[index] < review.content.length && (
                            <span
                              className="text-blue-500 cursor-pointer"
                              onClick={() => handleReadMore(index)}
                            >
                              {" "}
                              ...Read More
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white font-semibold text-2xl px-6 py-5 italic">
                    No Reviews Yet..
                  </p>
                )}
              </div>

              {/* Recommendations */}
              <Divider name="You Might Also Like" />
              <MovieCard
                items={recommendations}
                category="movie"
                titleKey="title"
                type="recommendations"
              />
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
