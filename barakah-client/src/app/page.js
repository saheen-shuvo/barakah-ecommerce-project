import Hero from "@/components/home/Hero";
import ProductSection from "@/components/home/ProductSection";

async function getProducts() {
  try {
    const res = await fetch("http://localhost:8000/api/products", {
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

export default async function HomePage() {
  const products = await getProducts();
  const wallClockProducts = products.filter(
    (product) => product.category === "wall-clock",
  );

  const wallCanvasProducts = products.filter(
    (product) => product.category === "wall-canvas",
  );

  //   const islamicWallClockProducts = products.filter(
  //   (product) =>
  //     product.category === "wall-clock" &&
  //     product.subcategory === "islamic"
  // );

  return (
    <main className="min-h-screen bg-[#faf7f0] text-[#3d2f1f]">
      <Hero></Hero>
      <ProductSection
        title="Premium Wall Clocks"
        link="/category/wall-clock/natural"
        products={wallClockProducts.slice(0, 8)}
        bgClass="bg-[#faf7f0]"
      />

      <ProductSection
        title="Elegant Wall Canvas"
        link="/category/wall-canvas/natural"
        products={wallCanvasProducts.slice(0, 8)}
        bgClass="bg-[#faf7f0]"
      />
    </main>
  );
}
