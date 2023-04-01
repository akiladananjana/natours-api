const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);

userRouter.post("/resetPassword", authController.resetPassword);
userRouter.post("/forgetPassword", authController.forgetPassword);

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.addUser);

userRouter
  .route("/:id")
  .get(userController.getUserById)
  .delete(userController.deleteUserById)
  .patch(userController.updateUserById);

module.exports = userRouter;
