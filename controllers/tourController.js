const { request } = require('../app');

const Tour = require('./../models/toursModel');

exports.addTour = async (req, res) => {
  try {
    // Create a new Doc
    const tourData = await Tour.create(req.body);

    // Send response in JSON format
    res.status(201).json({
      status: 'Success',
      tour: tourData
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: 'Failed to add Data'
    });
  }
};

//////////////////////////////////////////////////////////////////

exports.getAllTours = (req, res) => {};

//////////////////////////////////////////////////////////////////

exports.getTourById = (req, res) => {};

//////////////////////////////////////////////////////////////////

exports.updateTour = (req, res) => {};

//////////////////////////////////////////////////////////////////

exports.deleteTourById = (req, res) => {};

//////////////////////////////////////////////////////////////////
