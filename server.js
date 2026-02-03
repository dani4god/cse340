/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const flash = require("connect-flash");
const pool = require('./database/')
const static = require("./routes/static");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const baseController = require("./controllers/basecontroller");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const utilities = require("./utilities/");
const errorMiddleware = require("./middleware/errorMiddleware");
const accountRoute = require("./routes/accountRoute");

/* ***********************
 * View Engine and Templates
 *************************/
/* ***********************
 * Middleware
 * ************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'change-this-secret-key',
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})








/* ***********************
 * Middleware
 * ************************/

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);
// Account routes
app.use("/account", accountRoute);


// ⭐⭐⭐ ADD THIS - Makes nav available to all views ⭐⭐⭐
app.use(async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
  next();
});

// Index route - wrap with error handler
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes - error handling applied in route file
app.use("/inv", inventoryRoute);

// Error routes - for intentional error testing
app.use("/error", utilities.handleErrors(errorRoute));

// 404 handler - must be after all other routes
app.use(errorMiddleware.notFoundHandler);

// Error handling middleware - must be last
app.use(errorMiddleware.errorHandler);

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
