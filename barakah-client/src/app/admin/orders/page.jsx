/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LoadingAnimation from "@/components/shared/LoadingAnimation";
import { LuPhone } from "react-icons/lu";

export default function OrdersPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [steadfastLoadingId, setStedastLoadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page")) || 1;
    const status = params.get("status") || "all";

    setCurrentPage(page);
    setStatusFilter(status);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(itemsPerPage),
        });

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        const res = await fetch(`${baseUrl}/api/orders?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          setOrders([]);
          setTotalPages(1);
          return;
        }

        const data = await res.json();

        if (data.success) {
          setOrders(data.data || []);
          setCurrentPage(data?.pagination?.page || currentPage);
          setTotalPages(data?.pagination?.totalPages || 1);
          setItemsPerPage(data?.pagination?.limit || 50);
        } else {
          setOrders([]);
          setTotalPages(1);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setOrders([]);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page")) || 1;
    const status = params.get("status") || "all";

    if (page !== currentPage) {
      setCurrentPage(page);
      return;
    }

    if (status !== statusFilter) {
      setStatusFilter(status);
      return;
    }

    fetchOrders();

    return () => controller.abort();
  }, [baseUrl, currentPage, itemsPerPage, isReady, statusFilter]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(window.location.search);
    params.set("page", page);

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    window.history.pushState({}, "", `?${params.toString()}`);
    setCurrentPage(page);
  };

  const handleFilterChange = (nextStatus) => {
    const params = new URLSearchParams();
    params.set("page", "1");

    if (nextStatus !== "all") {
      params.set("status", nextStatus);
    }

    window.history.pushState({}, "", `?${params.toString()}`);
    setStatusFilter(nextStatus);
    setCurrentPage(1);
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
          prevOrders.filter((order) => order._id !== id),
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

        if (statusFilter === "pending") {
          setTotalPages((prev) => Math.max(prev, 1));
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

  const handleCancelOrder = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "This order will be marked as cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${baseUrl}/api/orders/${id}/cancel`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status: "cancelled" } : order,
          ),
        );

        if (selectedOrder?._id === id) {
          setSelectedOrder((prev) =>
            prev
              ? {
                  ...prev,
                  status: "cancelled",
                }
              : null,
          );
        }

        Swal.fire("Cancelled!", "Order marked as cancelled.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to cancel order.", "error");
    }
  };

  const handleSendToSteadfast = async (id) => {
    if (steadfastLoadingId === id) return;
    const result = await Swal.fire({
      title: "Send to Steadfast?",
      text: "This will create a shipment in Steadfast. You cannot undo this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, send it!",
    });

    if (!result.isConfirmed) return;

    try {
      setStedastLoadingId(id);

      const res = await fetch(`${baseUrl}/api/orders/${id}/steadfast`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (data.success) {
        const updatedOrders = orders.map((order) =>
          order._id === id
            ? {
                ...order,
                steadfast: data.data,
              }
            : order,
        );
        setOrders(updatedOrders);

        Swal.fire({
          icon: "success",
          title: "Sent to Steadfast!",
          html: `<div class="text-left">
            <p><strong>Consignment ID:</strong> ${data.data.consignmentId}</p>
            ${
              data.data.trackingUrl
                ? `<p><a href="${data.data.trackingUrl}" target="_blank" class="text-[#d4af37] underline">View Tracking</a></p>`
                : ""
            }
          </div>`,
          confirmButtonColor: "#d4af37",
        });

        if (selectedOrder?._id === id) {
          setSelectedOrder((prev) =>
            prev
              ? {
                  ...prev,
                  steadfast: data.data,
                }
              : null,
          );
        }
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to send to Steadfast!",
          "error",
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message || "Something went wrong!", "error");
    } finally {
      setStedastLoadingId(null);
    }
  };

  const fetchCounts = async () => {
    const res = await fetch(`${baseUrl}/api/orders/counts`);
    const data = await res.json();

    if (data.success) {
      setCounts(data.data);
    }
  };

  useEffect(() => {
    if (!baseUrl) return;

    fetchCounts();
  }, [baseUrl]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5dccf] p-6 flex justify-center py-12">
        <LoadingAnimation
          width={300}
          height={300}
          message="Loading orders..."
        />
      </div>
    );
  }

  const getPageNumbers = (currentPage, totalPages) => {
    const delta = 2;
    const range = [];

    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = left; i <= right; i++) range.push(i);

    if (left > 2) range.unshift("...");
    if (left > 1) range.unshift(1);

    if (right < totalPages - 1) range.push("...");
    if (right < totalPages) range.push(totalPages);

    return range;
  };

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
              onClick={() => {
                handleFilterChange("all");
              }}
              className={`btn btn-sm ${
                statusFilter === "all"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              All ({counts.all})
            </button>

            <button
              onClick={() => {
                handleFilterChange("pending");
              }}
              className={`btn btn-sm ${
                statusFilter === "pending"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              Pending ({counts.pending})
            </button>

            <button
              onClick={() => {
                handleFilterChange("delivered");
              }}
              className={`btn btn-sm ${
                statusFilter === "delivered"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              Delivered ({counts.delivered})
            </button>

            <button
              onClick={() => {
                handleFilterChange("cancelled");
              }}
              className={`btn btn-sm ${
                statusFilter === "cancelled"
                  ? "bg-[#d4af37] text-white border-[#d4af37]"
                  : "bg-white text-[#3d2f1f] border-[#e5dccf]"
              }`}
            >
              Cancelled ({counts.cancelled})
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
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
                  {orders.map((order, index) => (
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
                          ? new Date(order.createdAt).toLocaleString("en-BD", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "--"}
                      </td>

                      <td>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-sm bg-white text-[#3d2f1f] border border-[#d4af37] hover:bg-[#faf7f0]"
                          >
                            View
                          </button>

                          {order.status === "delivered" ? (
                            <button className="btn btn-sm" disabled>
                              Delivered
                            </button>
                          ) : order.status === "cancelled" ? (
                            <button className="btn btn-sm" disabled>
                              Cancelled
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              className="btn btn-sm bg-[#d4af37] text-white border-none hover:bg-[#c39d2f]"
                              disabled={loadingId === order._id}
                            >
                              {loadingId === order._id
                                ? "Updating..."
                                : "Deliver"}
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
            {orders.map((order, index) => (
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
                      ? new Date(order.createdAt).toLocaleString("en-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
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
                    <button className="btn btn-sm" disabled>
                      Delivered
                    </button>
                  ) : order.status === "cancelled" ? (
                    <button className="btn btn-sm" disabled>
                      Cancelled
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
              </div>
            ))}
          </div>
          <div className="mt-8">
            {/* Mobile pagination */}
            <div className="flex items-center justify-center gap-2 md:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-sm"
              >
                Prev
              </button>

              <span className="rounded-lg border px-4 py-2 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden justify-center md:flex">
              <div className="join">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="join-item btn btn-sm"
                >
                  «
                </button>

                {getPageNumbers(currentPage, totalPages).map((page, i) =>
                  page === "..." ? (
                    <button
                      key={`ellipsis-${i}`}
                      className="join-item btn btn-sm btn-disabled"
                    >
                      ...
                    </button>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`join-item btn btn-sm ${
                        currentPage === page
                          ? "bg-black text-white border-black"
                          : "btn-ghost"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="join-item btn btn-sm"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="p-5 space-y-4">
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

                    <p className="flex items-center gap-3">
                      <span>
                        <span className="font-semibold">Phone:</span>{" "}
                        {selectedOrder.phone}
                      </span>

                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-green-700 px-3 py-1 text-xs font-semibold text-white hover:bg-green-800 transition-colors"
                      >
                        <LuPhone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
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

                    {selectedOrder.source && (
                      <>
                        <div className="border-t border-[#e5dccf] pt-2 mt-2">
                          <p className="font-semibold mb-2">Order Source:</p>
                          <p>
                            <span className="font-medium">Source:</span>{" "}
                            {selectedOrder.source.traffic_source || "direct"}
                          </p>
                          {selectedOrder.source.traffic_medium && (
                            <p>
                              <span className="font-medium">Medium:</span>{" "}
                              {selectedOrder.source.traffic_medium}
                            </p>
                          )}
                          {selectedOrder.source.traffic_campaign && (
                            <p>
                              <span className="font-medium">Campaign:</span>{" "}
                              {selectedOrder.source.traffic_campaign}
                            </p>
                          )}
                        </div>
                      </>
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
                        : selectedOrder.status === "cancelled"
                          ? "Cancelled"
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

                    {selectedOrder.steadfast && (
                      <div className="border-t border-[#e5dccf] pt-3 mt-3">
                        <p className="font-semibold mb-2">
                          Steadfast Tracking:
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          <span className="text-[#d4af37]">Sent</span>
                        </p>
                        <p>
                          <span className="font-medium">Consignment ID:</span>{" "}
                          {selectedOrder.steadfast.consignmentId}
                        </p>
                        {selectedOrder.steadfast.trackingUrl && (
                          <p>
                            <a
                              href={selectedOrder.steadfast.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#d4af37] underline hover:text-[#c39d2f]"
                            >
                              View Tracking
                            </a>
                          </p>
                        )}
                        {selectedOrder.steadfast.sentAt && (
                          <p>
                            <span className="font-medium">Sent at:</span>{" "}
                            {new Date(
                              selectedOrder.steadfast.sentAt,
                            ).toLocaleString("en-BD", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.fraudCheck && (
                <div className="rounded-xl border border-[#e5dccf] p-4">
                  <div className="">
                    {/* Header with Badges */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h3 className="font-semibold text-base text-[#3d2f1f]">
                        Fraud Analysis
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* API Status Badge */}
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f4ede4] text-[#7a6a58]">
                          API: {selectedOrder.fraudCheck.apiStatus}
                        </span>

                        {/* Verification Status Badge */}
                        {selectedOrder.fraudCheck.needsVerification ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 animate-pulse">
                            Needs Verification
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            Safe
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flag Reason Alert Banner (Only shows if there is a reason) */}
                    {selectedOrder.fraudCheck.flagReason && (
                      <div className="mb-4 p-3 rounded-lg shadow-xs border border-[#e5dccf] text-sm text-[#7a6a58]">
                        <span className="font-medium text-[#3d2f1f]">
                          Note:
                        </span>{" "}
                        {selectedOrder.fraudCheck.flagReason}
                      </div>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[#3d2f1f]">
                      {/* Success Ratio Card */}
                      <div className="p-3 rounded-xl shadow-xs border border-[#e5dccf]/60 flex flex-col gap-1">
                        <span className="text-xs text-[#7a6a58] font-medium">
                          Success Ratio
                        </span>
                        <span className="text-xl font-bold text-[#3d2f1f]">
                          {selectedOrder.fraudCheck.successRatio}%
                        </span>
                      </div>

                      {/* Courier Stats Card */}
                      <div className="p-3 rounded-xl shadow-xs border border-[#e5dccf]/60 flex flex-col justify-between">
                        <span className="text-xs text-[#7a6a58] font-medium">
                          Courier Parcels
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-bold">
                            {selectedOrder.fraudCheck.totalParcels}
                          </span>
                          <div className="text-xs space-x-1.5 text-right">
                            <span className="text-emerald-600 font-medium">
                              ✓{selectedOrder.fraudCheck.totalDelivered}
                            </span>
                            <span className="text-rose-600 font-medium">
                              ✕{selectedOrder.fraudCheck.totalCancelled}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Website Orders Card */}
                      <div className="p-3 rounded-xl shadow-xs border border-[#e5dccf]/60 flex flex-col justify-between">
                        <span className="text-xs text-[#7a6a58] font-medium">
                          Website Orders
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-bold">
                            {selectedOrder.fraudCheck.totalWebsiteOrders}
                          </span>
                          <span className="text-xs text-rose-600 font-medium">
                            ✕
                            {
                              selectedOrder.fraudCheck
                                .totalCancelledWebsiteOrders
                            }{" "}
                            cancelled
                          </span>
                        </div>
                      </div>

                      {/* Fraud Reports (Spans full width on small screens for emphasis if needed, or stays grid) */}
                      <div className="col-span-2 sm:col-span-3 p-3 rounded-xl shadow-xs border border-[#e5dccf]/60 flex items-center justify-between">
                        <span className="text-xs text-[#7a6a58] font-medium">
                          Known Fraud Reports
                        </span>
                        <span
                          className={`text-base font-bold ${selectedOrder.fraudCheck.totalFraudReports > 0 ? "text-rose-600" : "text-emerald-600"}`}
                        >
                          {selectedOrder.fraudCheck.totalFraudReports} Reports
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
              <div className="flex gap-2 justify-end">
                {selectedOrder.status !== "delivered" &&
                  selectedOrder.status !== "cancelled" &&
                  (selectedOrder.steadfast?.consignmentId ? (
                    <button className="btn btn-sm cursor-not-allowed" disabled>
                      Sent to Steadfast
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendToSteadfast(selectedOrder._id)}
                      className="btn btn-sm bg-[#01B795] text-white border-none hover:bg-[#01B795]"
                      disabled={steadfastLoadingId === selectedOrder._id}
                    >
                      {steadfastLoadingId === selectedOrder._id
                        ? "Sending..."
                        : "Send To Steadfast"}
                    </button>
                  ))}

                {selectedOrder.status === "cancelled" ? (
                  <button className="btn btn-sm" disabled>
                    Cancelled
                  </button>
                ) : selectedOrder.status === "delivered" ? (
                  <button className="btn btn-sm" disabled>
                    Delivered
                  </button>
                ) : (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    className="btn btn-sm bg-red-600 text-white border-none hover:bg-red-700"
                  >
                    Cancel Order
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
