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

const getBrokerNotes = (req, res) => {
  const query = `
    SELECT 
      broker_notes.*, 
      brokers.name AS broker_name 
    FROM broker_notes
    JOIN brokers ON broker_notes.broker_id = brokers.id
  `;

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("خطأ في الخادم");
    }
    res.render('brokerNotesPage', { notes: results });
  });
};

const replyToNote = (req, res) => {
  const { note_id, reply } = req.body;
  const query = 'UPDATE broker_notes SET reply = ? WHERE id = ?';

  pool.query(query, [reply, note_id], (err, result) => {
    if (err) {
      return res.status(500).send("فشل في حفظ الرد");
    }
    res.render("note-success", { message: "تم  حفظ رد !" });
  });
};
  
  module.exports = { getMyNotes , getBrokerNotes , replyToNote };