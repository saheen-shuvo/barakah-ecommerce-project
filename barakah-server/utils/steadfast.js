const calculateCOD = (paymentMethod, total) => {
  return paymentMethod === "bkash" || paymentMethod === "nagad"
    ? 0
    : Number(total);
};

const transformOrderToSteadfast = (order) => {
  return {
    invoice: order._id.toString(),
    recipient_name: order.customerName,
    recipient_phone: order.phone,
    recipient_address: order.address,
    cod_amount: calculateCOD(order.paymentMethod, order.total),
    note: order.notes || "",
    item_description:
      order.items?.map((item) => item.name).join(", ") || "",
  };
};

const callSteadfast = async (payload) => {
  const apiUrl = process.env.STEADFAST_API_URL;
  const apiKey = process.env.STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY;

  if (!apiUrl || !apiKey || !secretKey) {
    throw new Error(
      "Steadfast API credentials not configured."
    );
  }

  const response = await fetch(`${apiUrl}/create_order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
      "Secret-Key": secretKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || `Steadfast API Error (${response.status})`
    );
  }

  return data;
};

module.exports = {
  calculateCOD,
  transformOrderToSteadfast,
  callSteadfast,
};