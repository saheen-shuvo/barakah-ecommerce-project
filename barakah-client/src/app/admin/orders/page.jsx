"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import LoadingAnimation from "@/components/shared/LoadingAnimation";

export default function OrdersPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/orders`, {
        next: { revalidate: 60 },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Mark this order as delivered?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, mark it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoadingId(id);

      const res = await fetch(`${baseUrl}/api/orders/${id}/deliver`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id
              ? {
                  ...order,
                  status: "delivered",
                  deliveredAt: new Date().toISOString(),
                }
              : order,
          ),
        );

        Swal.fire({
          icon: "success",
          title: "Delivered!",
          text: "Order marked as delivered.",
          timer: 1500,
          showConfirmButton: false,
        });
        if (selectedOrder?._id === id) {
          setSelectedOrder((prev) =>
            prev
              ? {
                  ...prev,
                  status: "delivered",
                  deliveredAt: new Date().toISOString(),
                }
              : null,
          );
        }
      } else {
        Swal.fire("Error", "Failed to update order!", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5dccf] p-6 flex justify-center py-12">
        <LoadingAnimation width={300} height={300} message="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#e5dccf] p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#3d2f1f]">All Orders</h1>
            <p className="text-sm text-[#7a6a58] mt-1">
              Manage customer orders and mark them as delivered.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`btn btn-sm ${
                statusFilter === "all"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setStatusFilter("pending")}
              className={`btn btn-sm ${
                statusFilter === "pending"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setStatusFilter("delivered")}
              className={`btn btn-sm ${
                statusFilter === "delivered"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5dccf] p-6">
          <p className="text-[#7a6a58]">No orders found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-[#e5dccf] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-[#faf7f0] text-[#3d2f1f]">
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th>Order Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>

                      <td>
                        <div>
                          <p className="font-semibold text-[#3d2f1f]">
                            {order.customerName}
                          </p>
                          {order.notes && (
                            <p className="text-xs text-[#7a6a58]">
                              Notes: {order.notes}
                            </p>
                          )}
                        </div>
                      </td>

                      <td>{order.phone}</td>
                      <td className="max-w-55 whitespace-normal">
                        {order.address}
                      </td>
                      <td>৳ {order.total}</td>
                      <td>
                        <div className="space-y-1 text-sm">
                          {order.items?.map((item, i) => (
                            <p key={i}>
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-sm bg-white text-[#3d2f1f] border border-[#d4af37] hover:bg-[#faf7f0]"
                          >
                            View Order
                          </button>

                          {order.status === "delivered" ? (
                            <button className="btn btn-sm" disabled>
                              Delivered
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              className="btn btn-sm bg-[#d4af37] text-white border-none hover:bg-[#c39d2f]"
                              disabled={loadingId === order._id}
                            >
                              {loadingId === order._id
                                ? "Updating..."
                                : "Mark Delivered"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredOrders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-[#e5dccf] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#3d2f1f]">
                      {index + 1}. {order.customerName}
                    </p>
                    <p className="text-sm text-[#7a6a58]">{order.phone}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-[#3d2f1f]">
                  {order.area && (
                    <p>
                      <span className="font-semibold">Area:</span> {order.area}
                    </p>
                  )}

                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {order.address}
                  </p>

                  <p>
                    <span className="font-semibold">Total:</span> ৳{" "}
                    {order.total}
                  </p>

                  <div>
                    <span className="font-semibold">Items:</span>
                    <div className="mt-1 space-y-1 text-sm">
                      {order.items?.map((item, i) => (
                        <p key={i}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>

                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "—"}
                  </p>

                  {order.notes && (
                    <p>
                      <span className="font-semibold">Notes:</span>{" "}
                      {order.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn btn-sm w-full bg-white text-[#3d2f1f] border border-[#d4af37] hover:bg-[#faf7f0]"
                  >
                    View Order
                  </button>

                  {order.status === "delivered" ? (
                    <button className="btn btn-sm w-full text-xs" disabled>
                      Delivered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkDelivered(order._id)}
                      className="btn btn-sm w-full bg-[#d4af37] text-white border-none hover:bg-[#c39d2f]"
                      disabled={loadingId === order._id}
                    >
                      {loadingId === order._id
                        ? "Updating..."
                        : "Mark Delivered"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5dccf] p-5">
              <div>
                <h2 className="text-xl font-bold text-[#3d2f1f]">
                  Order Details
                </h2>
                <p className="text-sm text-[#7a6a58]">
                  Customer: {selectedOrder.customerName}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-sm bg-white border border-[#e5dccf] text-[#3d2f1f]"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Customer Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#e5dccf] p-4">
                  <h3 className="mb-3 font-semibold text-[#3d2f1f]">
                    Customer Info
                  </h3>

                  <div className="space-y-2 text-sm text-[#3d2f1f]">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {selectedOrder.customerName}
                    </p>

                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {selectedOrder.phone}
                    </p>

                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {selectedOrder.address}
                    </p>

                    {selectedOrder.notes && (
                      <p>
                        <span className="font-semibold">Notes:</span>{" "}
                        {selectedOrder.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-[#e5dccf] p-4">
                  <h3 className="mb-3 font-semibold text-[#3d2f1f]">
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-sm text-[#3d2f1f]">
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {selectedOrder.status === "delivered"
                        ? "Delivered"
                        : "Pending"}
                    </p>

                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleDateString()
                        : "—"}
                    </p>

                    <p>
                      <span className="font-semibold">Delivery Method:</span>{" "}
                      {selectedOrder.shippingType === "inside"
                        ? "Inside Dhaka"
                        : selectedOrder.shippingType === "outside"
                          ? "Outside Dhaka"
                          : "—"}
                    </p>

                    <p>
                      <span className="font-semibold">Payment Method:</span>{" "}
                      {selectedOrder.paymentMethod === "bkash"
                        ? "Bkash"
                        : selectedOrder.paymentMethod === "nagad"
                          ? "Nagad"
                          : selectedOrder.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "—"}
                    </p>

                    {(selectedOrder.paymentMethod === "bkash" ||
                      selectedOrder.paymentMethod === "nagad") && (
                      <p>
                        <span className="font-semibold">Last 4 Digits:</span>{" "}
                        {selectedOrder.accountLast4 || "—"}
                      </p>
                    )}

                    <p>
                      <span className="font-semibold">Subtotal:</span> ৳{" "}
                      {selectedOrder.subtotal || 0}
                    </p>

                    <p>
                      <span className="font-semibold">Shipping:</span> ৳{" "}
                      {selectedOrder.shippingCost || 0}
                    </p>

                    <p className="text-base font-bold text-[#3d2f1f]">
                      Total: ৳ {selectedOrder.total || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="rounded-xl border border-[#e5dccf] p-4">
                <h3 className="mb-4 font-semibold text-[#3d2f1f]">
                  Ordered Items
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 rounded-xl border border-[#f1eadf] p-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="h-24 w-24 rounded-lg border border-[#e5dccf] object-cover"
                            width={64}
                            height={64}
                          />
                        )}

                        <div>
                          <p className="font-medium text-[#3d2f1f]">
                            {item.name}
                          </p>
                          <p className="text-sm text-[#7a6a58]">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-sm text-[#3d2f1f]">
                        <p>৳ {item.price}</p>
                        <p className="font-semibold">
                          ৳ {(item.price || 0) * (item.quantity || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Action */}
              <div className="flex justify-end">
                {selectedOrder.status === "delivered" ? (
                  <button className="btn btn-sm" disabled>
                    Delivered
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkDelivered(selectedOrder._id)}
                    className="btn btn-sm bg-[#d4af37] text-white border-none hover:bg-[#c39d2f]"
                    disabled={loadingId === selectedOrder._id}
                  >
                    {loadingId === selectedOrder._id
                      ? "Updating..."
                      : "Mark Delivered"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
