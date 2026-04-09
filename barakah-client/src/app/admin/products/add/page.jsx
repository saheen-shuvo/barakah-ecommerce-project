"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function AddProductPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      oldPrice: "",
      category: "",
      subcategory: "",
      stock: "",
      description: "",
      badge: "",
      inStock: true,
      image: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const imageFile = data.image[0];

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      const productData = {
        ...data,
        price: Number(data.price),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        stock: Number(data.stock),
        image: imageUrl,
      };

      const res = await fetch(`${baseUrl}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to save product");
      }

      alert("Product added successfully!");
      reset();
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-xl mx-auto bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-[#3d2f1f]">Add Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
            Product Name
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            {...register("name", {
              required: "Product name is required",
            })}
            className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter price"
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 1,
                  message: "Price must be greater than 0",
                },
              })}
              className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Old Price
            </label>
            <input
              type="number"
              placeholder="Enter old price"
              {...register("oldPrice")}
              className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Category
            </label>
            <select
              {...register("category", {
                required: "Category is required",
              })}
              className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
            >
              <option value="">Select Category</option>
              <option value="wall-clock">Wall Clock</option>
              <option value="wall-canvas">Wall Canvas</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Subcategory
            </label>
            <select
              {...register("subcategory", {
                required: "Subcategory is required",
              })}
              className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
            >
              <option value="">Select Subcategory</option>
              <option value="natural">Natural</option>
              <option value="islamic">Islamic</option>
              <option value="combo">Combo</option>
            </select>
            {errors.subcategory && (
              <p className="mt-1 text-sm text-red-500">
                {errors.subcategory.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Stock
            </label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              {...register("stock", {
                required: "Stock is required",
                min: {
                  value: 0,
                  message: "Stock cannot be negative",
                },
              })}
              className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-500">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
              Badge
            </label>
            <input
              type="text"
              placeholder="Example: New / Sale"
              {...register("badge")}
              className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
            Description
          </label>
          <textarea
            rows={5}
            placeholder="Enter product description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description should be at least 10 characters",
              },
            })}
            className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none focus:border-[#d4af37]"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* // IMAGE UPLOAD */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#3d2f1f]">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            {...register("image", {
              required: "Product image is required",
            })}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="w-full rounded-lg border border-[#e5dccf] p-3 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-[#d4af37] file:px-4 file:py-2 file:text-white"
          />

          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
          )}

          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="mt-4 h-40 w-40 object-cover rounded-lg border"
              width={160}
              height={160}
            />
          )}
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-[#e5dccf] p-4">
          <input
            id="inStock"
            type="checkbox"
            {...register("inStock")}
            className="h-4 w-4 accent-[#d4af37]"
          />
          <label
            htmlFor="inStock"
            className="text-sm font-medium text-[#3d2f1f]"
          >
            In Stock
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-lg bg-[#d4af37] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
