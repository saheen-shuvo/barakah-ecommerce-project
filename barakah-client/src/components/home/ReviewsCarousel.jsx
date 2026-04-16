"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import styles
import "swiper/css";
import "swiper/css/pagination";

export default function ReviewsCarousel({ reviews }) {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={24}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="px-2 md:px-12"
    >
      {reviews.map((review) => (
        <SwiperSlide key={review._id}>
          <div className="mx-auto max-w-[320px] rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
            
            <div className="mb-4 flex justify-center">
              <Image
                src={review.image}
                alt={review.name}
                width={300}
                height={200}
                className="h-45 w-full rounded-xl border-2 border-[#d4af37] object-cover"
              />
            </div>

            <div className="mb-3 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-lg ${
                    i < review.rating
                      ? "text-[#d4af37]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              {review.description}
            </p>

            <h4 className="text-center font-semibold text-[#3d2f1f]">
              {review.name}
            </h4>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}