const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  
  // If no vehicles found, throw 404 error
  if (!data || data.length === 0) {
    const error = new Error("Sorry, no vehicles could be found for this classification.");
    error.status = 404;
    throw error;
  }
  
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  
  // If vehicle not found, throw 404 error
  if (!data) {
    const error = new Error("Sorry, the vehicle you are looking for does not exist.");
    error.status = 404;
    throw error;
  }
  
  const detailHTML = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail: detailHTML,
  });
};

module.exports = invCont;
