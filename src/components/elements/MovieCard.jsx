import React from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";

export const MovieCard = ({
  items,
  category,
  titleKey = "title",
  type = "general",
  release_date = "release_date",
}) => {
  return (
    <div
      className={`grid lg:grid-cols-5 mt-6 lg:mt-7 ml-5 lg:ml-8 lg:mb-4 ${
        type === "recommendations"
          ? "grid-rows-1 grid-cols-2 mb-1 gap-0"
          : "grid-rows-4 grid-cols-2 mb-3 gap-2"
      } `}
    >
      {items.length > 0 ? (
        items.map((item) => (
          <Link to={`/${category}/${item.id}`} key={item.id}>
            <div key={item.id} className="card relative">
              <p className="flex flex-row items-center absolute text-white m-2 lg:ml-4 lg:mt-6 border border-white bg-[#09093d] w-fit px-4 py-1 text-sm font-semibold rounded-full z-10 hover:scale-100">
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-2"
                >
                  <path
                    d="M10.3072 7.21992C10.9493 5.61924 11.2704 4.81889 11.7919 4.70797C11.9291 4.6788 12.0708 4.6788 12.208 4.70797C12.7295 4.81889 13.0506 5.61924 13.6927 7.21992C14.0578 8.1302 14.2404 8.58535 14.582 8.89491C14.6778 8.98174 14.7818 9.05907 14.8926 9.12582C15.2874 9.3638 15.7803 9.40794 16.7661 9.49623C18.4348 9.64568 19.2692 9.7204 19.524 10.1961C19.5768 10.2947 19.6127 10.4014 19.6302 10.5118C19.7146 11.0448 19.1012 11.6028 17.8744 12.719L17.5338 13.0289C16.9602 13.5507 16.6735 13.8116 16.5076 14.1372C16.4081 14.3325 16.3414 14.5429 16.3101 14.7598C16.258 15.1215 16.342 15.5 16.5099 16.257L16.5699 16.5275C16.8711 17.885 17.0217 18.5638 16.8337 18.8974C16.6649 19.1971 16.3538 19.389 16.0102 19.4054C15.6277 19.4236 15.0887 18.9844 14.0107 18.106C13.3005 17.5273 12.9454 17.238 12.5512 17.1249C12.191 17.0216 11.8089 17.0216 11.4487 17.1249C11.0545 17.238 10.6994 17.5273 9.98917 18.106C8.91119 18.9844 8.37221 19.4236 7.98968 19.4054C7.64609 19.389 7.33504 19.1971 7.16617 18.8974C6.97818 18.5638 7.12878 17.885 7.42997 16.5275L7.48998 16.257C7.65794 15.5 7.74191 15.1215 7.6898 14.7598C7.65854 14.5429 7.59182 14.3325 7.49232 14.1372C7.32645 13.8116 7.03968 13.5507 6.46613 13.0289L6.12546 12.719C4.89867 11.6028 4.28527 11.0448 4.36975 10.5118C4.38724 10.4014 4.42312 10.2947 4.47589 10.1961C4.73069 9.7204 5.56507 9.64568 7.23384 9.49623C8.21962 9.40794 8.71251 9.3638 9.10735 9.12582C9.2181 9.05907 9.32211 8.98174 9.41793 8.89491C9.75954 8.58535 9.94211 8.1302 10.3072 7.21992Z"
                    fill="#F6C768"
                    stroke="#F6C768"
                    stroke-width="2"
                  />
                </svg>
                {item.vote_average.toFixed(1)}
              </p>

              <img
                className="w-40 lg:w-64 lg:mt-3 rounded-lg border border-white transform transition-transform duration-300 hover:scale-105"
                src={
                  item.poster_path
                    ? axiosClient.getImageUrl.originalImage(item.poster_path)
                    : ""
                }
                alt={item[titleKey]}
              />
              <h1 className="text-white mt-2 lg:mt-3 font-semibold text-lg">
                <span className="block lg:hidden">
                  {item[titleKey].length > 14
                    ? `${item[titleKey].slice(0, 14)}...`
                    : item[titleKey]}
                </span>
                <span className="hidden lg:block">
                  {item[titleKey].length > 24
                    ? `${item[titleKey].slice(0, 24)}...`
                    : item[titleKey]}
                </span>
              </h1>
              <p className="text-white text-lg mb-4">
                ({item[release_date].substring(0, 4)})
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
};

export default MovieCard;
