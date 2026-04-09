"use client";

import Link from "next/link";

export default function SubCategoryTabs({ main, currentSub }) {
  return (
    <div className="mb-8 flex gap-4">
      {/* Natural */}
      <Link
        href={`/category/${main}/natural`}
        className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
          currentSub === "natural"
            ? "bg-[#d4af37] text-white shadow-md scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
        }`}
      >
        Natural
      </Link>

      {/* Islamic */}
      <Link
        href={`/category/${main}/islamic`}
        className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
          currentSub === "islamic"
            ? "bg-[#d4af37] text-white shadow-md scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
        }`}
      >
        Islamic
      </Link>

      {/* Combo */}
      <Link
        href={`/category/${main}/combo`}
        className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
          currentSub === "combo"
            ? "bg-[#d4af37] text-white shadow-md scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
        }`}
      >
        Combo
      </Link>
    </div>
  );
}
