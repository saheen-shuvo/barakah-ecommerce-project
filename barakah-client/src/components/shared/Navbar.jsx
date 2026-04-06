"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import Image from "next/image";

// dummy cart (replace later)
const useCart = () => {
  return { totalItems: 2 };
};

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // helper for active link
  const isActive = (path) => pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Barakah Logo" width={25} height={25} />
            <h1 className="text-xl font-bold lg:text-2xl bg-linear-to-r from-[#937923] via-[#ac9542] to-[#9c7e23] bg-clip-text text-transparent">
              Barakah
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/category/wall-clock/natural"
              className={`text-sm font-medium transition-colors ${
                isActive("/category/wall-clock")
                  ? "text-[#d4af37]"
                  : "text-[#0c2a45af] hover:text-[#d4af37]"
              }`}
            >
              Wall Clock
            </Link>

            <Link
              href="/category/wall-canvas/natural"
              className={`text-sm font-medium transition-colors ${
                isActive("/category/wall-canvas")
                  ? "text-[#d4af37]"
                  : "text-[#0d304faf] hover:text-[#d4af37]"
              }`}
            >
              Wall Canvas
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-[#0c2a45af] hover:text-[#d4af37] transition-colors"
            >
              <FiShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              href="/login"
              className="p-2 text-[#0c2a45af] hover:text-[#d4af37] transition-colors"
            >
              <FaRegUser />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#0c2a45af] md:hidden"
            >
              {mobileOpen ? <h1>X</h1> : <IoMdMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4">
            <Link
              href="/category/wall-clock/natural"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[#0c2a45af] hover:text-[#d4af37] py-2"
            >
              Wall Clock
            </Link>

            <Link
              href="/category/wall-canvas/natural"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-[#0c2a45af] hover:text-[#d4af37] py-2"
            >
              Wall Canvas
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
