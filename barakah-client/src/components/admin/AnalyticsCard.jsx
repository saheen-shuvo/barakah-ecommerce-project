/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";

const AnalyticsCard = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const [days, setDays] = useState(1);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  const fetchAnalytics = async (daysCount) => {
    if (!baseUrl) return;

    try {
      const res = await fetch(
        `${baseUrl}/api/orders/analytics?days=${daysCount}`,
        {
          cache: "no-store",
        },
      );

      const data = await res.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchAnalytics(1);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#e5dccf] p-6">
      <div className="flex flex-col gap-4 items-start  justify-between">
        <p className="text-sm text-gray-500">Total Delivered Orders</p>
        <div className="flex gap-2 items-center">
          <span className="font-medium">Last</span>

          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
            className="input input-bordered w-24"
          />

          <span className="font-medium">Days</span>

          <button
            onClick={() => fetchAnalytics(days)}
            className="btn bg-[#d4af37] text-white border-none"
          >
            Search
          </button>
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-sm text-gray-500">Delivered </p>
            <h3 className="text-3xl font-bold">{analytics.totalOrders}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <h3 className="text-3xl font-bold">{analytics.totalRevenue}</h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">Cancelled</p>
            <h3 className="text-3xl font-bold">{analytics.totalCancelled}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
