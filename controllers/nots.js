const { pool } = require("../utils/db");

const getMyNotes = (req, res) => {
  const broker_id = req.session.userId;

  if (!broker_id) {
    return res.redirect('/login');
  }

  const query = `
    SELECT bn.*, o.total_price, o.status, o.created_at 
    FROM broker_notes bn 
    JOIN orders o ON bn.order_id = o.id 
    WHERE bn.broker_id = ?
    ORDER BY bn.created_at DESC
  `;

  pool.query(query, [broker_id], (err, notes) => {
    if (err) {
      console.error('خطأ في جلب الملاحظات:', err);
      return res.status(500).send('حدث خطأ أثناء جلب الملاحظات');
    }

    res.render('my-notes', { notes });
  });
};
  
  module.exports = { getMyNotes };