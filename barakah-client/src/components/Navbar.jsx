import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
      <h1 className="text-xl font-bold text-[#3d2f1f]">
        Barakah
      </h1>

      <div className="space-x-6 text-sm">
        <Link href="/">Home</Link>
        <Link href="/category/watch">Watch</Link>
        <Link href="/category/earphone">Earphone</Link>
        <Link href="/category/phone">Phone</Link>
      </div>
    </nav>
  );
}