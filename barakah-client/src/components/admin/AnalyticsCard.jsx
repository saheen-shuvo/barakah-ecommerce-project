/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";

const AnalyticsCard = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalOrdersRevenue: 0,
    deliveredOrders: 0,
    deliveredRevenue: 0,
    totalCancelled: 0,
    cancelledRevenue: 0,
    totalPending: 0,
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchAnalytics = async (daysCount) => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/orders/analytics?days=${daysCount}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (data.success) setAnalytics(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics(days);
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${baseUrl}/api/orders/export?days=${days}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!data.success) return;

      const headers = ["Name", "Date", "Address", "Amount", "Mobile", "Status"];

      const rows = data.data.map((order) => [
        order.customerName,
        formatDate(order.deliveredAt ?? order.cancelledAt ?? order.createdAt),
        order.address,
        order.total,
        order.phone,
        order.status,
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-last-${days}-days.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e5dccf] p-6">
      <div className="flex flex-col gap-4 items-start justify-between">
        <p className="text-sm text-gray-500">Total Order Analytics</p>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-500">Last</span>

          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
            className="input input-bordered w-16 border-gray-300 focus:border-[#d4af37] focus:ring-0"
          />

          <span className="text-sm text-gray-500">Days</span>

          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            <button
              onClick={() => fetchAnalytics(days)}
              disabled={loading}
              className="btn btn-xs md:btn-md bg-[#d4af37] text-white border-none disabled:opacity-60 text-xs w-20"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="btn btn-xs md:btn-md bg-[#0f2a44] text-white border-none disabled:opacity-60 text-xs w-20"
            >
              {exporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>

        {analytics ? (
          <div className="grid grid-cols-2 justify-between gap-6 w-full">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-3xl font-bold text-[#d4af37]">
                {analytics.totalOrders}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <h3 className="text-3xl font-bold text-[#d4af37]">
                {analytics.totalOrdersRevenue}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <h3 className="text-3xl font-bold text-green-600">
                {analytics.deliveredOrders}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Delivered Amount</p>
              <h3 className="text-3xl font-bold text-green-600">
                {analytics.deliveredRevenue}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <h3 className="text-3xl font-bold text-red-500">
                {analytics.totalCancelled}
              </h3>
            </div>

            <div>
              <p className="text-sm text-gray-500">Cancelled Amount</p>
              <h3 className="text-3xl font-bold text-red-500">
                {analytics.cancelledRevenue}
              </h3>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Select a date and press Search
          </p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
