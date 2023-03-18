const express = require('express');
const tourController = require('./../controllers/tourController');
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkTourId);

tourRouter
  .get('/', tourController.getAllTours)

  // We can use more than one middleware on routers
  // .post('/', tourController.checkBody, tourController.addTour)

  .post('/', tourController.addTour)
  .get('/:id', tourController.getTourById)
  .patch('/:id', tourController.updateTour)
  .delete('/:id', tourController.deleteTourById);

module.exports = tourRouter;
