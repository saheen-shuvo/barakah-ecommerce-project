import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
      <h1 className="text-xl font-bold text-[#3d2f1f]">
        Barakah
      </h1>

      <div className="flex gap-6 text-sm">
        <Link href="/category/wall-clock/natural">Wall Clock</Link>
        <Link href="/category/wall-canvas/natural">Wall Canvas</Link>
      </div>
    </nav>
  );
}