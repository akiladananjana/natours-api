const User = require("./../models/usersModel");
const sendEmail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jsonSecret = "this-is-my-very-secure-json-web-token-secret-key";

const checkPassword = async (candidatePassword, password) => {
  return await bcrypt.compare(candidatePassword, password);
};

const createJWT = id => {
  return jwt.sign({ id: id }, jsonSecret, {
    expiresIn: "30d"
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    // Creating JWT
    const token = createJWT(newUser.id);

    res.status(201).json({
      status: "Success",
      token: token,
      user: newUser
    });
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error
    });
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1) Check if email and password are exists in request
  if (!email || !password)
    return next(res.status(404).json({ status: "NO EMAIL or PASSWORD...!" }));

  // 2) Check if email and password are correct againt the DB
  const authUserDoc = await User.findOne({ email });

  // console.log(await checkPassword(password, authUserDoc.password));
  if (!authUserDoc || !(await checkPassword(password, authUserDoc.password))) {
    return next(
      res.status(404).json({ status: "INVALID EMAIL or PASSWORD...!" })
    );
  }

  // 3) If everything OK, then send JWT to
  const token = createJWT(authUserDoc.id);

  res.status(201).json({
    status: "Success",
    token: token
  });
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Check if token available in the header
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "Fail",
        message: "You are not logged In, Please logIn to access tours...!"
      });
    }

    // 2) Token Verification
    const decoded = await jwt.verify(token, jsonSecret);

    // 3) Check if user still exists
    const userDetails = await User.findById(decoded.id);

    if (!userDetails) {
      return res.status(401).json({
        status: "Fail",
        message:
          "User is not available in our database, Sign Up to access tours...!"
      });
    }

    // 4) Check if user changed the password after the token was issued
    const JWTTimestamp = decoded.iat;
    const userPasswordLastChangedTimestamp =
      userDetails.passwordLastChanged.getTime() / 1000;

    if (userPasswordLastChangedTimestamp > JWTTimestamp) {
      return res.status(401).json({
        status: "Fail",
        message: "Password was changed, Please log In again...!"
      });
    }

    console.log(JWTTimestamp, userPasswordLastChangedTimestamp);

    req.userDetails = userDetails;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "Fail",
      message: "Something went wrong bro...!"
    });
  }
};

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userDetails.role)) {
      return res.status(403).json({
        status: "Fail",
        message: "You don't have privileges to delete operations...!"
      });
    }

    next();
  };
};

exports.forgetPassword = async (req, res, next) => {
  // 1) Find the User
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send("User not found!");
  }

  // 2) Create a Token
  const token = user.createForgetPasswordToken();
  await user.save({ validateBeforeSave: false });

  console.log(token);

  // 3) Send a email to reset the password
  const resetURL = `http://127.0.0.1:4000/api/v1/users/resetPassword/${token}`;
  const message = `Forget your password? Submit a PATCH request with your new password and PasswordConfirm to ${resetURL}`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset Token (Valid for 10mins)",
    message
  });

  res.status(200).send("OK!");

  next();
};

exports.resetPassword = (req, res, next) => {
  console.log(req.body.email);

  next();
};
