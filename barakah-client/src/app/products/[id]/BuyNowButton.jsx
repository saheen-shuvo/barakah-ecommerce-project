"use client";

import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function BuyNowButton({ product }) {
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    clearCart();
    addToCart({ ...product, quantity: 1 });

    setTimeout(() => {
      router.push("/checkout");
    }, 100);
  };

  return (
    <button
      onClick={handleBuyNow}
      className="px-6 py-3 border border-[#0f2a44] rounded-lg hover:bg-[#d4af37] hover:border-[#d4af37] transition"
    >
      এখনই কিনুন
    </button>
  );
}
