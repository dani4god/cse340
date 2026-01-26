
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailView = async function (vehicle) {
  let detail = '<div class="vehicle-detail">';
  
  // Vehicle image
  detail += '<div class="vehicle-image">';
  detail += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">`;
  detail += '</div>';
  
  // Vehicle information
  detail += '<div class="vehicle-info">';
  
  // Price - prominently displayed
  detail += '<div class="vehicle-price">';
  detail += `<span class="price-label">Price:</span> `;
  detail += `<span class="price-value">$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
  detail += '</div>';
  
  // Description
  detail += '<div class="vehicle-description">';
  detail += `<h2>Description</h2>`;
  detail += `<p>${vehicle.inv_description}</p>`;
  detail += '</div>';
  
  // Specifications
  detail += '<div class="vehicle-specs">';
  detail += '<h2>Specifications</h2>';
  detail += '<dl>';
  
  detail += '<dt>Year:</dt>';
  detail += `<dd>${vehicle.inv_year}</dd>`;
  
  detail += '<dt>Make:</dt>';
  detail += `<dd>${vehicle.inv_make}</dd>`;
  
  detail += '<dt>Model:</dt>';
  detail += `<dd>${vehicle.inv_model}</dd>`;
  
  detail += '<dt>Mileage:</dt>';
  detail += `<dd>${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</dd>`;
  
  detail += '<dt>Color:</dt>';
  detail += `<dd>${vehicle.inv_color}</dd>`;
  
  detail += '</dl>';
  detail += '</div>';
  
  detail += '</div>'; // Close vehicle-info
  detail += '</div>'; // Close vehicle-detail
  
  return detail;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
