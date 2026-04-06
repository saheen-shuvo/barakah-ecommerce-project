"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

// dummy cart (replace later)
const useCart = () => {
  return { totalItems: 2 };
};

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const navLinkClass = (active) =>
    `text-sm font-medium transition-colors ${
      active ? "text-[#d4af37]" : "text-[#0c2a45af] hover:text-[#d4af37]"
    }`;

  const mobileLinkClass = (active) =>
    `py-2 text-sm font-medium transition-colors ${
      active ? "text-[#d4af37]" : "text-[#0c2a45af] hover:text-[#d4af37]"
    }`;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Barakah Logo" width={25} height={25} />
            <h1 className="bg-linear-to-r from-[#937923] via-[#ac9542] to-[#9c7e23] bg-clip-text text-xl font-bold text-transparent lg:text-2xl">
              Barakah
            </h1>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className={navLinkClass(isActive("/", true))}>
              Home
            </Link>

            <Link
              href="/category/wall-clock/natural"
              className={navLinkClass(isActive("/category/wall-clock"))}
            >
              Wall Clock
            </Link>

            <Link
              href="/category/wall-canvas/natural"
              className={navLinkClass(isActive("/category/wall-canvas"))}
            >
              Wall Canvas
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-[#0c2a45af] transition-colors hover:text-[#d4af37]"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="p-2 text-[#0c2a45af] transition-colors hover:text-[#d4af37]"
            >
              <FaRegUser size={18} />
            </Link>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 text-[#0c2a45af] md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <IoClose size={24} /> : <IoMdMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={mobileLinkClass(isActive("/", true))}
            >
              Home
            </Link>

            <Link
              href="/category/wall-clock/natural"
              onClick={closeMobileMenu}
              className={mobileLinkClass(isActive("/category/wall-clock"))}
            >
              Wall Clock
            </Link>

            <Link
              href="/category/wall-canvas/natural"
              onClick={closeMobileMenu}
              className={mobileLinkClass(isActive("/category/wall-canvas"))}
            >
              Wall Canvas
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}