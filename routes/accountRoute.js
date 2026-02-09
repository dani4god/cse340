// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const validate = require('../utilities/accountValidation');

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build account management view (requires login)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Route to build account update view (requires login)
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

// Process the registration
router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process account update
router.post(
  "/update",
  validate.updateAccountRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password update
router.post(
  "/update-password",
  validate.updatePasswordRules(),
  validate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;
