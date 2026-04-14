"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function EditProductPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    oldPrice: "",
    image: "",
    badge: "",
    inStock: true,
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${baseUrl}/api/products/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          const product = data.data;

          setFormData({
            name: product.name || "",
            description: product.description || "",
            category: product.category || "",
            subcategory: product.subcategory || "",
            price: product.price || "",
            oldPrice: product.oldPrice || "",
            image: product.image || "",
            badge: product.badge || "",
            inStock: product.inStock ?? true,
          });
        } else {
          toast.error(data.message || "Product not found", {
            position: "top-right",
          });
          router.push("/admin/products");
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong", {
          position: "top-right",
        });
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [baseUrl, id, router]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          oldPrice: Number(formData.oldPrice),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully!", {
        position: "top-right",
      });
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e5dccf] bg-white p-6">
        <p className="text-[#3d2f1f]">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl rounded-2xl border border-[#e5dccf] bg-white p-6 shadow-sm mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-[#3d2f1f]">Edit Product</h1>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="পণ্যের বিবরণ লিখুন..."
            className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
              required
            >
              <option value="">Select category</option>
              <option value="wall-clock">Wall Clock</option>
              <option value="wall-canvas">Wall Canvas</option>
              <option value="wall-art">Wall Art</option>
              <option value="round-clock">Round Clock</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
            >
              <option value="">Select subcategory</option>
              <option value="natural">Natural</option>
              <option value="islamic">Islamic</option>
              <option value="others">Others</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Old Price
            </label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
            required
          />
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Badge
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="New / Sale"
              className="w-full rounded-xl border border-[#e5dccf] px-4 py-3 outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-[#3d2f1f]">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          In Stock
        </label>

        {formData.image && (
          <div>
            <p className="mb-2 text-sm font-medium text-[#3d2f1f]">Preview</p>
            <Image
              src={formData.image}
              alt={formData.name}
              width={128}
              height={128}
              className="h-32 w-32 rounded-xl object-cover border border-[#e5dccf]"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={updating}
            className="rounded-xl bg-[#d4af37] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-xl border border-[#e5dccf] px-6 py-3 font-medium text-[#3d2f1f]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
