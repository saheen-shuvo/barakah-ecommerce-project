"use client";
import { useEffect, useState } from "react";

const toInputFormat = (ddmmyyyy) => {
  if (!ddmmyyyy || !ddmmyyyy.includes("-")) return "";
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD for <input type="date">
};

const toDisplayFormat = (yyyymmdd) => {
  if (!yyyymmdd || !yyyymmdd.includes("-")) return "";
  const [yyyy, mm, dd] = yyyymmdd.split("-");
  if (!dd || !mm || !yyyy) return "";
  return `${dd}-${mm}-${yyyy}`; // DD-MM-YYYY for display + API
};

const DateAnalyticsCard = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const todayInput = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const todayDisplay = toDisplayFormat(todayInput); // DD-MM-YYYY

  const [date, setDate] = useState(todayDisplay); // always stored as DD-MM-YYYY
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const fetchByDate = async (ddmmyyyy) => {
    if (!baseUrl || !ddmmyyyy) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/orders/by-date?date=${ddmmyyyy}`, // DD-MM-YYYY to backend
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
    void fetchByDate(todayDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#e5dccf] p-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">Order Analytics by Date</p>

        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={toInputFormat(date)} // convert to YYYY-MM-DD for the input
            max={todayInput}
            onChange={(e) => setDate(toDisplayFormat(e.target.value))} // store back as DD-MM-YYYY
            className="input input-bordered"
          />
          <button
            onClick={() => fetchByDate(date)}
            disabled={loading}
            className="btn bg-[#d4af37] text-white border-none disabled:opacity-60"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {analytics ? (
          <div className="gap-6 grid grid-cols-2">
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
                {analytics.totalDelivered}
              </h3>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered Amount</p>
              <h3 className="text-3xl font-bold text-green-600">
                {analytics.totalRevenue}
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

export default DateAnalyticsCard;
