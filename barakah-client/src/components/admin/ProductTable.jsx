"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductTable({ initialProducts }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const ITEMS_PER_PAGE = 20;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return products.slice(start, end);
  }, [products, currentPage]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      setDeletingId(id);

      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        const updatedProducts = products.filter((p) => p._id !== id);
        setProducts(updatedProducts);

        const newTotalPages = Math.ceil(
          updatedProducts.length / ITEMS_PER_PAGE,
        );

        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        if (updatedProducts.length === 0) {
          setCurrentPage(1);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error deleting product");
    } finally {
      setDeletingId(null);
      router.refresh();
    }
  };

  if (products.length === 0) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product, index) => (
              <tr key={product._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={product.image} alt={product.name} />
                      </div>
                    </div>

                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm opacity-50">
                        {product.subcategory || "—"}
                      </div>
                    </div>
                  </div>
                </td>

                <td>{product.category}</td>
                <td>৳ {product.price}</td>

                <td>
                  {product.inStock ? (
                    <span className="badge badge-success badge-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm">
                      Out of Stock
                    </span>
                  )}
                </td>

                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-ghost btn-xs text-red-500"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {paginatedProducts.map((product, index) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
          >
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">
                <p className="font-bold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}.{" "}
                  {product.name}
                </p>

                <p className="text-sm text-gray-500">
                  {product.category} • {product.subcategory || "—"}
                </p>

                <p className="font-semibold mt-1">৳ {product.price}</p>

                <div className="mt-2">
                  {product.inStock ? (
                    <span className="badge badge-success badge-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="badge badge-error badge-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Link
                href={`/admin/products/edit/${product._id}`}
                className="btn btn-sm flex-1"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(product._id)}
                className="btn btn-sm btn-error flex-1"
              >
                {deletingId === product._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="join">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`join-item btn btn-sm ${
                currentPage === page
                  ? "bg-black text-white border-black"
                  : "btn-ghost"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
