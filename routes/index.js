const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const productRoute = require("./productRoute");
const brandsRoute = require("./brandRoute");
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const reviewRoute = require("./reviewRoute");
const wishListRoute = require("./wishListRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

const mountRoute = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subCategory", subCategoryRoute);
  app.use("/api/v1/brands", brandsRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishListRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoute;
