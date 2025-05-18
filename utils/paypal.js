const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.DB_Client_ID,
  process.env.DB_Secret_key_1
  
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;