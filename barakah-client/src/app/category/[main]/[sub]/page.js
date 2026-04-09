import Link from "next/link";
import ProductSearch from "@/components/products/ProductSearch";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const products = await getProducts();
  const { main, sub } = await params;

  const filteredProducts = products.filter(
    (p) => p.category === main && p.subcategory === sub,
  );

  return (
    <main className="bg-[#faf7f0] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {main?.replace("-", " ")}
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Link
            href={`/category/${main}/natural`}
            className={`px-4 py-2 rounded-lg ${
              sub === "natural" ? "bg-[#0f2a44] text-white" : "bg-white"
            }`}
          >
            Natural
          </Link>

          <Link
            href={`/category/${main}/islamic`}
            className={`px-4 py-2 rounded-lg ${
              sub === "islamic" ? "bg-[#0f2a44] text-white" : "bg-white"
            }`}
          >
            Islamic
          </Link>

          <Link
            href={`/category/${main}/combo`}
            className={`px-4 py-2 rounded-lg ${
              sub === "combo" ? "bg-[#0f2a44] text-white" : "bg-white"
            }`}
          >
            Combo
          </Link>

        </div>

        <ProductSearch products={filteredProducts} />
      </div>
    </main>
  );
}
