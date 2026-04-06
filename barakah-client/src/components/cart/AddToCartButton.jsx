"use client";

import { useCart } from "@/contexts/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="rounded-lg bg-[#0f2a44] px-6 py-3 text-white transition hover:bg-[#d4af37]"
    >
      Add to Cart
    </button>
  );
}