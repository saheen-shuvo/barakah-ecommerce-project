"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

export default function ProductTable({
  initialProducts,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 20,
  onPageChange,
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });

        router.refresh();
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <div>
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
            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                        />
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

      <div className="grid gap-4 md:hidden">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
          >
            <div className="flex gap-4">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">
                <p className="font-bold">
                  {(currentPage - 1) * itemsPerPage + index + 1}. {product.name}
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

      <div className="mt-8 flex justify-center">
        <div className="join">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
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
