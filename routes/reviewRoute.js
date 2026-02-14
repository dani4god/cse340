// Needed Resources 
const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const validate = require('../utilities/reviewValidation');

// Route to build add review view (requires login)
router.get("/add/:inv_id", 
  utilities.checkLogin, 
  utilities.handleErrors(reviewController.buildAddReview)
);

// Route to process add review (requires login)
router.post("/add",
  utilities.checkLogin,
  validate.reviewRules(),
  validate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Route to build review management view (requires Employee or Admin)
router.get("/manage",
  utilities.checkAccountType,
  utilities.handleErrors(reviewController.buildReviewManagement)
);

// Route to approve review (requires Employee or Admin)
router.get("/approve/:review_id",
  utilities.checkAccountType,
  utilities.handleErrors(reviewController.approveReview)
);

// Route to reject review (requires Employee or Admin)
router.get("/reject/:review_id",
  utilities.checkAccountType,
  utilities.handleErrors(reviewController.rejectReview)
);

// Route to view user's reviews (requires login)
router.get("/my-reviews",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildMyReviews)
);

// Route to build edit review view (requires login)
router.get("/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
);

// Route to process edit review (requires login)
router.post("/edit",
  utilities.checkLogin,
  validate.reviewRules(),
  validate.checkReviewData,
  utilities.handleErrors(reviewController.editReview)
);

// Route to build delete confirmation view (requires login)
router.get("/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteReview)
);

// Route to process delete review (requires login)
router.post("/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
