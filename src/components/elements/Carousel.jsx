import { useState } from "react";
import axiosClient from "../../api/axiosClient";

export function Carousel({ items }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handlePrev = () => {
    // Kalau dia di slide pertama, dia akan kembali ke slide terakhir
    setActiveSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    // Kalau dia di slide terakhir, dia akan kembali ke slide pertama
    setActiveSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (!items || items.length === 0) {
    return <p className="text-white text-center">No items available.</p>;
  }

  return (
    <div className="carousel w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className={`carousel-item relative w-full ${
            index === activeSlide ? "block" : "hidden"
          }`}
        >
          <img
            src={
              item.file_path
                ? axiosClient.getImageUrl.originalImage(item.file_path)
                : ""
            }
            alt={`Slide ${index + 1}`}
            className="w-full mt-3"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button onClick={handlePrev} className="btn btn-circle">
              ❮
            </button>
            <button onClick={handleNext} className="btn btn-circle">
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
