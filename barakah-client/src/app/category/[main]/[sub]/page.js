import Link from "next/link";
import ProductSearch from "@/components/products/ProductSearch";
import OfferCountdown from "@/components/products/OfferCountdown";

async function getProducts(main, sub) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(
      `${baseUrl}/api/products?category=${main}&subcategory=${sub}`,
      {
        next: { revalidate: 60 },
      },
    );

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
  const { main, sub } = await params;
  const filteredProducts = await getProducts(main, sub);

  return (
    <main className="bg-[#faf7f0] min-h-screen pb-10">
      <OfferCountdown></OfferCountdown>
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {main?.replace("-", " ")}
        </h1>

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
            href={`/category/${main}/special1`}
            className={`px-4 py-2 rounded-lg ${
              sub === "special1" ? "bg-[#0f2a44] text-white" : "bg-white"
            }`}
          >
            Special 1
          </Link>

          <Link
            href={`/category/${main}/special2`}
            className={`px-4 py-2 rounded-lg ${
              sub === "special2" ? "bg-[#0f2a44] text-white" : "bg-white"
            }`}
          >
            Special 2
          </Link>

          <Link
            href={`/category/${main}/others`}
            className={`px-4 py-2 rounded-lg ${
              sub === "others" ? "bg-[#0f2a44] text-white" : "bg-white"
            }`}
          >
            Others
          </Link>
        </div>

        <ProductSearch products={filteredProducts} />
      </div>
    </main>
  );
}
