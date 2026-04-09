"use client";

import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/orders`, {
        cache: "no-store",
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
    const confirmUpdate = window.confirm(
      "Are you sure you want to mark this order as delivered?",
    );

    if (!confirmUpdate) return;

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
      } else {
        alert(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while updating the order");
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
      <div className="bg-white rounded-2xl border border-[#e5dccf] p-6">
        <p className="text-[#3d2f1f]">Loading orders...</p>
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
                          {order.area && (
                            <p className="text-xs text-[#7a6a58]">
                              Area: {order.area}
                            </p>
                          )}
                        </div>
                      </td>

                      <td>{order.phone}</td>
                      <td className="max-w-[220px] whitespace-normal">
                        {order.address}
                      </td>
                      <td>৳ {order.total}</td>
                      <td>{order.items?.length || 0}</td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
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

                  <p>
                    <span className="font-semibold">Items:</span>{" "}
                    {order.items?.length || 0}
                  </p>

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

                <div className="mt-4">
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
    </div>
  );
}
