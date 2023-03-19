const Tour = require("./../models/toursModel");
const APIFeatures = require("./../utils/apiFeatures");

////////////////////////// Alias Route ///////////////////////////
exports.fillTop5CheapRoute = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,summary,duration";
  next();
};

///////////////////////// Add Tour Route /////////////////////////
exports.addTour = async (req, res) => {
  try {
    // Create a new Doc
    const tourData = await Tour.create(req.body);

    // Send response in JSON format
    res.status(200).json({
      status: "Success",
      data: tourData
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

/////////////////////// Get All Tours Route ///////////////////////
exports.getAllTours = async (req, res) => {
  // req.query includes all URL Parameters

  try {
    const featuresQuery = new APIFeatures(Tour, req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    // Finally we Execut the query against MongoDB Database
    const tours = await featuresQuery.query;

    res.status(200).json({
      status: "Success",
      length: tours.length,
      data: tours
    });
  } catch (error) {
    res.status(404).json({
      status: "Error in Request...!",
      message: error
    });
  }
};

//////////////////////////////////////////////////////////////////

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: tour
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

//////////////////////////////////////////////////////////////////

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return updated object
      runValidators: true // re-run schema validators before updating
    });

    res.status(200).json({
      status: "Success",
      data: tour
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

//////////////////////////////////////////////////////////////////

exports.deleteTourById = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndRemove(req.params.id);

    res.status(204).json({
      status: "Success",
      data: tour
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

//////////////////////////////////////////////////////////////////
