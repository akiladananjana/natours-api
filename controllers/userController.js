const User = require("./../models/usersModel");

exports.getAllUsers = async (req, res) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: "Success",
    length: allUsers.length,
    data: allUsers
  });
};

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This API is in development...!"
  });
};

exports.addUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This API is in development...!"
  });
};

exports.deleteUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This API is in development...!"
  });
};

exports.updateUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This API is in development...!"
  });
};
