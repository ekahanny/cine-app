import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi from "../api/tmdbApi";
import axiosClient from "../api/axiosClient";
import { Divider } from "../components/elements/Divider";

export function Person() {
  const { id } = useParams(); // Ambil id dari parameter URL
  const [loading, setLoading] = useState(false);
  const [personDetail, setPersonDetail] = useState(null);
  const [imagesCollections, setImagesCollections] = useState([]);
  const [credits, setCredits] = useState([]);
  const [visibleCredits, setVisibleCredits] = useState(10);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      try {
        // Fetch Detail of Person
        const response = await tmdbApi.getPerson(id, {
          language: "en-US",
        });
        setPersonDetail(response);

        // Fetch Image of Person
        const ImagesRes = await tmdbApi.getPersonImage(id, {
          language: "en-US",
        });
        setImagesCollections(ImagesRes.profiles);
        console.log("Image Person: ", ImagesRes);

        // Fetch Combined Credits of Person
        const creditRes = await tmdbApi.getPersonCredits(id, {
          language: "en-US",
        });
        setCredits(creditRes.cast);
        console.log("Credit Response: ", creditRes);
      } catch (error) {
        console.error("Can't fetch details of this person");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 4000);
      }
    };

    fetchPerson();
  }, []);

  const handleShowMore = () => {
    setVisibleCredits((prevCredits) => prevCredits + 10);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-bars loading-lg text-info"></span>
        </div>
      ) : personDetail ? (
        <div className="relative flex-1 h-screen lg:h-80">
          {/* Image, Name, & Description */}
          <div className="flex flex-col justify-center items-center">
            {/* Image */}
            <img
              className="object-cover w-44 border border-white rounded-lg mt-6"
              src={
                personDetail.profile_path
                  ? axiosClient.getImageUrl.w500Image(personDetail.profile_path)
                  : "https://placehold.co/500x750?text=No+Image"
              }
              alt={personDetail.name}
            />
            {/* Description & Name */}
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-white text-2xl font-semibold my-3">
                {personDetail.name} (
                {personDetail.deathday
                  ? `${
                      personDetail.birthday
                        ? personDetail.birthday.slice(0, 4)
                        : "Unknown"
                    } - ${personDetail.deathday.slice(0, 4)}`
                  : personDetail.birthday
                  ? personDetail.birthday.slice(0, 4)
                  : "Unknown"}
                )
              </h1>
              {/* Deskripsi di viewport small */}
              <p className="text-white text-center px-7 mb-3 block lg:hidden">
                {personDetail.biography.slice(0, 400)}...
              </p>
              {/* Deskripsi di viewport large */}
              <p className="text-white text-center px-24 mb-3 hidden lg:block">
                {personDetail.biography.slice(0, 750)}...
              </p>
            </div>
          </div>

          {/* Image Collections */}
          <div className="mt-10 mb-3">
            <Divider name="Image Collections" />
            <div className="carousel carousel-center max-w-sm h-72 space-x-2 py-2 px-2 lg:max-w-none lg:px-5 mt-2">
              {imagesCollections.length > 0 ? (
                imagesCollections.map((image, index) => (
                  <div
                    key={index}
                    className="carousel-item relative flex flex-col"
                  >
                    <img
                      src={
                        image.file_path
                          ? axiosClient.getImageUrl.w500Image(image.file_path)
                          : "https://placehold.co/500x750?text=No+Image"
                      }
                      className="w-40 rounded-lg border border-white transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))
              ) : (
                <p className="text-white font-semibold text-2xl px-6 py-5 italic lg:px-10 lg:py-6">
                  No Items Available...
                </p>
              )}
            </div>
          </div>

          {/* List of Credits */}
          <div>
            <Divider name="Credits" />
            <div className="grid lg:grid-cols-5 mt-6 lg:mt-7 ml-6 lg:ml-3 lg:mb-4 grid-cols-2 mb-3">
              {Array.isArray(credits) && credits.length > 0 ? (
                credits.slice(0, visibleCredits).map((credit, index) => {
                  const isTV = credit.media_type === "tv"; // Check media type
                  const displayTitle = isTV ? credit.name : credit.title;
                  const displayDate = isTV
                    ? credit.first_air_date
                    : credit.release_date;

                  return (
                    <Link
                      to={`/${credit.media_type}/${credit.id}`}
                      key={credit.id}
                    >
                      <div key={index} className="card relative">
                        <img
                          className="w-40 lg:w-64 lg:mt-3 rounded-lg border border-white transform transition-transform duration-300 hover:scale-105"
                          src={
                            credit.poster_path
                              ? axiosClient.getImageUrl.originalImage(
                                  credit.poster_path
                                )
                              : "https://placehold.co/500x750?text=No+Image"
                          }
                          alt={displayTitle || "Untitled"}
                        />

                        <h1 className="text-white mt-2 lg:mt-3 font-semibold text-lg">
                          <span className="block lg:hidden">
                            {displayTitle && displayTitle.length > 14
                              ? `${displayTitle.slice(0, 14)}...`
                              : displayTitle || "Untitled"}
                          </span>
                          <span className="hidden lg:block">
                            {displayTitle && displayTitle.length > 24
                              ? `${displayTitle.slice(0, 24)}...`
                              : displayTitle || "Untitled"}
                          </span>
                        </h1>
                        <p className="text-white text-lg mb-4">
                          ({displayDate?.substring(0, 4) || "N/A"})
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-white font-semibold text-2xl px-6 py-5 italic lg:px-10 lg:py-6">
                  No Items Available...
                </p>
              )}
            </div>

            {/* Button Show More */}
            {visibleCredits < credits.length && (
              <div className="flex justify-center mt-2 mb-6">
                <button
                  onClick={handleShowMore}
                  className="btn btn-outline btn-primary"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>No items available.</p>
      )}
      <Footer />
    </div>
  );
}
