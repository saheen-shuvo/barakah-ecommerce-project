import ProductTable from "@/components/admin/ProductTable";

async function getProducts() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }

    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    return [];
  }
}

export default async function AllProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <ProductTable initialProducts={products} />
    </div>
  );
}