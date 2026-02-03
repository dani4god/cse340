const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/* ***************************
 *  Classification validation rules
 * ************************** */
validate.classificationRules = () => {
  return [
    // classification_name must not contain spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 1 })
      .withMessage("Classification name must be at least 1 character.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name);
        if (classificationExists) {
          throw new Error("Classification already exists. Please use a different name.");
        }
      }),
  ];
};

/* ***************************
 *  Check classification data and return errors or continue
 * ************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ***************************
 *  Inventory validation rules
 * ************************** */
validate.inventoryRules = () => {
  return [
    // classification_id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please select a classification.")
      .isInt({ min: 1 })
      .withMessage("Invalid classification selected."),

    // inv_make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    // inv_model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    // inv_year is required and must be valid
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: 2050 })
      .withMessage("Year must be a valid 4-digit year between 1900 and 2050."),

    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),

    // inv_image is required and must be valid path
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png|gif|webp)$/i)
      .withMessage("Image path must start with /images/vehicles/ and end with a valid image extension."),

    // inv_thumbnail is required and must be valid path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png|gif|webp)$/i)
      .withMessage("Thumbnail path must start with /images/vehicles/ and end with a valid image extension."),

    // inv_price is required and must be positive
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // inv_miles is required and must be non-negative
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Mileage is required.")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a non-negative number."),

    // inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required.")
      .isLength({ min: 2 })
      .withMessage("Color must be at least 2 characters."),
  ];
};

/* ***************************
 *  Check inventory data and return errors or continue
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
