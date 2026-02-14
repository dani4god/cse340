const utilities = require(".");
const { body, validationResult } = require("express-validator");
const reviewModel = require("../models/review-model");
const validate = {};

/* ***************************
 *  Review validation rules
 * ************************** */
validate.reviewRules = () => {
  return [
    // review_text is required
    body("review_text")
      .trim()
      .notEmpty()
      .withMessage("Review text is required.")
      .isLength({ min: 10, max: 1000 })
      .withMessage("Review must be between 10 and 1000 characters."),

    // review_rating is required and must be 1-5
    body("review_rating")
      .trim()
      .notEmpty()
      .withMessage("Rating is required.")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5."),

    // inv_id is required
    body("inv_id")
      .trim()
      .notEmpty()
      .withMessage("Vehicle ID is required.")
      .isInt({ min: 1 })
      .withMessage("Invalid vehicle ID."),
  ];
};

/* ******************************
 * Check review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { review_text, review_rating, inv_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const invModel = require("../models/inventory-model");
    const vehicle = await invModel.getInventoryByInvId(inv_id);
    
    // Determine if this is add or edit
    const isEdit = req.body.review_id ? true : false;
    
    if (isEdit) {
      const review = await reviewModel.getReviewById(req.body.review_id);
      res.render("./review/edit-review", {
        errors,
        title: `Edit Review for ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        review: {
          ...review,
          review_text,
          review_rating,
        },
      });
    } else {
      res.render("./review/add-review", {
        errors,
        title: `Review ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        inv_id,
        vehicle,
        review_text,
        review_rating,
      });
    }
    return;
  }
  next();
};

module.exports = validate;
