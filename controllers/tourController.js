const Tour = require("./../models/toursModel");
const APIFeatures = require("./../utils/apiFeatures");

/////////////// Tour Stat using Aggregation Pipeline /////////////////////

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // Filter the Docs
      { $match: { price: { $gt: 1000 } } },

      // Group the docs
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRatings: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },

      // Sort by avgPrice
      {
        $sort: { avgPrice: 1 }
      }
    ]);

    res.status(200).json({
      status: "Success",
      data: stats
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

/////////////// Get Busyiest Month using Aggregation Pipeline /////////////////////

exports.getBusyMonth = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numToursStarts: { $sum: 1 },
          tours: { $push: "$name" }
        }
      },
      {
        $addFields: { month: "$_id" }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numToursStarts: -1 }
      }
    ]);

    res.status(200).json({
      status: "Success",
      length: plan.length,
      data: plan
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

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
