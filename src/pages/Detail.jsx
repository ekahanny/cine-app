import { useEffect, useState } from "react";
import tmdbApi from "../api/tmdbApi";
import { useParams } from "react-router-dom";
import { NavBar } from "../components/layouts/NavBar";
import { Footer } from "../components/layouts/Footer";
import axiosClient from "../api/axiosClient";
import { Carousel } from "../components/elements/Carousel";
import { Divider } from "../components/elements/Divider";
import Avatar from "../assets/images/user.png";
import { Link } from "react-router-dom";

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
        await new Promise((resolve) => setTimeout(resolve, 6000));
        setDetails(response);

        // Fetch Casts
        const castsResponse = await tmdbApi.getCredits(category, id, {
          language: "en-US",
        });
        console.log("Casts response: ", castsResponse);

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
        setRecommendations(RecommendationsRes.results);
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
        <div className="relative flex-1 h-screen lg:h-80">
          {/* Backdrop path */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(${axiosClient.getImageUrl.originalImage(
                details.backdrop_path
              )})`,
              backgroundPosition: "top",
              filter: "brightness(60%)",
            }}
          >
            {/* Overlay gelap */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
          </div>

          {/* Konten */}
          <div className="relative z-10 pt-10 pb-3 flex flex-col justify-center items-center h-full">
            {/* Poster */}
            <img
              className="w-60 lg:w-64"
              src={
                details.poster_path
                  ? axiosClient.getImageUrl.originalImage(details.poster_path)
                  : ""
              }
              alt={details.title || details.name}
            />

            {/* Judul & Tahun */}
            <div className="flex flex-row gap-2 mt-5 text-center px-5">
              <h1 className="text-lg font-bold text-white">
                {details.title || details.name} (
                {(
                  details.release_date ||
                  details.first_air_date ||
                  ""
                ).substring(0, 4)}
                ){" "}
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
              {details.genres?.slice(0, 2).map((genre) => (
                <div className="flex flex-row border my-4 mt-6 border-white bg-[#09093d] p-2 text-sm font-semibold rounded-lg">
                  <p className="text-white items-center">{genre.name}</p>
                </div>
              ))}
            </div>

            {/* Deskripsi Singkat */}
            <p className="text-white text-sm lg:text-2xl font-semibold text-center mt-2 px-6 leading-5 lg:px-60">
              {details.overview}
            </p>

            <div className="mt-3">
              {/* Carousel Casts */}
              <Divider name="Casts" />
              <div className="carousel carousel-center max-w-sm h-72 space-x-2 py-2 px-2 lg:max-w-none lg:px-5 mt-2">
                {casts?.cast?.length > 0 ? (
                  casts.cast.slice(0, 10).map((cast) => (
                    <div key={cast.id} className="carousel-item relative">
                      <Link to={`/person/${cast.id}`} key={cast.id}>
                        {/* Gambar Cast */}
                        <img
                          src={
                            cast.profile_path
                              ? axiosClient.getImageUrl.w500Image(
                                  cast.profile_path
                                )
                              : "https://placehold.co/500x750?text=No+Image"
                          }
                          className="rounded-box object-cover w-full h-full"
                          alt={cast.name}
                        />

                        {/* Overlay Hitam */}
                        <div className="absolute inset-0 flex items-end justify-center">
                          <p className="text-white text-center font-semibold bg-black bg-opacity-50 w-full py-2">
                            {cast.name} <br />
                            <span className="text-sm italic">
                              as {cast.character}
                            </span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-white font-semibold text-2xl px-6 py-5 italic lg:px-10 lg:py-6">
                    No Casts Available...
                  </p>
                )}
              </div>

              {/* Movie Poster */}
              <div className="mt-4">
                <Divider name="Movie Posters" />
                {/* Carousel Movie Poster */}
                <div className="lg:px-10 lg:py-2">
                  <Carousel items={imgPreview} name="image" />
                </div>
              </div>

              {/* Video Carousel */}
              <div className="mt-5">
                <Divider name="Videos" />
                <div className="lg:px-6">
                  <Carousel items={videos} name="video" />
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="mb-10">
                  <Divider name="Reviews & Comments" />
                </div>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-indigo-900 text-white border border-white rounded-md m-4 lg:mx-24 lg:mt-6"
                      >
                        {/* Profile Picture, Name, and Date */}
                        <div className="flex flex-row ml-4 mt-4 lg:ml-8">
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
                        <p className="py-3 px-4 lg:px-8 mb-3">
                          {/* Teks penuh untuk layar besar */}
                          <span className="hidden lg:block">
                            {review.content}
                          </span>

                          {/* Teks terbatas + "Read More" untuk layar kecil */}
                          <span className="block lg:hidden">
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
                          </span>
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-white font-semibold text-2xl px-6 py-5 italic lg:px-10 lg:py-6">
                    No Reviews Yet..
                  </p>
                )}
              </div>

              {/* Recommendations */}
              <div className="mt-10 mb-3">
                <Divider name="You Might Also Like" />
                <div className="carousel carousel-center max-w-sm h-72 space-x-2 py-2 px-2 lg:max-w-none lg:px-5 mt-2">
                  {recommendations.slice(0, 10).map((rec) => (
                    <div
                      key={rec.id}
                      className="carousel-item relative flex flex-col"
                    >
                      <Link to={`/${category}/${rec.id}`}>
                        <img
                          src={
                            rec.poster_path
                              ? axiosClient.getImageUrl.w500Image(
                                  rec.poster_path
                                )
                              : "https://placehold.co/500x750?text=No+Image"
                          }
                          className="w-40 rounded-lg border border-white transform transition-transform duration-300 hover:scale-105"
                          alt={rec.title || rec.name || "Unknown"}
                        />

                        <h1 className="text-white mt-2 lg:mt-3 font-semibold text-lg">
                          <span className="block lg:hidden">
                            {rec.title?.length > 10
                              ? `${rec.title.slice(0, 10)}...`
                              : rec.title ||
                                (rec.name?.length > 10
                                  ? `${rec.name.slice(0, 10)}...`
                                  : rec.name) ||
                                "No Title"}
                          </span>
                          <span className="hidden lg:block">
                            {rec.title?.length > 15
                              ? `${rec.title.slice(0, 15)}...`
                              : rec.title ||
                                (rec.name?.length > 15
                                  ? `${rec.name.slice(0, 15)}...`
                                  : rec.name) ||
                                "No Title"}
                          </span>
                        </h1>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white font-semibold text-2xl px-6 py-5 italic">
          No items available.
        </p>
      )}

      <Footer />
    </div>
  );
}
