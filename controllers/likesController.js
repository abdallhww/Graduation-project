const { pool } = require("../utils/db");

const ubdutlikes = (req, res, next) => {
    const productId = req.params.id;
    const likes = req.body.likes;

    console.log(productId+"    "+likes);

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
  
  module.exports = {ubdutlikes};
  /*// controllers/likesController.js
exports.updateLikes = (req, res) => {
    const productId = req.params.id;
    const likes = req.body.likes;

    const query = 'UPDATE products SET likes = ? WHERE id = ?';
    req.pool.query(query, [likes, productId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Error updating likes' });
        }
        res.json({ success: true, message: 'Like status updated successfully' });
    });
};
*/
  