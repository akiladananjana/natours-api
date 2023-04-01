const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkTourId);

tourRouter.get(
  "/top-5-cheap",
  tourController.fillTop5CheapRoute,
  tourController.getAllTours
);

tourRouter.get("/tour-stats", tourController.getTourStats);
tourRouter.get("/monthly-plan/:year", tourController.getBusyMonth);

tourRouter
  .get("/", authController.protect, tourController.getAllTours)

  // We can use more than one middleware on routers
  // .post('/', tourController.checkBody, tourController.addTour)

  .post("/", tourController.addTour)

  // this 'id' can access using req.params.id
  .get("/:id", tourController.getTourById)

  .patch("/:id", tourController.updateTour)
  .delete(
    "/:id",
    authController.protect,
    authController.restrict("admin", "tour-guide"),
    tourController.deleteTourById
  );

module.exports = tourRouter;
