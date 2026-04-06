import { products } from "@/data/products";
import SubCategoryTabs from "@/components/products/SubCategoryTabs";

export default function CategoryPage({ params }) {
  const { main, sub } = params;

  const filtered = products.filter(
    (p) =>
      p.mainCategory === main &&
      p.subCategory === sub
  );

  return (
    <div className="min-h-screen bg-[#faf7f0] px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold capitalize">
        {main.replace("-", " ")} / {sub}
      </h1>

      {/* Tabs */}
      <SubCategoryTabs main={main} currentSub={sub} />

      {/* Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <div key={product.id} className="border p-4 bg-white">
            {product.name}
          </div>
        ))}
      </div>
    </div>
  );
}