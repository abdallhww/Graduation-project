const express = require('express');
const paypalrouts = express.Router();
const { paypal , paypalClient } = require('../utils/paypal');
const {pool} = require('../utils/db');

paypalrouts.post('/complete-payment3', async (req, res) => {
  const { orderId, paymentMethod, totalPrice } = req.body;

  console.log(orderId + " " + paymentMethod + " " + totalPrice);


  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: {
      currency_code: 'USD',
      value: totalPrice.toString()
    }
  }],
  application_context: {
    return_url: 'http://localhost:3000/paypal-success',
    cancel_url: `http://localhost:3000/paypal-cancel?orderId=${orderId}`
  }
});


  try {

    pool.query(
      'UPDATE orders SET payment_method = ? WHERE id = ?',
      [paymentMethod, orderId]
    );

    const order = await paypalClient.execute(request); // ✅ تأكد من استخدام await
    console.log('PayPal Order Response:', order);

    if (order && order.result && order.result.links) {
      const approveLink = order.result.links.find(link => link.rel === 'approve');
      if (approveLink) {
        return res.redirect(approveLink.href);
      } else {
        return res.status(500).send('لم يتم العثور على رابط الموافقة في استجابة PayPal.');
      }
    } else {
      return res.status(500).send('استجابة PayPal غير متوقعة أو ناقصة.');
    }

  } catch (err) {
    console.error('PayPal Error:', err);
    res.status(500).send('حدث خطأ أثناء إنشاء طلب الدفع في PayPal');
  }
});

paypalrouts.get('/paypal-success', async (req, res) => {
  const { token } = req.query; // هذا هو order ID الذي أعاده PayPal

  const request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});

  try {
    // تنفيذ الطلب لتأكيد الدفع
    const capture = await paypalClient.execute(request);
    console.log('PayPal Capture Response:', capture);

    if (
      capture &&
      capture.result &&
      capture.result.status === 'COMPLETED'
    ) {
      const paypalOrderId = capture.result.id;

      // تحديث قاعدة البيانات لتأكيد الدفع
       pool.query(
        'UPDATE orders SET payment_status = ? WHERE paypal_order_id = ?',
        ['PAID', paypalOrderId]
      );

      // عرض صفحة الشكر
      res.render('pthank', { message: '✅ تم الدفع بنجاح عبر PayPal!' });
    } else {
      res.status(500).send('لم يتم تأكيد الدفع. يرجى المحاولة مرة أخرى.');
    }
  } catch (err) {
    console.error('PayPal Capture Error:', err);
    res.status(500).send('حدث خطأ أثناء تأكيد الدفع عبر PayPal');
  }
});

paypalrouts.get('/paypal-cancel', (req, res) => {

  const orderId = req.query.orderId;
  const srt="طلب ملغي";

  console.log(orderId);

  pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [srt, orderId]
    );

  res.render('pthank', { message: '❌ تم إلغاء عملية الدفع   ' });
});

module.exports = { paypalrouts };