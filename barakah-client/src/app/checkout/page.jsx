"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function CheckoutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [shipping, setShipping] = useState("inside");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const shippingCost = shipping === "inside" ? 60 : 120;

  const finalTotal = useMemo(
    () => totalPrice + shippingCost,
    [totalPrice, shippingCost],
  );

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const roundedSubtotal = Number(totalPrice.toFixed(2));
    const roundedShippingCost = Number(shippingCost.toFixed(2));
    const roundedTotal = Number(finalTotal.toFixed(2));

    const orderData = {
      customerName: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
      shippingType: shipping,
      shippingCost: roundedShippingCost,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price.toFixed(2)),
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: roundedSubtotal,
      total: roundedTotal,
    };

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      alert("Order placed successfully!");
      clearCart();
      reset();

      router.push("/order-success");
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f6f1] py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-[#0f2a44]">
              Your cart is empty
            </h1>
            <p className="mt-3 text-[#0f2a44]/70">
              Add some products before going to checkout.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-[#0f2a44] px-6 py-3 text-white transition hover:bg-[#d4af37]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f1] py-12">
      <Container>
        <div>
          <SectionTitle title="Checkout" />

          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            {/* Left */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold text-[#0f2a44]">
                Shipping Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Full name is required",
                    })}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(?:\+8801|01)[3-9]\d{8}$/,
                        message: "Enter a valid Bangladeshi phone number",
                      },
                    })}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Full Address *
                  </label>
                  <textarea
                    rows={4}
                    {...register("address", {
                      required: "Address is required",
                      minLength: {
                        value: 10,
                        message: "Address should be at least 10 characters",
                      },
                    })}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="House no, road, area, thana..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Order Notes
                  </label>
                  <textarea
                    rows={3}
                    {...register("notes")}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Any special note for delivery"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-[#0f2a44]">
                  Shipping Method
                </h3>

                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#0f2a44]/10 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="inside"
                        checked={shipping === "inside"}
                        onChange={() => setShipping("inside")}
                      />
                      <span className="text-[#0f2a44]">Inside Dhaka</span>
                    </div>
                    <span className="font-medium text-[#0f2a44]">৳ 60</span>
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#0f2a44]/10 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="outside"
                        checked={shipping === "outside"}
                        onChange={() => setShipping("outside")}
                      />
                      <span className="text-[#0f2a44]">Outside Dhaka</span>
                    </div>
                    <span className="font-medium text-[#0f2a44]">৳ 120</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-[#0f2a44] px-6 py-4 text-lg font-semibold text-[#f2c94c] transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            {/* Right */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-[#0f2a44]">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-[#0f2a44]/10 pb-4"
                  >
                    <div>
                      <h3 className="font-medium text-[#0f2a44]">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#0f2a44]/60">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium text-[#0f2a44]">
                      ৳ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-[#0f2a44]">
                <div className="flex items-center justify-between">
                  <span className="text-[#0f2a44]/70">Subtotal</span>
                  <span>৳ {totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#0f2a44]/70">Shipping</span>
                  <span>৳ {shippingCost.toFixed(2)}</span>
                </div>

                <div className="border-t border-[#0f2a44]/10 pt-4">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>৳ {finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/cart"
                className="mt-4 block text-center text-[#0f2a44] transition hover:text-[#d4af37]"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
