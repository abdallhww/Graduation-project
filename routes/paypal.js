const express = require('express');
const paypalrouts = express.Router();
const paypalClient = require('../utils/paypal');

paypalrouts.post('/complete-payment3', (req, res) => {
  const { orderId, paymentMethod , totalPrice } = req.body;

  console.log(orderId+" "+paymentMethod+" "+totalPrice);
  
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: totalPrice.toString()
      }
    }]
  });

  try {
    const order =paypalClient.execute(request);
    // redirect to approve link
    const approveLink = order.result.links.find(link => link.rel === 'approve');
    res.redirect(approveLink.href);
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ أثناء إنشاء طلب الدفع في PayPal');
  }
});

paypalrouts.get('/paypal-success', (req, res) => {
  const { token } = req.query; // رمز الطلب من PayPal

  const request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});

  try {
    const capture = paypalClient.execute(request);
    // هنا تحفظ حالة الدفع في قاعدة البيانات كـ "مدفوع"
    res.render('pthank', { message: 'تم الدفع بنجاح عبر PayPal' });
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ أثناء تأكيد الدفع عبر PayPal');
  }
});

module.exports = { paypalrouts };