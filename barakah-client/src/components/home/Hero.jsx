"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0f2a44] via-[#1e3a5f] to-[#0f2a44]" />

      {/* Gold radial glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,#f5d76e,transparent_60%)]" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-32">
        <div className="max-w-2xl">

          {/* Badge */}
          <span className="mb-6 inline-block rounded-full bg-[#d4af37]/20 px-4 py-1.5 text-sm font-medium uppercase tracking-wider text-[#f5d76e]">
            Blessings in every moment
          </span>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl font-serif">
            Barakah <br />
            <span className="bg-linear-to-r from-[#d4af37] via-[#f5d76e] to-[#b8962e] bg-clip-text text-transparent">
              Islamic Clock & Canvas
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/80">
            Discover curated collections of premium Islamic wall clocks and
            canvas art. Crafted with elegance for those who value faith and
            beauty.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            
            {/* Shop Now */}
            <Link
              href="/category/wall-clock/natural"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-7 py-3.5 font-semibold text-[#1a1a1a] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Shop Now <FaArrowRight />
            </Link>

            {/* Explore */}
            <Link
              href="/category/wall-canvas/natural"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              Explore Categories
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}