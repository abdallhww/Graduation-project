const { paypal, paypalClient } = require('../utils/paypal');
const { pool } = require('../utils/db');

// إنشاء طلب الدفع
const completePayment = async (req, res) => {
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

    const order = await paypalClient.execute(request);
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
};

// تأكيد الدفع بعد النجاح
const successPayment = async (req, res) => {
  const { token } = req.query;

  const request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    console.log('PayPal Capture Response:', capture);

    if (capture && capture.result && capture.result.status === 'COMPLETED') {
      const paypalOrderId = capture.result.id;

      pool.query(
        'UPDATE orders SET payment_status = ? WHERE paypal_order_id = ?',
        ['PAID', paypalOrderId]
      );

      res.render('pthank', { message: '✅ تم الدفع بنجاح عبر PayPal!' });
    } else {
      res.status(500).send('لم يتم تأكيد الدفع. يرجى المحاولة مرة أخرى.');
    }
  } catch (err) {
    console.error('PayPal Capture Error:', err);
    res.status(500).send('حدث خطأ أثناء تأكيد الدفع عبر PayPal');
  }
};

// إلغاء الدفع
const cancelPayment = (req, res) => {
  const orderId = req.query.orderId;
  const statusText = "طلب ملغي";

  console.log(orderId);

  pool.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [statusText, orderId]
  );

  res.render('pthank', { message: '❌ تم إلغاء عملية الدفع' });
};

module.exports = {completePayment , successPayment , cancelPayment};