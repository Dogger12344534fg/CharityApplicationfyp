import crypto from "crypto";

const ESEWA_CONFIG = {
  productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  clientId: process.env.ESEWA_CLIENT_ID || "JB0BBQ4aD0UqIThFJwAKBgAXATM4GoeR",
  clientSecret:
    process.env.ESEWA_CLIENT_SECRET ||
    "BhwIWQQubikZTpixn8bngu6H2YiPOhLw3aeE6RgB",
  paymentUrl:
    process.env.ESEWA_PAYMENT_URL ||
    "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  verifyUrl:
    process.env.ESEWA_VERIFY_URL ||
    "https://rc.esewa.com.np/api/epay/transaction/status/",
};

export const generateSignature = (message) => {
  return crypto
    .createHmac("sha256", ESEWA_CONFIG.clientSecret)
    .update(message)
    .digest("base64");
};

export const buildEsewaPayload = ({
  totalAmount,
  transactionUuid,
  successUrl,
  failureUrl,
}) => {
  const formattedTotal = parseFloat(totalAmount).toFixed(1);

  const message = `total_amount=${formattedTotal},transaction_uuid=${transactionUuid},product_code=${ESEWA_CONFIG.productCode}`;
  const signature = generateSignature(message);

  return {
    amount: formattedTotal,
    tax_amount: "0",
    total_amount: formattedTotal,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_CONFIG.productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };
};

export const verifyEsewaPayment = async ({ totalAmount, transactionUuid }) => {
  const url = `${ESEWA_CONFIG.verifyUrl}?product_code=${ESEWA_CONFIG.productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`eSewa verification request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const decodeEsewaResponse = (encodedData) => {
  const decoded = Buffer.from(encodedData, "base64").toString("utf-8");
  return JSON.parse(decoded);
};

export const verifyResponseSignature = (decodedData) => {
  const {
    total_amount,
    transaction_uuid,
    product_code,
    signed_field_names,
    signature,
  } = decodedData;

  const fields = signed_field_names.split(",");
  const message = fields.map((f) => `${f}=${decodedData[f]}`).join(",");
  const expectedSignature = generateSignature(message);

  return signature === expectedSignature;
};

export { ESEWA_CONFIG };
