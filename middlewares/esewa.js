// index.js

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = 3000;

// ─────────────────────────────────────────────
// 🟢 eSewa Configuration (Sandbox)
// ─────────────────────────────────────────────
const config = {
  merchantId: "EPAYTEST",
  secretKey: "8gBm/:&EnhH.1/q",
  esewaUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  successUrl: "http://localhost:3000/success",
  failureUrl: "http://localhost:3000/failure"
};

// ─────────────────────────────────────────────
// 🟢 Generate Signature
// ─────────────────────────────────────────────
function generateSignature(data) {
  return crypto
    .createHmac('sha256', config.secretKey)
    .update(data)
    .digest('base64');
}

// ─────────────────────────────────────────────
// 🟢 Home Route
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <h2>eSewa Payment Integration</h2>
    <a href="/pay">Pay with eSewa</a>
  `);
});

// ─────────────────────────────────────────────
// 🟢 Payment Route
// ─────────────────────────────────────────────
app.get('/pay', (req, res) => {
  const transaction_uuid = Date.now().toString();
  const amount = 100;

  const dataToSign = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${config.merchantId}`;

  const signature = generateSignature(dataToSign);

  const formData = {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transaction_uuid,
    product_code: config.merchantId,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: config.successUrl,
    failure_url: config.failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signature
  };

  res.send(`
    <h3>Redirecting to eSewa...</h3>
    <form id="esewaForm" action="${config.esewaUrl}" method="POST">
      ${Object.keys(formData)
        .map(
          key => `<input type="hidden" name="${key}" value="${formData[key]}" />`
        )
        .join('')}
    </form>

    <script>
      document.getElementById('esewaForm').submit();
    </script>
  `);
});

// ─────────────────────────────────────────────
// 🟢 Success Route
// ─────────────────────────────────────────────
app.get('/success', (req, res) => {
  console.log("Success Response:", req.query);

  res.send(`
    <h2>✅ Payment Successful</h2>
    <p>Your transaction has been completed.</p>
    <a href="/">Go Home</a>
  `);
});

// ─────────────────────────────────────────────
// 🟢 Failure Route
// ─────────────────────────────────────────────
app.get('/failure', (req, res) => {
  res.send(`
    <h2>❌ Payment Failed</h2>
    <a href="/">Try Again</a>
  `);
});

// ─────────────────────────────────────────────
// 🟢 Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});