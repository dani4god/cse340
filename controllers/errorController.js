const errorCont = {};

/* ***************************
 *  Trigger Intentional Error (500)
 * ************************** */
errorCont.triggerError = async function (req, res, next) {
  // Intentionally throw an error
  const error = new Error("This is an intentional 500 error for testing purposes.");
  error.status = 500;
  throw error;
};

module.exports = errorCont;
