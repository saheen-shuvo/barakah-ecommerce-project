"use client";

import { useEffect } from "react";
import { pushToDataLayer } from "@/lib/gtm";

export default function ViewItemTracker({ product }) {
  useEffect(() => {
    if (!product?._id) return;

    const sessionKey = `view_item_${product._id}`;
    const alreadyTracked = sessionStorage.getItem(sessionKey);
    if (alreadyTracked) return;

    pushToDataLayer({
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: Number(product.price || 0),
        items: [
          {
            item_id: product._id || "",
            item_name: product.name || "",
            price: Number(product.price || 0),
            quantity: 1,
          },
        ],
      },
    });

    sessionStorage.setItem(sessionKey, "true");
  }, [product]);

  return null;
}