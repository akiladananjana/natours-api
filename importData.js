const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("./models/toursModel");

dotenv.config({ path: "./env.config" });

const tourData = fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8");
const toursJson = JSON.parse(tourData);

// const DbConnectionString = process.env.MONGODB_CONN.replace(
//   '<PASSWORD>',
//   process.env.MONGODB_ACCESS_PASSWORD
// );

const DbConnectionString = process.env.MONGODB_LOCAL;

console.log(DbConnectionString);

mongoose
  .connect(DbConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log("DB Conn Success...!");

    insertData();
    // deleteData();
  })
  .catch(error => {
    console.log("Error Conn to DB...!");
    console.log(error);
  });

///////////////////////////////////////////////////

const insertData = async () => {
  try {
    await Tour.create(toursJson);
  } catch (error) {
    console.log(error);
  }
  console.log("Data Loaded...!");
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (error) {
    console.log(error);
  }
  console.log("Data Deleted...!");
  process.exit();
};
