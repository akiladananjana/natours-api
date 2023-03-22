const User = require("./../models/usersModel");
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
