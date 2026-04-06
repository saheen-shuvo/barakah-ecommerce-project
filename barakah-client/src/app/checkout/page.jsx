"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [shipping, setShipping] = useState("inside");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    area: "",
    notes: "",
  });

  const shippingCost = shipping === "inside" ? 60 : 120;
  const finalTotal = useMemo(
    () => totalPrice + shippingCost,
    [totalPrice, shippingCost],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.district.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      district: formData.district,
      area: formData.area,
      notes: formData.notes,
      shippingType: shipping,
      shippingCost,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: totalPrice,
      total: finalTotal,
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/orders", {
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

      setFormData({
        name: "",
        phone: "",
        address: "",
        district: "",
        area: "",
        notes: "",
      });

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
        <div className="">
          <SectionTitle title="Checkout" />

          <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            {/* Left */}
            <form
              onSubmit={handlePlaceOrder}
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Phone Number *
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Full Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="House no, road, area, thana..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Enter district"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#0f2a44]/15 px-4 py-3 outline-none focus:border-[#d4af37]"
                    placeholder="Enter area"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#0f2a44]">
                    Order Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
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

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-[#0f2a44] px-6 py-4 text-lg font-semibold text-[#f2c94c] transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

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
