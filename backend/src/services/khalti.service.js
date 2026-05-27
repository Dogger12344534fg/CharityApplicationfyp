// services/khalti.service.js

const KHALTI_CONFIG = {
  secretKey: process.env.KHALTI_SECRET_KEY,
  initiateUrl: process.env.KHALTI_INITIATE_URL || "https://a.khalti.com/api/v2/epayment/initiate/",
  lookupUrl: process.env.KHALTI_LOOKUP_URL || "https://a.khalti.com/api/v2/epayment/lookup/",
};

// Khalti uses a simple POST with Authorization header
// No signature needed — Khalti handles security differently from eSewa

export const initiateKhaltiPayment = async ({
  totalAmount,
  transactionUuid,
  successUrl,
  failureUrl,
  productName,
}) => {
  const response = await fetch(KHALTI_CONFIG.initiateUrl, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: successUrl,
      website_url: process.env.FRONTEND_URL || "http://localhost:3000",
      amount: totalAmount * 100, // Khalti uses paisa (multiply by 100)
      purchase_order_id: transactionUuid,
      purchase_order_name: productName || "Setu Donation",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail || "Khalti initiation failed.");
  }

  return response.json();
  // returns: { pidx, payment_url, expires_at, expires_in }
};

export const verifyKhaltiPayment = async (pidx) => {
  const response = await fetch(KHALTI_CONFIG.lookupUrl, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail || "Khalti verification failed.");
  }

  return response.json();
  // returns: { pidx, status, transaction_id, total_amount, ... }
};

export { KHALTI_CONFIG };