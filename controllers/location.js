const {pool} = require('../utils/db');

const saveLocation = (req, res) => {
  const { orderId, location } = req.body;
  const brokerId = req.params.brokerId; // من عنوان الرابط /save-location/:brokerid

console.log(brokerId);

  try {
    pool.query('UPDATE orders SET location = ? WHERE id = ?', [location, orderId]);

    res.render('location-saved', { brokerId });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('حدث خطأ أثناء حفظ الموقع.');
  }
};

const thanks = (req, res) => {
  const { orderId, paymentMethod } = req.body;

  console.log(orderId);

  try {
    pool.query(
      'UPDATE orders SET payment_method = ? WHERE id = ?',
      [paymentMethod, orderId]
    );

    // إعادة التوجيه لصفحة الشكر بعد تحديث الطلب
   res.render('thank-you');
  } catch (err) {
    console.error('Error updating payment method:', err);
    res.status(500).send('حدث خطأ أثناء إكمال عملية الدفع');
  }
};

const thanks2 = (req, res) => {
  const { orderId, paymentMethod } = req.body;

  console.log(orderId);

  try {
    pool.query(
      'UPDATE orders SET payment_method = ? WHERE id = ?',
      [paymentMethod, orderId]
    );

    // إعادة التوجيه لصفحة الشكر بعد تحديث الطلب
   res.render('card-payment');
  } catch (err) {
    console.error('Error updating payment method:', err);
    res.status(500).send('حدث خطأ أثناء إكمال عملية الدفع');
  }
};

module.exports = { saveLocation , thanks , thanks2 };