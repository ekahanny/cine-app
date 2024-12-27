import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { Footer } from "../components/layouts/Footer";
import { NavBar } from "../components/layouts/NavBar";
import tmdbApi from "../api/tmdbApi";
import axiosClient from "../api/axiosClient";
import { Divider } from "../components/elements/Divider";

export function Person() {
  const { id } = useParams(); // Ambil id dari parameter URL
  const [personDetail, setPersonDetail] = useState(null);

  useEffect(() => {
    const fetchPerson = async () => {
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
        console.log("Image Person: ", ImagesRes);

        // Fetch Combined Credits of Person
        const creditRes = await tmdbApi.getPersonCredits(id, {
          language: "en-US",
        });
        console.log("Credit Response: ", creditRes);
      } catch (error) {
        console.error("Can't fetch details of this person");
      }
    };

    fetchPerson();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {personDetail ? (
        <div className="relative flex-1 h-screen lg:h-80">
          {/* Image, Name, & Description */}
          <div className="flex flex-col justify-center items-center">
            {/* Image */}
            <img
              className="object-cover w-44"
              src={
                personDetail.profile_path
                  ? axiosClient.getImageUrl.w500Image(personDetail.profile_path)
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={personDetail.name}
            />
            {/* Description & Name */}
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-white text-2xl font-semibold my-3">
                {personDetail.name} (
                {personDetail.deathday !== null
                  ? `${personDetail.birthday.slice(
                      0,
                      4
                    )} - ${personDetail.deathday.slice(0, 4)}`
                  : personDetail.birthday.slice(0, 4)}
                )
              </h1>
              <p className="text-white text-center px-6 mb-3">
                {personDetail.biography.slice(0, 400)}...
              </p>
            </div>
          </div>

          <Divider name="Image Collections" />

          
        </div>
      ) : (
        <p>No items available.</p>
      )}
      <Footer />
    </div>
  );
}
