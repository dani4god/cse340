const pool = require("../database/");

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, review_rating, inv_id, account_id) {
  try {
    const sql = `INSERT INTO review (review_text, review_rating, inv_id, account_id, review_status) 
                 VALUES ($1, $2, $3, $4, 'pending') RETURNING *`;
    return await pool.query(sql, [review_text, review_rating, inv_id, account_id]);
  } catch (error) {
    console.error("addReview error: " + error);
    return error.message;
  }
}

/* ***************************
 *  Get all reviews for a vehicle (approved only)
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM review r
                 JOIN account a ON r.account_id = a.account_id
                 WHERE r.inv_id = $1 AND r.review_status = 'approved'
                 ORDER BY r.review_date DESC`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByInventoryId error: " + error);
    return [];
  }
}

/* ***************************
 *  Get review statistics for a vehicle
 * ************************** */
async function getReviewStats(inv_id) {
  try {
    const sql = `SELECT * FROM vehicle_review_stats WHERE inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0] || null;
  } catch (error) {
    console.error("getReviewStats error: " + error);
    return null;
  }
}

/* ***************************
 *  Check if user already reviewed this vehicle
 * ************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = "SELECT * FROM review WHERE inv_id = $1 AND account_id = $2";
    const review = await pool.query(sql, [inv_id, account_id]);
    return review.rowCount;
  } catch (error) {
    console.error("checkExistingReview error: " + error);
    return 0;
  }
}

/* ***************************
 *  Get all pending reviews (for Admin/Employee)
 * ************************** */
async function getPendingReviews() {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname, 
                 i.inv_make, i.inv_model, i.inv_year
                 FROM review r
                 JOIN account a ON r.account_id = a.account_id
                 JOIN inventory i ON r.inv_id = i.inv_id
                 WHERE r.review_status = 'pending'
                 ORDER BY r.review_date DESC`;
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("getPendingReviews error: " + error);
    return [];
  }
}

/* ***************************
 *  Update review status (approve/reject)
 * ************************** */
async function updateReviewStatus(review_id, status) {
  try {
    const sql = "UPDATE review SET review_status = $1 WHERE review_id = $2 RETURNING *";
    const data = await pool.query(sql, [status, review_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updateReviewStatus error: " + error);
    return error.message;
  }
}

/* ***************************
 *  Get user's reviews
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year, i.inv_id
                 FROM review r
                 JOIN inventory i ON r.inv_id = i.inv_id
                 WHERE r.account_id = $1
                 ORDER BY r.review_date DESC`;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error);
    return [];
  }
}

/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(review_id, review_text, review_rating, account_id) {
  try {
    const sql = `UPDATE review 
                 SET review_text = $1, review_rating = $2, review_status = 'pending'
                 WHERE review_id = $3 AND account_id = $4 
                 RETURNING *`;
    const data = await pool.query(sql, [review_text, review_rating, review_id, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updateReview error: " + error);
    return error.message;
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id, account_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1 AND account_id = $2 RETURNING *";
    const data = await pool.query(sql, [review_id, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("deleteReview error: " + error);
    return error.message;
  }
}

/* ***************************
 *  Get single review by ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year
                 FROM review r
                 JOIN inventory i ON r.inv_id = i.inv_id
                 WHERE r.review_id = $1`;
    const data = await pool.query(sql, [review_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getReviewById error: " + error);
    return null;
  }
}

module.exports = {
  addReview,
  getReviewsByInventoryId,
  getReviewStats,
  checkExistingReview,
  getPendingReviews,
  updateReviewStatus,
  getReviewsByAccountId,
  updateReview,
  deleteReview,
  getReviewById
};
