/* eslint-disable no-console */
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./env.config" });

const app = require("./app");

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
    useFindAndModify: false
  })
  .then(result => {
    console.log("DB Conn Success...!");
  })
  .catch(error => {
    console.log("Error Conn to DB...!");
    console.log(error);
  });

const PORT = 4000 || process.env.PORT;

app.listen(PORT, "127.0.0.1", () => {
  console.log("Server started...!");
});
