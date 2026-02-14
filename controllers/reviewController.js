const reviewModel = require("../models/review-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const reviewCont = {};

/* ***************************
 *  Build add review view
 * ************************** */
reviewCont.buildAddReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const vehicle = await invModel.getInventoryByInvId(inv_id);
  
  if (!vehicle) {
    req.flash("notice", "Vehicle not found.");
    return res.redirect("/");
  }
  
  // Check if user already reviewed
  const existingReview = await reviewModel.checkExistingReview(inv_id, res.locals.accountData.account_id);
  if (existingReview) {
    req.flash("notice", "You have already reviewed this vehicle.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }
  
  res.render("review/add-review", {
    title: `Review ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    errors: null,
    inv_id,
    vehicle,
  });
};

/* ***************************
 *  Process add review
 * ************************** */
reviewCont.addReview = async function (req, res) {
  let nav = await utilities.getNav();
  const { review_text, review_rating, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  
  const addResult = await reviewModel.addReview(
    review_text,
    review_rating,
    inv_id,
    account_id
  );

  if (addResult && !addResult.message) {
    req.flash("notice", "Thank you! Your review has been submitted and is pending approval.");
    res.redirect(`/inv/detail/${inv_id}`);
  } else {
    req.flash("notice", "Sorry, adding the review failed.");
    const vehicle = await invModel.getInventoryByInvId(inv_id);
    res.status(501).render("review/add-review", {
      title: `Review ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      errors: null,
      inv_id,
      vehicle,
      review_text,
      review_rating,
    });
  }
};

/* ***************************
 *  Build review management view (Admin/Employee)
 * ************************** */
reviewCont.buildReviewManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const pendingReviews = await reviewModel.getPendingReviews();
  
  res.render("review/review-management", {
    title: "Review Management",
    nav,
    pendingReviews,
    errors: null,
  });
};

/* ***************************
 *  Approve review
 * ************************** */
reviewCont.approveReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id);
  
  const result = await reviewModel.updateReviewStatus(review_id, 'approved');
  
  if (result && !result.message) {
    req.flash("notice", "Review approved successfully.");
  } else {
    req.flash("notice", "Failed to approve review.");
  }
  
  res.redirect("/review/manage");
};

/* ***************************
 *  Reject review
 * ************************** */
reviewCont.rejectReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id);
  
  const result = await reviewModel.updateReviewStatus(review_id, 'rejected');
  
  if (result && !result.message) {
    req.flash("notice", "Review rejected.");
  } else {
    req.flash("notice", "Failed to reject review.");
  }
  
  res.redirect("/review/manage");
};

/* ***************************
 *  Build user's reviews view
 * ************************** */
reviewCont.buildMyReviews = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const reviews = await reviewModel.getReviewsByAccountId(account_id);
  
  res.render("review/my-reviews", {
    title: "My Reviews",
    nav,
    reviews,
    errors: null,
  });
};

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.params.review_id);
  const review = await reviewModel.getReviewById(review_id);
  
  if (!review || review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "Review not found or you don't have permission.");
    return res.redirect("/review/my-reviews");
  }
  
  res.render("review/edit-review", {
    title: `Edit Review for ${review.inv_year} ${review.inv_make} ${review.inv_model}`,
    nav,
    errors: null,
    review,
  });
};

/* ***************************
 *  Process edit review
 * ************************** */
reviewCont.editReview = async function (req, res) {
  let nav = await utilities.getNav();
  const { review_text, review_rating, review_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  
  const updateResult = await reviewModel.updateReview(
    review_id,
    review_text,
    review_rating,
    account_id
  );

  if (updateResult && !updateResult.message) {
    req.flash("notice", "Your review has been updated and is pending approval.");
    res.redirect("/review/my-reviews");
  } else {
    req.flash("notice", "Sorry, updating the review failed.");
    const review = await reviewModel.getReviewById(review_id);
    res.status(501).render("review/edit-review", {
      title: `Edit Review for ${review.inv_year} ${review.inv_make} ${review.inv_model}`,
      nav,
      errors: null,
      review: {
        ...review,
        review_text,
        review_rating,
      },
    });
  }
};

/* ***************************
 *  Delete review (confirmation view)
 * ************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.params.review_id);
  const review = await reviewModel.getReviewById(review_id);
  
  if (!review || review.account_id !== res.locals.accountData.account_id) {
    req.flash("notice", "Review not found or you don't have permission.");
    return res.redirect("/review/my-reviews");
  }
  
  res.render("review/delete-review", {
    title: `Delete Review`,
    nav,
    errors: null,
    review,
  });
};

/* ***************************
 *  Process delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
  const review_id = parseInt(req.body.review_id);
  const account_id = res.locals.accountData.account_id;
  
  const deleteResult = await reviewModel.deleteReview(review_id, account_id);

  if (deleteResult && !deleteResult.message) {
    req.flash("notice", "Review deleted successfully.");
  } else {
    req.flash("notice", "Failed to delete review.");
  }
  
  res.redirect("/review/my-reviews");
};

module.exports = reviewCont;


















