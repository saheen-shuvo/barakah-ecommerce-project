"use client";

import { useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "../../app/products/[id]/BuyNowButton";

export default function ProductDetailsActions({ product }) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="mt-6">
      {/* Quantity */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-[#0f2a44]">Quantity</p>

        <div className="flex items-center w-fit rounded-full border border-[#0f2a44]/15 bg-white px-2 py-1">
          <button
            onClick={decreaseQuantity}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#0f2a44] transition hover:bg-[#f8f6f1]"
          >
            -
          </button>

          <span className="min-w-10 text-center text-lg font-medium text-[#0f2a44]">
            {quantity}
          </span>

          <button
            onClick={increaseQuantity}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#0f2a44] transition hover:bg-[#f8f6f1]"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <AddToCartButton product={product} quantity={quantity} />
        <BuyNowButton product={product} quantity={quantity} />
      </div>
    </div>
  );
}