const { pool } = require("../utils/db");

const ubdutlikes = (req, res, next) => {
    const productId = req.params.id;
    const likes = req.body.likes;
    const userid =req.session.userId;

    console.log(productId+"    "+likes+"user id "+userid);

    const query = 'UPDATE products SET likes = ? WHERE id = ?';

    pool.query(query, [likes, productId], (error, results) => {
        if (error) {
            //return res.status(500).json({ success: false, message: 'Error updating likes' });
            console.log("Error updating likes");
        }
        //res.json({ success: true, message: 'Like status updated successfully' });
        console.log("Like status updated successfull");
    });
  };
  
  module.exports = { ubdutlikes };