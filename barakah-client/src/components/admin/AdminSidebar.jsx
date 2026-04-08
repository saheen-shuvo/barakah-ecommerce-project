import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-[#3d2f1f]">
        Barakah Admin
      </h2>

      <nav className="space-y-3">
        <Link
          href="/admin"
          className="block rounded-lg px-4 py-2 hover:bg-[#faf7f0] hover:text-[#d4af37] transition"
        >
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className="block rounded-lg px-4 py-2 hover:bg-[#faf7f0] hover:text-[#d4af37] transition"
        >
          All Products
        </Link>

        <Link
          href="/admin/products/add"
          className="block rounded-lg px-4 py-2 hover:bg-[#faf7f0] hover:text-[#d4af37] transition"
        >
          Add Product
        </Link>

        <Link
          href="/admin/orders"
          className="block rounded-lg px-4 py-2 hover:bg-[#faf7f0] hover:text-[#d4af37] transition"
        >
          Orders
        </Link>
      </nav>
    </div>
  );
}