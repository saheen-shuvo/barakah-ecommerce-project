import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

export default async function ProductDetails({ params }) {
  const { id } = await params;
  const productId = Number(id);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-500">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  // related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="bg-[#faf7f0] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-[#0f2a44]/60 mb-6">
          <Link href="/">Home</Link> /{" "}
          <span className="capitalize">{product.category}</span> /{" "}
          <span>{product.name}</span>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div>
            {product.badge && (
              <span className="inline-block mb-3 px-3 py-1 text-xs bg-[#d4af37] text-white rounded">
                {product.badge}
              </span>
            )}

            <h1 className="text-3xl font-bold text-[#0f2a44] mt-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-[#0f2a44]">
                ৳ {product.price}
              </span>

              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  ৳ {product.oldPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-[#0f2a44]/80 leading-relaxed">
              {product.description}
            </p>

            {/* Stock */}
            <p
              className={`mt-4 font-medium ${
                product.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-3 bg-[#0f2a44] text-white rounded-lg hover:bg-[#d4af37] transition">
                Add to Cart
              </button>

              <button className="px-6 py-3 border border-[#0f2a44] rounded-lg hover:bg-white transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-[#0f2a44]">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:lg-grid-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
