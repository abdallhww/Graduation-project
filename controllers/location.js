const {pool} = require('../utils/db'); // الاتصال بقاعدة البيانات

const saveLocation = (req, res) => {
  const { orderId, location } = req.body;
  const brokerId = req.params.brokerId; // من عنوان الرابط /save-location/:brokername

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
  res.render('thank-you');
};

module.exports = { saveLocation , thanks };