"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent link navigation
    e.stopPropagation(); // stop bubbling

    console.log("Added:", product);
    // later:
    // addToCart(product)
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-white border border-[#0f2a44]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#faf7f0]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${
              product.badge === "Sale"
                ? "bg-red-500 text-white"
                : product.badge === "New"
                  ? "bg-[#d4af37] text-white"
                  : "bg-[#0f2a44] text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-xs capitalize text-[#0f2a44]/60">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="mb-1.5 line-clamp-1 text-sm font-semibold text-[#0f2a44]">
          {product.name}
        </h3>

        {/* Rating */}
        {/* <div className="mb-2 flex items-center gap-1">
          <span className="text-xs text-[#0f2a44]/60">
            {product.rating}
          </span>
        </div> */}

        {/* Price  */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#0f2a44]">
              ৳ {product.price}
            </span>

            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                ৳ {product.oldPrice}
              </span>
            )}
          </div>

        {/* add to cart + buy now */}
        <div className="flex justify-between py-2 gap-3">
          <button
            onClick={handleAddToCart}
            className="py-2 w-[50%] rounded-md bg-[#0f2a44] text-white text-xs font-medium hover:bg-[#d4af37] transition-all duration-200"
          >
            Add to Cart
          </button>
          <button className="w-[50%] rounded-md  text-[#0f2a44] border border-[#0f2a44] text-xs font-medium hover:bg-[#d4af37] transition-all duration-200">
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
}
